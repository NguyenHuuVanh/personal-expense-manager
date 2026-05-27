"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query";
import { apiClient } from "@/lib/api-client";

import type { BudgetItem } from "@/types/budget";

export type { BudgetItem } from "@/types/budget";

export type BudgetPeriod = "day" | "week" | "month" | "quarter" | "year";

const BUDGETS_ENDPOINT = "/budgets";

interface BudgetQueryParams {
  month?: number;
  year?: number;
}

/**
 * Fetch budgets — backend hỗ trợ filter theo month/year.
 * Nếu period = "month" → tự lấy tháng/năm hiện tại.
 */
const fetchBudgets = (period: BudgetPeriod): Promise<BudgetItem[]> => {
  const params: BudgetQueryParams = {};
  if (period === "month") {
    const now = new Date();
    params.month = now.getMonth() + 1;
    params.year = now.getFullYear();
  }
  // Các period khác (day/week/quarter/year) → fetch all rồi filter client (hoặc backend mở rộng sau)

  const queryString = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      if (v !== undefined) acc[k] = String(v);
      return acc;
    }, {})
  ).toString();

  return apiClient.get<BudgetItem[]>(
    `${BUDGETS_ENDPOINT}${queryString ? `?${queryString}` : ""}`
  );
};

interface CreateBudgetInput {
  categoryId: string;
  budgetAmount: number;
  period?: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

const postBudget = (input: CreateBudgetInput) =>
  apiClient.post<BudgetItem>(BUDGETS_ENDPOINT, input);

const deleteBudgetApi = (budgetId: string) =>
  apiClient.delete<void>(`${BUDGETS_ENDPOINT}/${budgetId}`);

export function useBudgets(period: BudgetPeriod = "month") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...QUERY_KEYS.budgets.list(), period],
    queryFn: () => fetchBudgets(period),
    staleTime: 60 * 1000,
  });

  const invalidateBudgets = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets.all });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports.all });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: postBudget,
    onSuccess: invalidateBudgets,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBudgetApi,
    onSuccess: invalidateBudgets,
  });

  const createBudget = useCallback(
    async (categoryId: string, budgetAmount: number) => {
      try {
        // Tự build start/end date theo period hiện tại (mặc định monthly)
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );

        const budget = await createMutation.mutateAsync({
          categoryId,
          budgetAmount,
          period: "monthly",
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          isActive: true,
        });
        return { success: true, budget };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [createMutation]
  );

  const deleteBudget = useCallback(
    async (budgetId: string) => {
      try {
        await deleteMutation.mutateAsync(budgetId);
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [deleteMutation]
  );

  const budgets = query.data ?? [];
  const totalBudget = budgets.reduce(
    (sum, b) => sum + (b.budgetAmount || 0),
    0
  );
  const totalSpent = budgets.reduce(
    (sum, b) => sum + (b.spentAmount || 0),
    0
  );
  const overBudgetCount = budgets.filter((b) => b.isOverBudget).length;

  return {
    budgets,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    fetchBudgets: query.refetch,
    createBudget,
    deleteBudget,
    totalBudget,
    totalSpent,
    overBudgetCount,
  };
}
