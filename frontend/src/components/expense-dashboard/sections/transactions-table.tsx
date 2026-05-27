"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { formatCurrency } from "@/utils/format-number";
import { CustomTable } from "@/components/custom-fields/custom-table";
import { getTransactionColumns, type ColumnWidths } from "@/types/columns/transactions-table";
import { FilterBar } from "@/components/filter-bar";
import { TRANSACTION_FILTER_FIELDS, applyTransactionFilters } from "@/data/filter-configs/transactions-filter-config";
import type { SimpleFilterCondition } from "@/types/filter";
import { useTransactions, useTableDelete } from "@/hooks";
import type { Transaction } from "@/hooks";

interface TransactionsTableProps {
  className?: string;
  columnWidths?: ColumnWidths;
}

export function TransactionsTable({ className, columnWidths }: TransactionsTableProps) {
  const { transactions, isLoading, fetchTransactions } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const { isDeleting, deleteSelected } = useTableDelete({
    endpoint: "/api/transactions",
    onSuccess: () => {
      setSelectedIds([]);
      fetchTransactions();
    },
  });

  // Filter state
  const [filters, setFilters] = useState<SimpleFilterCondition[]>([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isFilterOpen &&
        filterPanelRef.current &&
        filterButtonRef.current &&
        !filterPanelRef.current.contains(e.target as Node) &&
        !filterButtonRef.current.contains(e.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  // Filtered data
  const filteredData = useMemo(() => {
    let data = [...transactions];

    if (searchQuery || filters.length > 0) {
      data = applyTransactionFilters(data, isFilterApplied ? filters : [], searchQuery);
    }

    return data;
  }, [transactions, searchQuery, filters, isFilterApplied]);

  const totalIncome = filteredData
    .filter((t: Transaction) => t.type === "income")
    .reduce((s, t: Transaction) => s + t.amount, 0);
  const totalExpense = filteredData
    .filter((t: Transaction) => t.type === "expense")
    .reduce((s, t: Transaction) => s + t.amount, 0);

  const activeFilterCount = isFilterApplied ? filters.length : 0;

  const handleApplyFilters = () => {
    setIsFilterApplied(true);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters([]);
    setIsFilterApplied(false);
  };

  const handleDeleteSelected = useCallback(async () => {
    await deleteSelected(selectedIds);
  }, [selectedIds, deleteSelected]);

  const handleEdit = useCallback((row: Transaction) => {
    console.log("Edit transaction:", row);
  }, []);

  const handleDelete = useCallback((row: Transaction) => {
    console.log("Delete transaction:", row);
  }, []);

  const columns = getTransactionColumns({
    variant: "dashboard",
    columnWidths,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <CustomTable
      enableHorizontalScroll={true}
      data={filteredData}
      columns={columns}
      isLoading={isLoading}
      showSort={true}
      showFilters={false}
      responsive={true}
      stickyHeader={true}
      compact={true}
      rowHover={true}
      rowBordered={true}
      emptyMessage="Không có giao dịch"
      className={className}
      tableMinWidth="1400px"
      scrollClassName="[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-[#E0E3EC] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:rounded-full"
      // Selection
      isSelectable={true}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      // Header
      title="Giao dịch gần đây"
      badge={{ label: `${filteredData.length} giao dịch`, variant: "secondary" }}
      badgeActiveFilter={activeFilterCount > 0 ? { count: activeFilterCount } : undefined}
      supportingText={`Thu: +${formatCurrency(totalIncome)} | Chi: -${formatCurrency(totalExpense)}`}
      onDelete={handleDeleteSelected}
      isDeleting={isDeleting}
      selectedCount={selectedIds.length}
      onFilter={() => setIsFilterOpen(!isFilterOpen)}
      onFilterClear={handleClearFilters}
      filterButtonRef={filterButtonRef}
      onExport={() => console.log("Export")}
      // Search in header
      showSearch={true}
      searchValue={searchQuery}
      searchPlaceholder="Tìm kiếm..."
      onSearchChange={(value) => {
        setSearchQuery(value);
        if (!isFilterApplied && value) {
          setIsFilterApplied(true);
        }
      }}
      // Filter panel
      filterPanel={
        <div className="px-6 py-4">
          <FilterBar
            fields={TRANSACTION_FILTER_FIELDS}
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleApplyFilters}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
      }
      isFilterOpen={isFilterOpen}
    />
  );
}
