'use client';

import { useState } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { Button } from '@/components/shadcn-ui/button';
import { Badge } from '@/components/shadcn-ui/badge';
import { formatCurrency } from '@/utils/format-number';
import { cn } from '@/utils/cn';
import { CategoryIcon } from '@/components/ui/category-icon';
import { apiClient, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/shadcn-ui/dialog';
import { Input } from '@/components/shadcn-ui/input';
import { SelectField } from '@/components/custom-fields/select-field';

import { PERIOD_OPTIONS } from '@/constants/budget';
import type { BudgetCardProps } from '@/types/budget';

export type { BudgetCardProps } from '@/types/budget';

export function BudgetCard({ item, onUpdate }: BudgetCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    budgetAmount: item.budgetAmount,
    period: item.period,
  });
  const [isSaving, setIsSaving] = useState(false);

  const percentage = Math.min((item.spentAmount / item.budgetAmount) * 100, 100);
  const isOverBudget = item.isOverBudget || item.spentAmount > item.budgetAmount;
  const remaining = item.budgetAmount - item.spentAmount;

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-[#E40127]';
    if (percentage >= 80) return 'bg-[#F89C34]';
    return 'bg-[#21AE5A]';
  };

  const getPeriodLabel = (period: string) => {
    if (period === 'daily') return 'Hàng ngày';
    if (period === 'weekly') return 'Hàng tuần';
    return 'Hàng tháng';
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/budgets/${item._id}`);
      toast.success('Xóa ngân sách thành công');
      onUpdate?.();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi';
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.put(`/budgets/${item._id}`, editData);
      toast.success('Cập nhật ngân sách thành công');
      setShowEditDialog(false);
      onUpdate?.();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${item.categoryId.color}20` }}
              >
                <CategoryIcon iconId={item.categoryId.icon} size={20} style={{ color: item.categoryId.color }} />
              </div>
              <div>
                <CardTitle className="text-base">{item.categoryId.name}</CardTitle>
                <p className="text-sm text-[#5A607F] capitalize">
                  {getPeriodLabel(item.period)}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowEditDialog(true)}>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold text-[#1A1D2E]">
                  {formatCurrency(item.spentAmount)}
                </span>
                <span className="text-sm text-[#5A607F]">
                  {' / '}
                  {formatCurrency(item.budgetAmount)}
                </span>
              </div>
              {isOverBudget && (
                <Badge variant="destructive" className="text-xs">
                  Vượt ngân sách
                </Badge>
              )}
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full bg-[#F2F4F8] rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', getProgressColor())}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-[#5A607F] text-right">
                {percentage.toFixed(0)}% đã sử dụng
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <p className="text-sm text-[#5A607F]">
                {isOverBudget ? (
                  <span className="text-[#E40127]">
                    Vượt {formatCurrency(Math.abs(remaining))}
                  </span>
                ) : (
                  <span className="text-[#21AE5A]">
                    Còn lại {formatCurrency(remaining)}
                  </span>
                )}
              </p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowEditDialog(true)}>
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-[#E40127] hover:bg-red-50" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa ngân sách</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-[#F2F4F8] rounded-lg">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${item.categoryId.color}20` }}
              >
                <CategoryIcon iconId={item.categoryId.icon} size={20} style={{ color: item.categoryId.color }} />
              </div>
              <div>
                <p className="font-semibold text-[#1A1D2E]">{item.categoryId.name}</p>
                <p className="text-sm text-[#5A607F]">Danh mục</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                Số tiền ngân sách
              </label>
              <Input
                type="number"
                placeholder="Nhập số tiền"
                value={editData.budgetAmount}
                onChange={(e) => setEditData({ ...editData, budgetAmount: Number(e.target.value) })}
                required
              />
            </div>

            <SelectField
              label="Kỳ hạn"
              placeholder="Chọn kỳ hạn"
              options={PERIOD_OPTIONS}
              selected={editData.period}
              onChangeSelected={(value) => setEditData({ ...editData, period: value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa ngân sách</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Bạn có chắc chắn muốn xóa ngân sách <strong>{item.categoryId.name}</strong> không?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
