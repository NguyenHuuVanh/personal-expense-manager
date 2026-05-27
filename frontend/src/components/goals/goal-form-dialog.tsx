'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';
import { DatePicker } from '@/components/shadcn-ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogMain,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/shadcn-ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

import { GOAL_ICON_OPTIONS, GOAL_COLOR_OPTIONS, DEFAULT_GOAL_ICON, DEFAULT_GOAL_COLOR } from '@/constants/goal';
import type { GoalFormDialogProps } from '@/types/goal';
import { formatInputValue, parseInputForSubmit } from '@/utils/format-number';

export type { GoalFormDialogProps } from '@/types/goal';

// Zod schema cho validation
const goalFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên mục tiêu không được để trống')
    .max(100, 'Tên mục tiêu tối đa 100 ký tự'),
  targetAmount: z.string().min(1, 'Vui lòng nhập số tiền mục tiêu'),
  deadline: z.date({ message: 'Hạn chót không được để trống' }),
  icon: z.string().min(1, 'Vui lòng chọn biểu tượng'),
  color: z.string().min(1, 'Vui lòng chọn màu sắc'),
});

export type GoalFormSchema = z.infer<typeof goalFormSchema>;

export function GoalFormDialog({ trigger, initialData, onSuccess }: GoalFormDialogProps) {
  const [open, setOpen] = useState(false);

  // Form với react-hook-form + zod
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormSchema>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      targetAmount: initialData?.targetAmount?.toString() || '',
      deadline: initialData?.deadline ? new Date(initialData.deadline) : undefined,
      icon: initialData?.icon || DEFAULT_GOAL_ICON,
      color: initialData?.color || DEFAULT_GOAL_COLOR,
    },
    mode: 'onBlur',
  });

  // Watch values
  const watchName = watch('name');
  const watchTargetAmount = watch('targetAmount');
  const watchIcon = watch('icon');
  const watchColor = watch('color');

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || '',
        targetAmount: initialData?.targetAmount?.toString() || '',
        deadline: initialData?.deadline ? new Date(initialData.deadline) : undefined,
        icon: initialData?.icon || DEFAULT_GOAL_ICON,
        color: initialData?.color || DEFAULT_GOAL_COLOR,
      });
    }
  }, [open, initialData, reset]);

  // Validate: số tiền phải > 0
  const numericTargetAmount = parseInputForSubmit(watchTargetAmount || '0');
  const isAmountValid = numericTargetAmount > 0;

  const onSubmit = async (data: GoalFormSchema) => {
    const amount = parseInputForSubmit(data.targetAmount);
    if (amount <= 0) {
      toast.error('Số tiền mục tiêu phải lớn hơn 0');
      return;
    }

    try {
      const url = initialData?._id ? `/api/goals/${initialData._id}` : '/api/goals';
      const method = initialData?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          targetAmount: amount,
          deadline: data.deadline.toISOString(),
          icon: data.icon,
          color: data.color,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(initialData?._id ? 'Cập nhật mục tiêu thành công' : 'Tạo mục tiêu thành công');
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData?._id ? 'Sửa mục tiêu' : 'Tạo mục tiêu mới'}</DialogTitle>
        </DialogHeader>
        <DialogMain>
          <form id="goal-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Preview */}
              <div className="flex items-center gap-4 p-4 bg-[#F2F4F8] rounded-lg">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${watchColor}20` }}
                >
                  <span style={{ color: watchColor }} className="text-xl">
                    {GOAL_ICON_OPTIONS.find((i) => i.value === watchIcon)?.label || '🎯'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[#1A1D2E]">{watchName || 'Tên mục tiêu'}</p>
                  <p className="text-sm text-[#5A607F]">
                    {watchTargetAmount
                      ? `${parseInputForSubmit(watchTargetAmount).toLocaleString('vi-VN')} VNĐ`
                      : 'Số tiền'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Tên mục tiêu <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="VD: Mua nhà, Du lịch..."
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Số tiền mục tiêu <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="targetAmount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="VD: 50000000"
                      value={field.value}
                      onChange={(e) => field.onChange(formatInputValue(e.target.value))}
                      onBlur={field.onBlur}
                      className={cn(errors.targetAmount && 'border-red-500')}
                    />
                  )}
                />
                {errors.targetAmount && (
                  <p className="text-xs text-red-500 mt-1">{errors.targetAmount.message}</p>
                )}
                {!errors.targetAmount && watchTargetAmount && !isAmountValid && (
                  <p className="text-xs text-red-500 mt-1">Số tiền phải lớn hơn 0</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Hạn chót <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="deadline"
                  control={control}
                  render={({ field }) => (
                    <DatePicker value={field.value} onChange={field.onChange} />
                  )}
                />
                {errors.deadline && (
                  <p className="text-xs text-red-500 mt-1">{errors.deadline.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-2 block">Biểu tượng</label>
                <div className="grid grid-cols-6 gap-2">
                  {GOAL_ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue('icon', opt.value, { shouldValidate: true })}
                      className={cn(
                        'p-2 rounded-lg text-center text-xs transition-all',
                        watchIcon === opt.value
                          ? 'ring-2 ring-[#827BF2] bg-[#827BF2]/10'
                          : 'bg-gray-100 hover:bg-gray-200'
                      )}
                      title={opt.label}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-2 block">Màu sắc</label>
                <div className="flex flex-wrap gap-2">
                  {GOAL_COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setValue('color', c, { shouldValidate: true })}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all',
                        watchColor === c ? 'ring-2 ring-offset-2 ring-[#827BF2]' : 'hover:scale-110'
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color.message}</p>}
              </div>
            </div>
          </form>
        </DialogMain>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="goal-form"
            className="bg-[#827BF2] hover:bg-[#6B5FD4]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : initialData?._id ? 'Lưu thay đổi' : 'Tạo mục tiêu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
