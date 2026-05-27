'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';
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
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

import { PERIOD_OPTIONS } from '@/constants/budget';
import { useCategories } from '@/hooks/use-categories';
import { formatInputValue, parseInputForSubmit } from '@/utils/format-number';

// Zod schema cho validation
const budgetFormSchema = z.object({
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  budgetAmount: z.string().min(1, 'Vui lòng nhập số tiền ngân sách'),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly'] as const),
});

export type BudgetFormSchema = z.infer<typeof budgetFormSchema>;

interface BudgetFormDialogProps {
  trigger?: React.ReactNode;
  initialData?: {
    _id?: string;
    categoryId?: string;
    budgetAmount?: number;
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  onSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function BudgetFormDialog({
  trigger,
  initialData,
  onSuccess,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: BudgetFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Form với react-hook-form + zod
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormSchema>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || '',
      budgetAmount: initialData?.budgetAmount?.toString() || '',
      period: initialData?.period || 'monthly',
    },
    mode: 'onBlur',
  });

  // Watch values
  const watchCategoryId = watch('categoryId');
  const watchBudgetAmount = watch('budgetAmount');

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalOpen;
  const setOpen = isControlled ? (externalOnClose || (() => {})) : setInternalOpen;

  const { categories, isLoading: isLoadingCategories } = useCategories('expense');

  useEffect(() => {
    if (isOpen) {
      reset({
        categoryId: initialData?.categoryId || '',
        budgetAmount: initialData?.budgetAmount?.toString() || '',
        period: initialData?.period || 'monthly',
      });
    }
  }, [isOpen, initialData, reset]);

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      if (!newOpen) externalOnClose?.();
    } else {
      setInternalOpen(newOpen);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  // Validate: số tiền phải > 0
  const numericAmount = parseInputForSubmit(watchBudgetAmount || '0');
  const isAmountValid = numericAmount > 0;

  const onSubmit = async (data: BudgetFormSchema) => {
    const amount = parseInputForSubmit(data.budgetAmount);
    if (amount <= 0) {
      toast.error('Số tiền ngân sách phải lớn hơn 0');
      return;
    }

    try {
      const url = initialData?._id ? `/api/budgets/${initialData._id}` : '/api/budgets';
      const method = initialData?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: data.categoryId,
          budgetAmount: amount,
          period: data.period,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(initialData?._id ? 'Cập nhật ngân sách thành công' : 'Tạo ngân sách thành công');
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.error || 'Đã xảy ra lỗi');
      }
    } catch {
      toast.error('Đã xảy ra lỗi');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData?._id ? 'Sửa ngân sách' : 'Tạo ngân sách mới'}</DialogTitle>
        </DialogHeader>
        <DialogMain>
          <form id="budget-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                {isLoadingCategories ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[#827BF2]" />
                  </div>
                ) : (
                  <SelectField
                    placeholder="Chọn danh mục"
                    options={categoryOptions}
                    selected={watchCategoryId}
                    onChangeSelected={(value) => setValue('categoryId', value, { shouldValidate: true })}
                    msgError={errors.categoryId?.message}
                  />
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Số tiền ngân sách <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="budgetAmount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Nhập số tiền"
                      value={field.value}
                      onChange={(e) => field.onChange(formatInputValue(e.target.value))}
                      onBlur={field.onBlur}
                      className={cn(errors.budgetAmount && 'border-red-500')}
                    />
                  )}
                />
                {errors.budgetAmount && (
                  <p className="text-xs text-red-500 mt-1">{errors.budgetAmount.message}</p>
                )}
                {!errors.budgetAmount && watchBudgetAmount && !isAmountValid && (
                  <p className="text-xs text-red-500 mt-1">Số tiền phải lớn hơn 0</p>
                )}
              </div>

              <SelectField
                label="Kỳ hạn"
                placeholder="Chọn kỳ hạn"
                options={PERIOD_OPTIONS}
                selected={watch('period')}
                onChangeSelected={(value) =>
                  setValue('period', value as 'daily' | 'weekly' | 'monthly' | 'yearly', { shouldValidate: true })
                }
              />
            </div>
          </form>
        </DialogMain>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="budget-form"
            className="bg-[#827BF2] hover:bg-[#6B5FD4]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : initialData?._id ? 'Lưu thay đổi' : 'Tạo ngân sách'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
