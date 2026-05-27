'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { ReportSummaryCards } from './report-summary-cards';
import { CategoryBreakdownChart } from './category-breakdown-chart';
import type { ReportCategory } from '@/types/report';

const EXPENSE_API_ENDPOINT = '/api/reports?type=expense';

interface ExpenseReportData {
  categories: ReportCategory[];
  totalExpense: number;
  expenseCount: number;
}

export function ExpenseReport() {
  const [categories, setCategories] = useState<ReportCategory[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExpenseReport = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(EXPENSE_API_ENDPOINT);
      const data: Partial<ExpenseReportData> = await response.json();

      setCategories(data.categories ?? []);
      setTotalExpense(data.totalExpense ?? 0);
      setExpenseCount(data.expenseCount ?? 0);
    } catch (error) {
      console.error('Error fetching expense report:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchExpenseReport();
  }, [fetchExpenseReport]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#827BF2]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards — tái sử dụng component dùng chung */}
      <ReportSummaryCards
        variant="expense"
        totalAmount={totalExpense}
        transactionCount={expenseCount}
      />

      {/* Donut chart + danh sách category — tái sử dụng component dùng chung */}
      <CategoryBreakdownChart
        variant="expense"
        categories={categories}
        total={totalExpense}
        chartTitle="Chi tiêu theo danh mục"
        detailTitle="Chi tiết chi tiêu"
      />
    </div>
  );
}
