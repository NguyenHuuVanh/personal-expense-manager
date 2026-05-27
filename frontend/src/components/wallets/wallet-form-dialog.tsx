"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogMain,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/shadcn-ui/dialog";
import { SelectField } from "@/components/custom-fields/select-field";
import { toast } from "sonner";
import { Wallet as WalletIcon, CreditCard, Building2, Smartphone } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatInputValue, parseInputForSubmit } from "@/utils/format-number";
import { useBanks, findBankByCode } from "@/hooks/use-banks";
import { EWALLET_OPTIONS } from "@/types/wallet";
import type { WalletFormData, Wallet } from "@/types/wallet";
import type { Bank } from "@/types/bank";
import type { IOptionSelect } from "@/types/fields";

// =====================
// Types
// =====================
type WalletType = "cash" | "bank" | "e-wallet" | "card";

// Zod schema cho validation
const walletFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Tên ví không được để trống")
      .max(100, "Tên ví tối đa 100 ký tự")
      .regex(/^[a-zA-ZÀ-ỹ\s]/, "Tên ví phải bắt đầu bằng chữ cái")
      .regex(/^[a-zA-ZÀ-ỹ\s][a-zA-ZÀ-ỹ0-9\s]*$/, "Tên ví không được chứa ký tự đặc biệt"),
    balance: z.string().optional(),
    type: z.enum(["cash", "bank", "e-wallet", "card"] as const),
    cardNumber: z.string().optional(),
    accountNumber: z.string().optional(),
    accountHolder: z.string().optional(),
    bankCode: z.string().optional(),
    color: z.string().min(1, "Vui lòng chọn màu sắc"),
  })
  .superRefine((data, ctx) => {
    // Custom validation: bankCode bắt buộc nếu type === 'bank'
    if (data.type === "bank" && !data.bankCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn ngân hàng",
        path: ["bankCode"],
      });
    }

    // Custom validation: số tài khoản bắt buộc nếu type === 'bank' hoặc 'card'
    if ((data.type === "bank" || data.type === "card") && !data.accountNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Số tài khoản không được để trống",
        path: ["accountNumber"],
      });
    }

    // Custom validation: tên chủ tài khoản bắt buộc nếu type === 'bank', 'card', hoặc 'e-wallet'
    if ((data.type === "bank" || data.type === "card" || data.type === "e-wallet") && !data.accountHolder?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tên chủ tài khoản không được để trống",
        path: ["accountHolder"],
      });
    }

    // Custom validation: số dư không được âm
    if (data.balance) {
      const numericBalance = parseInputForSubmit(data.balance);
      if (numericBalance < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Số dư không được âm",
          path: ["balance"],
        });
      }
    }

    // Custom validation: số thẻ phải là số
    if (data.cardNumber && !/^\d+$/.test(data.cardNumber.replace(/\s/g, ""))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Số thẻ phải là số",
        path: ["cardNumber"],
      });
    }
  });

export type WalletFormSchema = z.infer<typeof walletFormSchema>;

/**
 * Initial data shape khi truyền vào dialog ở trigger mode.
 * Khác với `Wallet` model — chỉ chứa subset fields cần thiết cho form.
 */
export interface WalletInitialData {
  _id?: string;
  name: string;
  type: WalletType;
  balance: number;
  cardNumber?: string;
  accountNumber?: string;
  accountHolder?: string;
  bankCode?: string;
  color: string;
}

/**
 * Submit handler được parent inject (controlled mode).
 * Trả về { success, error? } để dialog quyết định toast và đóng.
 */
type WalletSubmitHandler = (data: WalletFormData) => Promise<{ success: boolean; error?: string }>;

interface CommonProps {
  /** Lúc mở/sửa ví đã có (controlled mode), null/undefined = thêm mới */
  wallet?: Wallet | null;
  /** Callback gọi sau khi submit thành công (cả 2 mode) */
  onSuccess?: () => void;
}

interface TriggerModeProps extends CommonProps {
  /** Element kích hoạt dialog (Button, IconButton, ...) */
  trigger: React.ReactNode;
  /** Initial data cho trigger mode (khác wallet ở chỗ là plain object) */
  initialData?: WalletInitialData;
  // Trigger mode: tự fetch API
  open?: never;
  onOpenChange?: never;
  onSubmit?: never;
}

