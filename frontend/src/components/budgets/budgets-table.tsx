'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CustomTable } from '@/components/custom-fields/custom-table';
import { BudgetFormDialog } from '@/components/budgets/budget-form-dialog';
import { getBudgetTableColumns, BudgetRow } from '@/types/columns/budgets-table';
import { formatCurrency } from '@/utils/format-number';
import { apiClient, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/shadcn-ui/dialog';
import { Button } from '@/components/shadcn-ui/button';

interface BudgetsTableProps {
  refreshKey?: number;
}

function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export function BudgetsTable({ refreshKey = 0 }: BudgetsTableProps) {
  const [budgets, setBudgets] = useState<BudgetRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteBudget, setDeleteBudget] = useState<BudgetRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetRow | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBudgets = useCallback(async () => {
    try {
      setIsLoading(true);
      const { month, year } = getCurrentMonthYear();
      const data = await apiClient.get<BudgetRow[]>(`/budgets?month=${month}&year=${year}`);
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Không thể tải danh sách ngân sách');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets, refreshKey]);

  const handleDelete = useCallback(async () => {
    if (!deleteBudget) return;

    setIsDeleting(true);
    try {
      await apiClient.delete(`/budgets/${deleteBudget._id}`);
      toast.success('Xóa ngân sách thành công');
      setDeleteBudget(null);
      fetchBudgets();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteBudget, fetchBudgets]);

  const filteredData = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return budgets;
    }
    const query = searchQuery.toLowerCase().trim();
    return budgets.filter((budget) =>
      budget.categoryId?.name?.toLowerCase().includes(query)
    );
  }, [budgets, searchQuery]);

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overBudgetCount = budgets.filter((b) => b.isOverBudget || b.spentAmount > b.budgetAmount).length;

  const columns = useMemo(
    () =>
      getBudgetTableColumns({
        onEdit: setEditingBudget,
        onDelete: setDeleteBudget,
      }),
    []
  );

  return (
    <>
      <CustomTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Chưa có ngân sách nào"
        rowHover={true}
        rowBordered={true}
        compact={true}
        showSearch={true}
        searchValue={searchQuery}
        searchPlaceholder="Tìm kiếm ngân sách..."
        onSearchChange={setSearchQuery}
        title="Danh sách ngân sách"
        badge={{
          label: `${budgets.length} ngân sách`,
          variant: 'secondary',
        }}
        supportingText={`Tổng ngân sách: ${formatCurrency(totalBudget)} | Đã chi: ${formatCurrency(totalSpent)} | Còn lại: ${formatCurrency(totalRemaining)}`}
        headerActions={
          <div className="flex items-center gap-3">
            {overBudgetCount > 0 && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {overBudgetCount} vượt ngân sách
              </span>
            )}
          </div>
        }
      />

      {/* Edit Dialog */}
      <BudgetFormDialog
        trigger={<></>}
        initialData={editingBudget ? {
          _id: editingBudget._id,
          categoryId: editingBudget.categoryId._id,
          budgetAmount: editingBudget.budgetAmount,
          period: editingBudget.period,
        } : undefined}
        onSuccess={() => {
          setEditingBudget(null);
          fetchBudgets();
        }}
        isOpen={!!editingBudget}
        onClose={() => setEditingBudget(null)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteBudget} onOpenChange={() => setDeleteBudget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa ngân sách</DialogTitle>
          </DialogHeader>
          <p className="p-4">
            Bạn có chắc chắn muốn xóa ngân sách <strong>{deleteBudget?.categoryId.name}</strong> không?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteBudget(null)} disabled={isDeleting}>
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
