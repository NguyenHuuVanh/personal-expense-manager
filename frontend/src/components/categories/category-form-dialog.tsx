'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { IconPicker } from './icon-picker';
import { CategoryIcon } from '@/components/ui/category-icon';
import { toast } from 'sonner';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '@/data/options/category-colors';
import type { IOptionSelect } from '@/types/fields';
import { cn } from '@/utils/cn';

type CategoryType = 'expense' | 'income' | 'both';

// Zod schema cho validation
const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên danh mục không được để trống')
    .max(50, 'Tên danh mục tối đa 50 ký tự'),
  icon: z.string().min(1, 'Vui lòng chọn biểu tượng'),
  color: z.string().min(1, 'Vui lòng chọn màu sắc'),
  type: z.enum(['expense', 'income', 'both'] as const),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

const CATEGORY_TYPE_OPTIONS: IOptionSelect[] = [
  { value: 'expense', label: 'Chi tiêu' },
  { value: 'income', label: 'Thu nhập' },
  { value: 'both', label: 'Tất cả' },
];

interface CategoryFormDialogProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  initialData?: {
    _id?: string;
    name: string;
    icon: string;
    color: string;
    type?: 'income' | 'expense' | 'both';
    total?: number;
  };
  onSuccess?: () => void;
}

export function CategoryFormDialog({
  trigger,
  isOpen: controlledOpen,
  onClose,
  initialData,
  onSuccess,
}: CategoryFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Form với react-hook-form + zod
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      icon: initialData?.icon || 'package',
      color: initialData?.color || DEFAULT_CATEGORY_COLOR,
      type: initialData?.type || 'expense',
    },
    mode: 'onBlur',
  });

  // Watch values
  const watchName = watch('name');
  const watchIcon = watch('icon');
  const watchColor = watch('color');
  const watchType = watch('type');

  // Controlled or uncontrolled open state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onClose || (() => {})) : setInternalOpen;

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || '',
        icon: initialData?.icon || 'package',
        color: initialData?.color || DEFAULT_CATEGORY_COLOR,
        type: initialData?.type || 'expense',
      });
    }
  }, [open, initialData, reset]);

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  const onSubmit = async (data: CategoryFormSchema) => {
    try {
      const url = initialData?._id ? `/api/categories/${initialData._id}` : '/api/categories';
      const method = initialData?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          icon: data.icon,
          color: data.color,
          type: data.type,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(initialData?._id ? 'Cập nhật danh mục thành công' : 'Tạo danh mục thành công');
        handleClose();
        onSuccess?.();
      } else {
        toast.error(result.error || 'Đã xảy ra lỗi');
      }
    } catch {
      toast.error('Đã xảy ra lỗi');
    }
  };

  return (
    <Dialog open={open} onOpenChange={isControlled ? undefined : setInternalOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData?._id ? 'Sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
        </DialogHeader>
        <DialogMain>
          <form id="category-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Preview */}
              <div className="flex items-center gap-4 p-4 bg-[#F2F4F8] rounded-lg">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${watchColor}20` }}
                >
                  <CategoryIcon iconId={watchIcon} size={24} style={{ color: watchColor }} />
                </div>
                <div>
                  <p className="font-semibold text-[#1A1D2E]">{watchName || 'Tên danh mục'}</p>
                  <p className="text-sm text-[#5A607F]">Xem trước</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-2 block">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="VD: Ăn uống, Di chuyển..."
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <SelectField
                label="Loại danh mục"
                placeholder="Chọn loại danh mục"
                options={CATEGORY_TYPE_OPTIONS}
                selected={watchType}
                onChangeSelected={(value) => setValue('type', value as CategoryType, { shouldValidate: true })}
              />

              <IconPicker selectedIcon={watchIcon} onSelect={(icon) => setValue('icon', icon, { shouldValidate: true })} />

              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-2 block">Màu sắc</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setValue('color', color.value, { shouldValidate: true })}
                      title={color.label}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all',
                        watchColor === color.value
                          ? 'ring-2 ring-offset-2 ring-[#827BF2] scale-110'
                          : 'hover:scale-110'
                      )}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
                {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color.message}</p>}
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
            form="category-form"
            className="bg-[#827BF2] hover:bg-[#6B5FD4]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : initialData?._id ? 'Lưu thay đổi' : 'Thêm danh mục'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