interface ControlledModeProps extends CommonProps {
  /** Controlled open state */
  open: boolean;
  /** Đổi state open (đóng/mở từ ngoài) */
  onOpenChange: (open: boolean) => void;
  /** Custom submit handler — parent kiểm soát logic API */
  onSubmit: WalletSubmitHandler;
  // Controlled mode: không có trigger
  trigger?: never;
  initialData?: never;
}

type WalletFormDialogProps = TriggerModeProps | ControlledModeProps;

// =====================
// Constants
// =====================
const walletTypeOptions = [
  { value: "cash", label: "Tiền mặt" },
  { value: "bank", label: "Tài khoản ngân hàng" },
  { value: "e-wallet", label: "Ví điện tử" },
  { value: "card", label: "Thẻ ngân hàng" },
];

const colorOptions = [
  { value: "#827BF2", label: "Tím" },
  { value: "#21AE5A", label: "Xanh lá" },
  { value: "#F89C34", label: "Cam" },
  { value: "#F66PAC", label: "Hồng" },
  { value: "#38BDF8", label: "Xanh dương" },
  { value: "#E40127", label: "Đỏ" },
  { value: "#F2CC00", label: "Vàng" },
  { value: "#9EA3B8", label: "Xám" },
];

const walletTypeIcons: Record<WalletType, React.ReactNode> = {
  cash: <WalletIcon className="w-8 h-8 text-white" />,
  bank: <Building2 className="w-8 h-8 text-white" />,
  "e-wallet": <Smartphone className="w-8 h-8 text-white" />,
  card: <CreditCard className="w-8 h-8 text-white" />,
};

const DEFAULT_COLOR = "#827BF2";

// Map từ Wallet (controlled mode) → WalletInitialData (internal shape)
const walletToInitialData = (wallet: Wallet | null | undefined): WalletInitialData | undefined => {
  if (!wallet) return undefined;
  return {
    _id: wallet._id,
    name: wallet.name,
    type: wallet.type,
    balance: wallet.balance,
    cardNumber: wallet.cardNumber,
    accountNumber: wallet.accountNumber,
    accountHolder: wallet.accountHolder,
    bankCode: wallet.bankCode,
    color: wallet.color,
  };
};

