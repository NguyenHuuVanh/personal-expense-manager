'use client';

import { useState, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn-ui/dialog';
import { CategoryIcon } from '@/components/ui/category-icon';
import { Badge } from '@/components/shadcn-ui/badge';
import { Button } from '@/components/shadcn-ui/button';
import { SelectField } from '@/components/custom-fields/select-field';
import { DatePickerField } from '@/components/custom-fields/date-picker-field';
import { CustomTable } from '@/components/custom-fields/custom-table';
import { TransactionFormDialog } from './transaction-form-dialog';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { getTransactionColumns } from '@/types/columns/transactions-table';
import { formatCurrency } from '@/utils/format-number';
import { useTransactions } from '@/hooks/use-transactions';
import { useTableDelete } from '@/hooks/table';
import type { Transaction } from '@/hooks/use-transactions';
import type { SortConfig } from '@/types/table';
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_WALLET_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
} from '@/data/options/transactions-filter.options';

export function TransactionsList() {
  const [sortConfig, setSortConfig] = useState<SortConfig<Transaction> | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  // Use transactions hook
  const { transactions, isLoading, fetchTransactions } = useTransactions({
    walletId: selectedWallet || undefined,
    categoryId: selectedCategory || undefined,
    type: (selectedType as 'income' | 'expense') || undefined,
    startDate: dateFrom?.toISOString(),
    endDate: dateTo?.toISOString(),
  });

  // Delete hook
  const { isDeleting, deleteSelected, deleteOne } = useTableDelete({
    endpoint: '/api/transactions',
    onSuccess: () => {
      setSelectedIds([]);
      fetchTransactions(1);
      setDeletingTransaction(null);
    },
  });

  // Handle filter apply
  const handleApplyFilters = useCallback(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedWallet('');
    setSelectedType('');
    setSelectedStatus('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setSearchQuery('');
  };

  // Check if any filter is active
  const hasActiveFilters =
    selectedCategory ||
    selectedWallet ||
    selectedType ||
    selectedStatus ||
    dateFrom ||
    dateTo;

  const activeFilterCount = [
    selectedCategory,
    selectedWallet,
    selectedType,
    selectedStatus,
    dateFrom,
    dateTo,
  ].filter(Boolean).length;

  // Filter data by search (client-side search)
  const filteredData = useMemo(() => {
    if (!searchQuery) return transactions;

    const query = searchQuery.toLowerCase();
    return transactions.filter((t) =>
      t.description?.toLowerCase().includes(query) ||
      (typeof t.categoryId === 'object' && t.categoryId?.name?.toLowerCase().includes(query))
    );
  }, [transactions, searchQuery]);

  // Calculate totals
  const totalIncome = filteredData
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredData
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  // Get columns
  const columns = getTransactionColumns({
    onRowClick: (row) => setSelectedTransaction(row),
    onEdit: (row) => setEditingTransaction(row),
    onDelete: (row) => setDeletingTransaction(row),
  });

  // Filter Panel Component
  const FilterPanel = (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SelectField
          label="Danh mục"
          placeholder="Chọn danh mục"
          options={TRANSACTION_CATEGORY_OPTIONS}
          selected={selectedCategory}
          onChangeSelected={setSelectedCategory}
        />
        <SelectField
          label="Ví"
          placeholder="Chọn ví"
          options={TRANSACTION_WALLET_OPTIONS}
          selected={selectedWallet}
          onChangeSelected={setSelectedWallet}
        />
        <SelectField
          label="Loại giao dịch"
          placeholder="Chọn loại"
          options={TRANSACTION_TYPE_OPTIONS}
          selected={selectedType}
          onChangeSelected={setSelectedType}
        />
        <SelectField
          label="Trạng thái"
          placeholder="Chọn trạng thái"
          options={TRANSACTION_STATUS_OPTIONS}
          selected={selectedStatus}
          onChangeSelected={setSelectedStatus}
        />
        <DatePickerField
          label="Từ ngày"
          mode="single"
          selected={dateFrom}
          onSelect={(d) => setDateFrom(d as Date | undefined)}
          placeholder="Chọn ngày"
          size="lg"
        />
        <DatePickerField
          label="Đến ngày"
          mode="single"
          selected={dateTo}
          onSelect={(d) => setDateTo(d as Date | undefined)}
          placeholder="Chọn ngày"
          size="lg"
        />
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        {hasActiveFilters ? (
          <button onClick={clearFilters} className="text-xs text-[#E40127] hover:underline">
            Xóa bộ lọc
          </button>
        ) : (
          <div />
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={clearFilters}>
            Hủy
          </Button>
          <Button size="sm" className="flex-1 bg-[#827BF2] hover:bg-[#6B5FD4]" onClick={handleApplyFilters}>
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );

  // Helper to get category info
  const getCategoryInfo = (categoryId: Transaction['categoryId']) => {
    if (!categoryId) return { name: '', icon: 'package', color: '#9EA3B8' };
    if (typeof categoryId === 'string') return { name: '', icon: 'package', color: '#9EA3B8' };
    return categoryId;
  };

  return (
    <>
      <CustomTable
        data={filteredData}
        columns={columns}
        showSort={true}
        responsive={true}
        stickyHeader={true}
        compact={true}
        rowHover={true}
        rowBordered={true}
        emptyMessage="Không có giao dịch"
        tableClassName="min-w-[800px]"
        scrollClassName="scrollbar-thin scrollbar-thumb-[#E0E3EC] scrollbar-track-transparent hide-scrollbar-y"
        isLoading={isLoading}
        isSelectable={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        title="Danh sách giao dịch"
        badge={{ label: `${filteredData.length} giao dịch`, variant: 'secondary' }}
        badgeActiveFilter={hasActiveFilters ? { count: activeFilterCount } : undefined}
        supportingText={`Thu: +${formatCurrency(totalIncome)} | Chi: -${formatCurrency(totalExpense)}`}
        onFilter={() => {}}
        onFilterClear={clearFilters}
        onDelete={() => deleteSelected(selectedIds)}
        isDeleting={isDeleting}
        selectedCount={selectedIds.length}
        onExport={() => console.log('Export')}
        showSearch={true}
        searchValue={searchQuery}
        searchPlaceholder="Tìm kiếm giao dịch..."
        onSearchChange={setSearchQuery}
        filterPanel={FilterPanel}
        className="hide-scrollbar-y"
      />

      {/* Detail Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${getCategoryInfo(selectedTransaction.categoryId).color}20` }}
                >
                  <CategoryIcon
                    iconId={getCategoryInfo(selectedTransaction.categoryId).icon}
                    size={28}
                    style={{ color: getCategoryInfo(selectedTransaction.categoryId).color }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedTransaction.description || 'Không có mô tả'}</p>
                  <Badge
                    variant={selectedTransaction.type === 'income' ? 'success' : 'destructive'}
                  >
                    {selectedTransaction.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#5A607F]">Số tiền</p>
                  <p className={`font-semibold ${selectedTransaction.type === 'income' ? 'text-[#21AE5A]' : 'text-[#E40127]'}`}>
                    {selectedTransaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#5A607F]">Ngày</p>
                  <p className="font-medium">
                    {new Date(selectedTransaction.date).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#5A607F]">Danh mục</p>
                  <p className="font-medium">{getCategoryInfo(selectedTransaction.categoryId).name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5A607F]">Ví</p>
                  <p className="font-medium">
                    {typeof selectedTransaction.walletId === 'object' && selectedTransaction.walletId
                      ? selectedTransaction.walletId.name
                      : 'N/A'}
                  </p>
                </div>
              </div>
              {selectedTransaction.note && (
                <div>
                  <p className="text-sm text-[#5A607F]">Ghi chú</p>
                  <p className="font-medium">{selectedTransaction.note}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <TransactionFormDialog
        trigger={<span />}
        initialData={editingTransaction ? {
          _id: editingTransaction._id,
          type: editingTransaction.type,
          walletId: typeof editingTransaction.walletId === 'object' ? editingTransaction.walletId._id : editingTransaction.walletId,
          categoryId: typeof editingTransaction.categoryId === 'object' ? editingTransaction.categoryId._id : editingTransaction.categoryId,
          amount: editingTransaction.amount,
          description: editingTransaction.description,
          date: editingTransaction.date,
          note: editingTransaction.note,
        } : undefined}
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        onSuccess={() => {
          setEditingTransaction(null);
          fetchTransactions(1);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingTransaction}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
        itemName={deletingTransaction?.description}
        itemAmount={deletingTransaction?.amount}
        itemType={deletingTransaction?.type}
        onConfirm={() => {
          if (deletingTransaction?._id) {
            deleteOne(deletingTransaction._id);
          }
        }}
        isDeleting={isDeleting}
      />
    </>
  );
}
