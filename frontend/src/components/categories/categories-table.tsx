"use client";

import { apiFetch } from '@/lib/api-client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { CustomTable } from "@/components/custom-fields/custom-table";
import { getCategoryTableColumns } from "@/types/columns/categories-table";
import type { CategoryData as CategoryRow } from "@/types/columns/categories-table";
import { formatCurrency } from "@/utils/format-number";
import { useTableDelete } from "@/hooks/table";

interface CategoryBreakdown {
  _id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
}

interface CategoriesTableProps {
  refreshKey?: number;
}

export function CategoriesTable({ refreshKey = 0 }: CategoriesTableProps) {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>([]);
  const [incomeBreakdown, setIncomeBreakdown] = useState<CategoryBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // Batch delete hook
  const { isDeleting: isBatchDeleting, deleteSelected } = useTableDelete({
    endpoint: "/api/categories",
    successMessage: (count) => `ÄÃ£ xÃ³a ${count} danh má»¥c`,
    onSuccess: () => {
      setSelectedIds([]);
      fetchCategories();
    },
  });

  useEffect(() => {
    fetchCategories();
  }, [refreshKey]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);

      const categoriesRes = await apiFetch("/api/categories");

      if (!categoriesRes.ok) {
        const errorText = await categoriesRes.text();
        console.error("Categories API error:", categoriesRes.status, errorText);
        setIsLoading(false);
        return;
      }

      const categoriesData = await categoriesRes.json();

      if (categoriesData.categories) {
        setCategories(categoriesData.categories);
      }

      // Fetch expense breakdown
      try {
        const expenseRes = await apiFetch("/api/reports?type=expense");

        if (expenseRes.ok) {
          const expenseData = await expenseRes.json();
          if (expenseData.categories) {
            setExpenseBreakdown(expenseData.categories);
          }
        }
      } catch (expenseErr) {
        console.error("Expense breakdown fetch error:", expenseErr);
      }

      // Fetch income breakdown
      try {
        const incomeRes = await apiFetch("/api/reports?type=income");

        if (incomeRes.ok) {
          const incomeData = await incomeRes.json();
          if (incomeData.categories) {
            setIncomeBreakdown(incomeData.categories);
          }
        }
      } catch (incomeErr) {
        console.error("Income breakdown fetch error:", incomeErr);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getExpenseTotal = useCallback(
    (categoryId: string) => {
      const breakdown = expenseBreakdown.find((b) => b._id === categoryId);
      return breakdown?.total || 0;
    },
    [expenseBreakdown],
  );

  const getIncomeTotal = useCallback(
    (categoryId: string) => {
      const breakdown = incomeBreakdown.find((b) => b._id === categoryId);
      return breakdown?.total || 0;
    },
    [incomeBreakdown],
  );

  const totalExpense = expenseBreakdown.reduce((sum, cat) => sum + cat.total, 0);
  const totalIncome = incomeBreakdown.reduce((sum, cat) => sum + cat.total, 0);

  // Filter theo search
  const filteredData = useMemo(() => {
    if (!searchQuery) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(query));
  }, [categories, searchQuery]);

  const columns = useMemo(
    () =>
      getCategoryTableColumns({
        getExpenseTotal,
        getIncomeTotal,
        onSuccess: fetchCategories,
      }),
    [getExpenseTotal, getIncomeTotal],
  );

  return (
    <div>
      <CustomTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="ChÆ°a cÃ³ danh má»¥c nÃ o"
        isSelectable={true}
        showFilters={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        rowHover={true}
        rowBordered={true}
        compact={true}
        showSearch={true}
        searchValue={searchQuery}
        searchPlaceholder="TÃ¬m kiáº¿m danh má»¥c..."
        onSearchChange={setSearchQuery}
        title="Danh sÃ¡ch danh má»¥c"
        badge={{
          label: `${categories.length} danh má»¥c`,
          variant: "secondary",
        }}
        supportingText={`Chi tiÃªu: ${formatCurrency(totalExpense)} | Thu nháº­p: ${formatCurrency(totalIncome)}`}
        onDelete={() => deleteSelected(selectedIds)}
        isDeleting={isBatchDeleting}
        selectedCount={selectedIds.length}
        showPagination={true}
        pageSizeOptions={[10, 20, 50]}
        bodyHeight={300}
        scrollClassName="styled-scrollbar"
        stickyHeader={true}
      />
    </div>
  );
}
