"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query";
import { apiClient } from "@/lib/api-client";

export interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  currency: string;
  description: string;
  date: string;
  note?: string;
  walletId: string | { _id: string; name: string; color: string };
  categoryId:
    | string
    | { _id: string; name: string; icon: string; color: string };
  createdAt?: string;
  updatedAt?: string;
}

// Backend response shape: { data, total, page, totalPages }
interface BackendTransactionsResponse {
  data: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}

// Frontend shape (giữ tương thích các component cũ): { transactions, pagination }
export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TransactionFilters {
  walletId?: string;
  categoryId?: string;
  type?: "income" | "expense";
  period?: "day" | "week" | "month" | "quarter" | "year" | "all";
  startDate?: string;
  endDate?: string;
}

const TRANSACTIONS_ENDPOINT = "/transactions";
const DEFAULT_LIMIT = 20;

function buildQueryString(
  filters: TransactionFilters,
  page: number,
  limit: number
): string {
  const params = new URLSearchParams();
  if (filters.walletId) params.set("walletId", filters.walletId);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.type) params.set("type", filters.type);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  params.set("page", String(page));
  params.set("limit", String(limit));
  return params.toString();
}

async function fetchTransactionsPage(
  filters: TransactionFilters,
  page: number,
  limit: number
): Promise<TransactionsResponse> {
  const queryString = buildQueryString(filters, page, limit);
  const response = await apiClient.get<BackendTransactionsResponse>(
    `${TRANSACTIONS_ENDPOINT}?${queryString}`
  );

  // Map shape backend → frontend
  return {
    transactions: response.data,
    pagination: {
      page: response.page,
      limit,
      total: response.total,
      totalPages: response.totalPages,
    },
  };
}

const postTransaction = (
  input: Omit<Transaction, "_id" | "createdAt" | "updatedAt">
) => apiClient.post<Transaction>(TRANSACTIONS_ENDPOINT, input);

const deleteTransactionApi = (transactionId: string) =>
  apiClient.delete<void>(`${TRANSACTIONS_ENDPOINT}/${transactionId}`);

export function useTransactions(
  filters: TransactionFilters = {},
  autoFetch = true
) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = DEFAULT_LIMIT;

  const query = useQuery({
    queryKey: QUERY_KEYS.transactions.list({
      ...filters,
      page: currentPage,
      limit,
    }),
    queryFn: () => fetchTransactionsPage(filters, currentPage, limit),
    enabled: autoFetch,
    staleTime: 30 * 1000,
  });

  const invalidateTransactionRelated = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.transactions.all,
    });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets.all });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports.all });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets.all });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: postTransaction,
    onSuccess: invalidateTransactionRelated,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransactionApi,
    onSuccess: invalidateTransactionRelated,
  });

  const fetchTransactions = useCallback((page = 1) => {
    setCurrentPage(page);
  }, []);

  const createTransaction = useCallback(
    async (data: Omit<Transaction, "_id" | "createdAt" | "updatedAt">) => {
      try {
        const transaction = await createMutation.mutateAsync(data);
        return { success: true, transaction };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [createMutation]
  );

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      try {
        await deleteMutation.mutateAsync(transactionId);
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [deleteMutation]
  );

  const transactions = query.data?.transactions ?? [];
  const pagination = query.data?.pagination ?? {
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
  };

  return {
    transactions,
    pagination,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    fetchTransactions,
    createTransaction,
    deleteTransaction,
  };
}
