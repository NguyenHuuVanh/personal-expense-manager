'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';
import { Textarea } from '@/components/shadcn-ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogMain,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/shadcn-ui/dialog';
import { SelectField } from '@/components/custom-fields/select-field';
import { DatePickerField } from '@/components/custom-fields/date-picker-field';
import { CategoryIcon } from '@/components/ui/category-icon';
import { apiClient, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { parseInputForSubmit } from '@/utils/format-number';

import type { TransactionFormDialogProps, CategoryOption, WalletOption } from '@/types/transaction';

export type { TransactionFormDialogProps } from '@/types/transaction';

// Zod schema cho validation
const transactionFormSchema = z.object({
  type: z.enum(['income', 'expense'] as const),
  walletId: z.string().min(1, 'Vui lòng chọn ví'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  amount: z.string().min(1, 'Vui lòng nhập số tiền'),
  description: z.string().min(1, 'Mô tả không được để trống').max(200, 'Mô tả tối đa 200 ký tự'),
  date: z.date({ message: 'Vui lòng chọn ngày' }),
  note: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
});

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;

interface BudgetInfo {
  budgetAmount: number;
  spentAmount: number;
  remaining: number;
}

interface BudgetItemRaw {
  _id: string;
  budgetAmount: number;
  spentAmount?: number;
  categoryId: string | { _id: string };
}

export function TransactionFormDialog({
  trigger,
  initialData,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: TransactionFormDialogProps) {
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);

  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  // Form với react-hook-form + zod
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormSchema>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: initialData?.type || 'expense',
      walletId: initialData?.walletId || '',
      categoryId: initialData?.categoryId || '',
      amount: initialData?.amount?.toString() || '',
      description: initialData?.description || '',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      note: initialData?.note || '',
    },
    mode: 'onBlur',
  });

  // Watch values
  const watchType = watch('type');
  const watchWalletId = watch('walletId');
  const watchCategoryId = watch('categoryId');
  const watchAmount = watch('amount');
  const watchDate = watch('date');

  const [wallets, setWallets] = useState<WalletOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [budgets, setBudgets] = useState<Map<string, BudgetInfo>>(new Map());
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const [walletsData, categoriesData, budgetsData] = await Promise.all([
        apiClient.get<WalletOption[]>('/wallets'),
        apiClient.get<CategoryOption[]>('/categories'),
        apiClient.get<BudgetItemRaw[]>(`/budgets?month=${month}&year=${year}`),
      ]);

      setWallets(walletsData);

      // Lọc category theo type (income / expense / both)
      const filteredCategories = categoriesData.filter((c: any) => {
        return c.type === watchType || c.type === 'both';
      });
      setCategories(filteredCategories);

      // Map budgets cho lookup nhanh theo categoryId
      const budgetMap = new Map<string, BudgetInfo>();
      budgetsData.forEach((b) => {
        const catId = typeof b.categoryId === 'string' ? b.categoryId : b.categoryId?._id;
        if (!catId) return;
        const spent = b.spentAmount || 0;
        budgetMap.set(catId, {
          budgetAmount: b.budgetAmount,
          spentAmount: spent,
          remaining: b.budgetAmount - spent,
        });
      });
      setBudgets(budgetMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [watchType]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  useEffect(() => {
    if (initialData && open) {
      reset({
        type: initialData.type,
        walletId: initialData.walletId,
        categoryId: initialData.categoryId,
        amount: initialData.amount?.toString() || '',
        description: initialData.description || '',
        date: initialData.date ? new Date(initialData.date) : new Date(),
        note: initialData.note || '',
      });
    }
  }, [initialData, open, reset]);

  const numericAmount = parseInputForSubmit(watchAmount || '0');
  const selectedBudget = watchCategoryId ? budgets.get(watchCategoryId) : null;
  const isOverBudget = selectedBudget && watchType === 'expense' && numericAmount > selectedBudget.remaining;

  const walletOptions = wallets.map((w) => ({
    value: w._id,
    label: `${w.name} (${w.balance.toLocaleString('vi-VN')} VNĐ)`,
  }));

  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const selectedCategory = categories.find((c) => c._id === watchCategoryId);

  const isAmountValid = numericAmount > 0;

  const handleClose = () => {
    setOpen(false);
    reset({
      type: 'expense',
      walletId: '',
      categoryId: '',
      amount: '',
      description: '',
      date: new Date(),
      note: '',
    });
  };

  const onSubmit = async (data: TransactionFormSchema) => {
    const amount = parseInputForSubmit(data.amount);

    if (amount <= 0) {
      toast.error('Số tiền phải lớn hơn 0');
      return;
    }

    if (data.type === 'expense' && selectedBudget) {
      if (amount > selectedBudget.remaining) {
        toast.error(
          `Ngân sách không đủ! Chỉ còn ${selectedBudget.remaining.toLocaleString('vi-VN')} VNĐ trong ngân sách cho danh mục này.`
        );
        return;
      }
    }

    try {
      const payload = {
        walletId: data.walletId,
        categoryId: data.categoryId,
        type: data.type,
        amount,
        description: data.description.trim(),
        date: data.date.toISOString(),
        note: data.note?.trim() || undefined,
      };

      if (initialData?._id) {
        await apiClient.put(`/transactions/${initialData._id}`, payload);
        toast.success('Cập nhật giao dịch thành công');
      } else {
        await apiClient.post('/transactions', payload);
        toast.success('Tạo giao dịch thành công');
      }
      handleClose();
      onSuccess?.();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi khi lưu giao dịch';
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData?._id ? 'Sửa giao dịch' : 'Thêm giao dịch mới'}</DialogTitle>
        </DialogHeader>
        <DialogMain>
          <form id="transaction-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Transaction Type Toggle */}
              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-2 block">Loại giao dịch</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setValue('type', 'expense', { shouldValidate: true })}
                    className={cn(
                      'flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 transition-all',
                      watchType === 'expense'
                        ? 'border-[#E40127] bg-[#E40127]/10 text-[#E40127]'
                        : 'border-gray-200 bg-white text-[#5A607F] hover:border-gray-300'
                    )}
                  >
                    <ArrowDownCircle className="w-5 h-5" />
                    <span className="font-medium">Chi tiêu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('type', 'income', { shouldValidate: true })}
                    className={cn(
                      'flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 transition-all',
                      watchType === 'income'
                        ? 'border-[#21AE5A] bg-[#21AE5A]/10 text-[#21AE5A]'
                        : 'border-gray-200 bg-white text-[#5A607F] hover:border-gray-300'
                    )}
                  >
                    <ArrowUpCircle className="w-5 h-5" />
                    <span className="font-medium">Thu nhập</span>
                  </button>
                </div>
              </div>

              {/* Wallet Selection */}
              <div>
                {isLoadingData ? (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#1A1D2E]">Ví</label>
                    <div className="flex items-center justify-center py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-[#827BF2]" />
                    </div>
                  </div>
                ) : (
                  <SelectField
                    label="Ví"
                    placeholder="Chọn ví"
                    options={walletOptions}
                    selected={watchWalletId}
                    onChangeSelected={(value) => setValue('walletId', value, { shouldValidate: true })}
                    msgError={errors.walletId?.message}
                  />
                )}
              </div>

              {/* Amount */}
              <div className="relative">
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Số tiền <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      className={cn('text-2xl font-bold pl-4 pr-16 h-14', errors.amount && 'border-red-500')}
                    />
                  )}
                />
                <span className="absolute right-4 top-[calc(50%+8px)] -translate-y-1/2 text-[#5A607F] font-medium">
                  VNĐ
                </span>
                {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
                {!errors.amount && watchAmount && !isAmountValid && (
                  <p className="text-xs text-red-500 mt-1">Số tiền phải lớn hơn 0</p>
                )}
              </div>

              {/* Category Selection */}
              <div>
                {isLoadingData ? (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#1A1D2E]">Danh mục</label>
                    <div className="flex items-center justify-center py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-[#827BF2]" />
                    </div>
                  </div>
                ) : (
                  <SelectField
                    label="Danh mục"
                    placeholder="Chọn danh mục"
                    options={categoryOptions}
                    selected={watchCategoryId}
                    onChangeSelected={(value) => setValue('categoryId', value, { shouldValidate: true })}
                    msgError={errors.categoryId?.message}
                  />
                )}

                {/* Category Preview & Budget Info */}
                {selectedCategory && (
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-[#5A607F]">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${selectedCategory.color}20` }}
                      >
                        <CategoryIcon iconId={selectedCategory.icon} size={14} style={{ color: selectedCategory.color }} />
                      </div>
                      <span>{selectedCategory.name}</span>
                    </div>
                    {selectedBudget && watchType === 'expense' && (
                      <div
                        className={cn(
                          'flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full',
                          isOverBudget ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        )}
                      >
                        {isOverBudget ? (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Vượt ngân sách</span>
                          </>
                        ) : (
                          <span>Còn {selectedBudget.remaining.toLocaleString('vi-VN')} VNĐ</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Nhập mô tả giao dịch"
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePickerField label="Ngày" selected={field.value} onSelect={field.onChange} />
                  )}
                />
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
              </div>

              {/* Note */}
              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">Ghi chú</label>
                <Textarea
                  placeholder="Thêm ghi chú (tùy chọn)"
                  {...register('note')}
                  rows={2}
                  className={cn('resize-none', errors.note && 'border-red-500')}
                />
                {errors.note && <p className="text-xs text-red-500 mt-1">{errors.note.message}</p>}
              </div>
            </div>
          </form>
        </DialogMain>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="transaction-form"
            className={cn(
              'text-white',
              watchType === 'expense' ? 'bg-[#E40127] hover:bg-[#C40123]' : 'bg-[#21AE5A] hover:bg-[#1A9D4E]'
            )}
            disabled={isSubmitting || isLoadingData}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : initialData?._id ? (
              'Lưu thay đổi'
            ) : (
              'Thêm giao dịch'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