// =====================
// Component
// =====================
export function WalletFormDialog(props: WalletFormDialogProps) {
  // Detect mode dựa trên props
  const isControlled = "open" in props && typeof props.open === "boolean";

  // ===== Resolved props chung cho cả 2 mode =====
  const resolvedInitialData: WalletInitialData | undefined = isControlled
    ? walletToInitialData(props.wallet)
    : props.initialData;

  // ===== Internal state cho trigger mode (uncontrolled) =====
  const [internalOpen, setInternalOpen] = useState(false);

  // ===== Form với react-hook-form + zod =====
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WalletFormSchema>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: {
      name: resolvedInitialData?.name || "",
      type: resolvedInitialData?.type || "cash",
      balance: resolvedInitialData?.balance?.toString() || "0",
      cardNumber: resolvedInitialData?.cardNumber || "",
      accountNumber: resolvedInitialData?.accountNumber || "",
      accountHolder: resolvedInitialData?.accountHolder || "",
      bankCode:
        resolvedInitialData?.type === "bank" || resolvedInitialData?.type === "e-wallet"
          ? resolvedInitialData?.bankCode || ""
          : "",
      color: resolvedInitialData?.color || DEFAULT_COLOR,
    },
    mode: "onBlur",
  });

  // Watch values
  const watchName = watch("name");
  const watchType = watch("type");
  const watchBalance = watch("balance");
  const watchCardNumber = watch("cardNumber");
  const watchAccountNumber = watch("accountNumber");
  const watchAccountHolder = watch("accountHolder");
  const watchBankCode = watch("bankCode");
  const watchColor = watch("color");

  // ===== Effective open state =====
  const open = isControlled ? props.open : internalOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      if (isControlled) {
        props.onOpenChange(next);
      } else {
        setInternalOpen(next);
      }
    },
    [isControlled, props],
  );

  // Lookup bank info để hiển thị logo
  const { banks, isLoading: isBanksLoading } = useBanks();
  const selectedBank = useMemo(
    () => (watchBankCode && watchType === "bank" ? findBankByCode(banks, watchBankCode) : undefined),
    [watchBankCode, watchType, banks],
  );

  // Build options — embed bank metadata vào option để render function dùng được
  // Label dạng "Vietcombank (VCB) — Ngân hàng TMCP Ngoại Thương..." để search được cả tên/mã/tên đầy đủ
  const bankOptions: readonly IOptionSelect[] = useMemo(
    () =>
      banks.map((bank) => ({
        value: bank.code,
        label: `${bank.shortName} (${bank.code}) ${bank.name}`,
        bank,
      })),
    [banks],
  );

  // Custom render mỗi item trong dropdown — hiển thị logo + tên ngắn + tên đầy đủ + code
  const renderBankOption = useCallback((option: IOptionSelect) => {
    const bank = option.bank as Bank | undefined;
    if (!bank) return option.label;
    return (
      <div className="flex items-center gap-3 flex-1 min-w-0 py-0.5">
        <Image
          src={bank.logo}
          alt={bank.shortName}
          width={28}
          height={28}
          className="w-7 h-7 object-contain rounded shrink-0"
          unoptimized
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-[#1A1D2E] truncate">{bank.shortName}</p>
          <p className="text-xs text-[#5A607F] truncate">{bank.name}</p>
        </div>
        <span className="text-xs font-mono text-[#5A607F] shrink-0">{bank.code}</span>
      </div>
    );
  }, []);

  // Custom render cho trigger button — hiển thị logo + tên ngắn + code
  const renderBankTrigger = useCallback((option: IOptionSelect) => {
    const bank = option.bank as Bank | undefined;
    if (!bank) return option.label;
    return (
      <div className="flex items-center gap-2 min-w-0">
        <Image
          src={bank.logo}
          alt={bank.shortName}
          width={20}
          height={20}
          className="w-5 h-5 object-contain rounded shrink-0"
          unoptimized
        />
        <span className="font-medium text-[#1A1D2E] truncate">{bank.shortName}</span>
        <span className="text-xs text-[#5A607F] shrink-0">({bank.code})</span>
      </div>
    );
  }, []);

  // Reset form khi mở dialog
  useEffect(() => {
    if (open) {
      reset({
        name: resolvedInitialData?.name || "",
        type: resolvedInitialData?.type || "cash",
        balance: resolvedInitialData?.balance?.toString() || "0",
        cardNumber: resolvedInitialData?.cardNumber || "",
        accountNumber: resolvedInitialData?.accountNumber || "",
        accountHolder: resolvedInitialData?.accountHolder || "",
        bankCode:
          resolvedInitialData?.type === "bank" || resolvedInitialData?.type === "e-wallet"
            ? resolvedInitialData?.bankCode || ""
            : "",
        color: resolvedInitialData?.color || DEFAULT_COLOR,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, resolvedInitialData?._id]);

  // ===== Auto-fill tên ví khi đổi loại / chọn bank / chọn e-wallet =====
  const handleBankChange = useCallback(
    (code: string) => {
      setValue("bankCode", code, { shouldValidate: true });
      // Auto-fill tên ví theo bank shortName nếu user chưa nhập
      const bank = code ? findBankByCode(banks, code) : undefined;
      if (bank && !watchName.trim()) {
        setValue("name", `Tài khoản ${bank.shortName}`, { shouldValidate: true });
      }
    },
    [banks, watchName, setValue],
  );

  const handleEWalletChange = useCallback(
    (value: string) => {
      setValue("bankCode", value, { shouldValidate: true });
      if (!watchName.trim() || EWALLET_OPTIONS.some((opt) => opt.label === watchName)) {
        const found = EWALLET_OPTIONS.find((opt) => opt.value === value);
        if (found) setValue("name", found.label, { shouldValidate: true });
      }
    },
    [watchName, setValue],
  );

  const handleTypeChange = useCallback(
    (nextType: WalletType) => {
      setValue("type", nextType, { shouldValidate: true });
      setValue("bankCode", "", { shouldValidate: true });
    },
    [setValue],
  );

  // ===== Submit logic =====
  const submitToApi = async (data: WalletFormData): Promise<{ success: boolean; error?: string }> => {
    const url = resolvedInitialData?._id ? `/api/wallets/${resolvedInitialData._id}` : "/api/wallets";
    const method = resolvedInitialData?._id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!response.ok) {
        return { success: false, error: json.error || "Đã xảy ra lỗi" };
      }
      return { success: true };
    } catch {
      return { success: false, error: "Đã xảy ra lỗi" };
    }
  };

  const buildSubmitPayload = (formData: WalletFormSchema): WalletFormData => {
    const numericBalance = parseInputForSubmit(formData.balance || "0");
    const payload: WalletFormData = {
      name: formData.name.trim(),
      type: formData.type,
      balance: numericBalance,
      color: formData.color,
    };
    if (formData.type === "card" && formData.cardNumber) payload.cardNumber = formData.cardNumber;
    if ((formData.type === "bank" || formData.type === "card") && formData.accountNumber) {
      payload.accountNumber = formData.accountNumber;
    }
    if (
      (formData.type === "bank" || formData.type === "card" || formData.type === "e-wallet") &&
      formData.accountHolder
    ) {
      payload.accountHolder = formData.accountHolder;
    }
    if (formData.type === "bank" && formData.bankCode) payload.bankCode = formData.bankCode;
    if (formData.type === "e-wallet" && formData.bankCode) payload.bankCode = formData.bankCode;
    return payload;
  };

  const onSubmit = async (formData: WalletFormSchema) => {
    const payload = buildSubmitPayload(formData);
    const result = isControlled ? await props.onSubmit(payload) : await submitToApi(payload);

    if (result.success) {
      toast.success(resolvedInitialData?._id ? "Cập nhật ví thành công" : "Tạo ví thành công");
      setOpen(false);
      props.onSuccess?.();
    } else {
      toast.error(result.error || "Đã xảy ra lỗi");
    }
  };

  // ===== Render helpers =====
  const renderPreview = () => (
    <div
      className="w-full h-24 rounded-xl flex items-center justify-between px-5 text-white"
      style={{ backgroundColor: watchColor || DEFAULT_COLOR }}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
          {watchType === "bank" && selectedBank ? (
            <Image
              src={selectedBank.logo}
              alt={selectedBank.shortName}
              width={40}
              height={40}
              className="w-10 h-10 object-contain bg-white rounded p-0.5"
              unoptimized
            />
          ) : (
            walletTypeIcons[watchType || "cash"]
          )}
        </div>
        <div>
          <p className="font-semibold text-lg">{watchName || "Tên ví"}</p>
          <p className="text-sm opacity-80">
            {watchType === "bank" && selectedBank
              ? selectedBank.shortName
              : walletTypeOptions.find((t) => t.value === watchType)?.label}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold">{parseInputForSubmit(watchBalance || "0").toLocaleString("vi-VN")} đ</p>
      </div>
    </div>
  );

  const renderTypeSelector = () => (
    <div>
      <label className="text-sm font-medium text-[#1A1D2E] mb-2 block">Loại ví</label>
      <div className="grid grid-cols-4 gap-2">
        {walletTypeOptions.map((opt) => {
          const isDisabled = opt.value === "e-wallet" || opt.value === "card";
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => !isDisabled && handleTypeChange(opt.value as WalletType)}
              disabled={isDisabled}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border-2 transition-all",
                watchType === opt.value
                  ? "border-[#827BF2] bg-[#827BF2]/10"
                  : isDisabled
                    ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                    : "border-gray-200 bg-white hover:border-gray-300",
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-[#F2F4F8] flex items-center justify-center">
                {walletTypeIcons[opt.value as WalletType]}
              </div>
              <span className="text-xs font-medium text-[#1A1D2E] text-center leading-tight">{opt.label}</span>
              {isDisabled && <span className="text-[10px] text-[#9EA3B8]">Sắp ra mắt</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderBankFields = () => (
    <div className="space-y-3 p-3 bg-[#F2F4F8] rounded-lg">
      <p className="text-sm font-medium text-[#1A1D2E]">Thông tin tài khoản</p>

      {watchType === "card" && (
        <div>
          <label className="text-xs font-medium text-[#5A607F] mb-1 block">Số thẻ</label>
          <Input
            placeholder="1234567890123456"
            {...register("cardNumber")}
            className={cn("font-mono", errors.cardNumber && "border-red-500")}
          />
          {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber.message}</p>}
        </div>
      )}

      {watchType === "bank" && (
        <>
          <div>
            <SelectField
              label="Ngân hàng"
              required
              placeholder={isBanksLoading ? "Đang tải..." : "Chọn ngân hàng..."}
              options={bankOptions}
              selected={watchBankCode || ""}
              onChangeSelected={handleBankChange}
              disabled={isBanksLoading}
              renderOption={renderBankOption}
              renderTrigger={renderBankTrigger}
              classWapper="mb-0"
              msgError={errors.bankCode?.message}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#5A607F] mb-1 block">Số tài khoản</label>
            <Input
              placeholder="1234567890"
              {...register("accountNumber")}
              className={cn("font-mono", errors.accountNumber && "border-red-500")}
            />
            {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber.message}</p>}
          </div>
        </>
      )}

      <div>
        <label className="text-xs font-medium text-[#5A607F] mb-1 block">Tên chủ tài khoản</label>
        <Input
          placeholder="NGUYEN VAN A"
          {...register("accountHolder")}
          className={cn("uppercase", errors.accountHolder && "border-red-500")}
        />
        {errors.accountHolder && <p className="text-xs text-red-500 mt-1">{errors.accountHolder.message}</p>}
      </div>
    </div>
  );

  const renderEWalletFields = () => (
    <div className="space-y-3 p-3 bg-[#F2F4F8] rounded-lg">
      <p className="text-sm font-medium text-[#1A1D2E]">Thông tin ví điện tử</p>
      <SelectField
        label="Ví điện tử"
        placeholder="Chọn ví điện tử"
        options={EWALLET_OPTIONS}
        selected={watchBankCode || ""}
        onChangeSelected={handleEWalletChange}
        classWapper="mb-0"
      />
      <div>
        <label className="text-xs font-medium text-[#5A607F] mb-1 block">Số điện thoại / Tài khoản</label>
        <Input placeholder="0901234567" {...register("accountNumber")} />
      </div>
      <div>
        <label className="text-xs font-medium text-[#5A607F] mb-1 block">
          Tên chủ tài khoản <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="NGUYEN VAN A"
          {...register("accountHolder")}
          className={cn("uppercase", errors.accountHolder && "border-red-500")}
        />
        {errors.accountHolder && <p className="text-xs text-red-500 mt-1">{errors.accountHolder.message}</p>}
      </div>
    </div>
  );

  const renderForm = () => (
    <form id="wallet-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {renderPreview()}
        {renderTypeSelector()}

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
            Tên ví <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="VD: Ví tiền mặt, Tài khoản Vietcombank..."
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Initial Balance */}
        <div>
          <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">Số dư ban đầu</label>
          <div className="relative">
            <Controller
              name="balance"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={field.value}
                  onChange={(e) => field.onChange(formatInputValue(e.target.value))}
                  onBlur={field.onBlur}
                  className={cn("pl-4 pr-14", errors.balance && "border-red-500")}
                />
              )}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A607F]">VNĐ</span>
          </div>
          {errors.balance && <p className="text-xs text-red-500 mt-1">{errors.balance.message}</p>}
        </div>

        {/* Type-specific fields */}
        {(watchType === "bank" || watchType === "card") && renderBankFields()}
        {watchType === "e-wallet" && renderEWalletFields()}

        {/* Color */}
        <div>
          <label className="text-sm font-medium text-[#1A1D2E] mb-2 block">Màu sắc</label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setValue("color", c.value, { shouldValidate: true })}
                className={cn(
                  "w-8 h-8 rounded-full transition-all",
                  watchColor === c.value ? "ring-2 ring-offset-2 ring-[#827BF2] scale-110" : "hover:scale-110",
                )}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
          {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color.message}</p>}
        </div>
      </div>
    </form>
  );

  const dialogContent = (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{resolvedInitialData?._id ? "Sửa ví" : "Thêm ví mới"}</DialogTitle>
      </DialogHeader>
      <DialogMain>{renderForm()}</DialogMain>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" form="wallet-form" className="bg-[#827BF2] hover:bg-[#6B5FD4]" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : resolvedInitialData?._id ? "Lưu thay đổi" : "Tạo ví"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  // Trigger mode → dùng DialogTrigger asChild
  if (!isControlled) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{props.trigger}</DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  // Controlled mode → không có trigger
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {dialogContent}
    </Dialog>
  );
}
