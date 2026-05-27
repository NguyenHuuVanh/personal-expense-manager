"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query";
import { apiClient } from "@/lib/api-client";

export type {
  DashboardSummary,
  QuickStats,
  CategoryBreakdown,
  RecentTransaction,
  DashboardReport,
  DateRange,
  BudgetItem,
  BudgetSummary,
  TopCategory,
} from "@/types/expense-dashboard";

import type {
  DashboardReport,
  DateRange,
  CategoryBreakdown,
} from "@/types/expense-dashboard";

export type PeriodType = "day" | "week" | "month" | "quarter" | "year" | "all";

export interface DashboardFilters {
  dateRange?: DateRange | null;
  period?: PeriodType;
  categoryId?: string;
  type?: "income" | "expense" | "all";
}

const REPORTS_ENDPOINT = "/reports";

interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
  month: number;
  year: number;
}

interface CategoryAggregate {
  _id: string;
  total: number;
  count: number;
  category: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
}

/**
 * Backend hiện tách reports thành 3 endpoint:
 *   - /reports/monthly (summary income/expense/balance)
 *   - /reports/by-category (top categories)
 *   - /reports/daily (daily trend)
 *
 * Frontend cần shape tổng hợp `DashboardReport`. Mình gọi parallel + merge.
 */
async function fetchDashboardReport(
  filters: DashboardFilters
): Promise<DashboardReport> {
  // Resolve month + year
  let month: number;
  let year: number;

  if (filters.dateRange?.from) {
    month = filters.dateRange.from.getMonth() + 1;
    year = filters.dateRange.from.getFullYear();
  } else {
    const now = new Date();
    month = now.getMonth() + 1;
    year = now.getFullYear();
  }

  // Gọi parallel 2 endpoint cần thiết
  const [summary, byCategory] = await Promise.all([
    apiClient.get<MonthlySummary>(
      `${REPORTS_ENDPOINT}/monthly?month=${month}&year=${year}`
    ),
    apiClient.get<CategoryAggregate[]>(
      `${REPORTS_ENDPOINT}/by-category?month=${month}&year=${year}`
    ),
  ]);

  const totalIncome = summary.income;
  const totalExpense = summary.expense;
  const netBalance = summary.balance;
  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
      : 0;

  // Map category aggregate → CategoryBreakdown shape
  const categoryBreakdown: CategoryBreakdown[] = byCategory
    .filter((c) => c.category)
    .map((c) => ({
      _id: c._id,
      name: c.category!.name,
      icon: c.category!.icon,
      color: c.category!.color,
      total: c.total,
    }));

  const topExpenses = [...categoryBreakdown]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Build response giữ tương thích với DashboardReport shape cũ
  return {
    summary: {
      totalIncome,
      totalExpense,
      incomeCount: 0,
      expenseCount: 0,
      netBalance,
      incomeTrend: 0,
      expenseTrend: 0,
      balanceTrend: 0,
      totalBalance: 0, // Sẽ lấy từ wallet endpoint riêng nếu cần
      savingsRate,
      monthKey: `${year}-${String(month).padStart(2, "0")}`,
      period: `${year}-${String(month).padStart(2, "0")}`,
      dateRange: {
        start: `${year}-${String(month).padStart(2, "0")}-01`,
        end: `${year}-${String(month).padStart(2, "0")}-${new Date(
          year,
          month,
          0
        ).getDate()}`,
      },
    },
    quickStats: {
      transactionCount: 0,
      incomeCount: 0,
      expenseCount: 0,
      categoryCount: categoryBreakdown.length,
      walletCount: 0,
      budgetCount: 0,
      overBudgetCount: 0,
    },
    budgetSummary: {
      totalBudgetAmount: 0,
      totalBudgetSpent: 0,
      totalBudgetRemaining: 0,
      percentUsed: 0,
    },
    recentTransactions: [],
    categoryBreakdown,
    topExpenses,
    topIncomes: [],
    budgets: [],
  };
}

export function useDashboardReport(filters?: DashboardFilters | null) {
  const { dateRange, period = "month", categoryId, type } = filters || {};

  const stableFilters = useMemo<DashboardFilters>(() => {
    return {
      dateRange:
        dateRange?.from && dateRange?.to
          ? { from: dateRange.from, to: dateRange.to }
          : null,
      period,
      categoryId,
      type,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dateRange?.from?.getTime(),
    dateRange?.to?.getTime(),
    period,
    categoryId,
    type,
  ]);

  const queryKeyParams = useMemo(
    () => ({
      from: stableFilters.dateRange?.from?.toISOString() ?? null,
      to: stableFilters.dateRange?.to?.toISOString() ?? null,
      period: stableFilters.period,
      categoryId: stableFilters.categoryId,
      type: stableFilters.type,
    }),
    [stableFilters]
  );

  const query = useQuery({
    queryKey: QUERY_KEYS.reports.overview(queryKeyParams),
    queryFn: () => fetchDashboardReport(stableFilters),
    enabled: Boolean(
      (stableFilters.dateRange?.from && stableFilters.dateRange?.to) ||
        stableFilters.period
    ),
    staleTime: 60 * 1000,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    fetchReport: query.refetch,
  };
}
