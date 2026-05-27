"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query";
import { apiClient } from "@/lib/api-client";
import { PAGINATION_LIMITS } from "@/types/pagination";

interface InfiniteTransactionsFilter {
  walletId?: string;
  categoryId?: string;
  type?: "income" | "expense";
  period?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

interface TransactionItem {
  _id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  currency: string;
  note?: string;
  walletId?: { _id: string; name: string; color: string } | null;
  categoryId?:
    | { _id: string; name: string; icon: string; color: string }
    | null;
}

// Backend response: { data, total, page, totalPages }
interface BackendResponse {
  data: TransactionItem[];
  total: number;
  page: number;
  totalPages: number;
}

const TRANSACTIONS_ENDPOINT = "/transactions";

function buildUrl(
  filter: InfiniteTransactionsFilter,
  page: number,
  limit: number
): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (filter.walletId) params.set("walletId", filter.walletId);
  if (filter.categoryId) params.set("categoryId", filter.categoryId);
  if (filter.type) params.set("type", filter.type);
  if (filter.startDate) params.set("startDate", filter.startDate);
  if (filter.endDate) params.set("endDate", filter.endDate);
  return `${TRANSACTIONS_ENDPOINT}?${params.toString()}`;
}

async function fetchPage(
  filter: InfiniteTransactionsFilter,
  page: number,
  limit: number
): Promise<BackendResponse> {
  return apiClient.get<BackendResponse>(buildUrl(filter, page, limit));
}

/**
 * Hook fetch transactions theo offset-based pagination với infinite scroll UX.
 *
 * Backend dùng page/limit thuần. Frontend giả lập infinite scroll bằng cách
 * tăng `pageParam` mỗi lần fetch next page.
 */
export function useInfiniteTransactions(
  filter: InfiniteTransactionsFilter = {}
) {
  const limit = filter.limit ?? PAGINATION_LIMITS.DEFAULT_LIMIT;

  const filterKey = useMemo(
    () => filter,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      filter.walletId,
      filter.categoryId,
      filter.type,
      filter.period,
      filter.startDate,
      filter.endDate,
      filter.limit,
    ]
  );

  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.transactions.infinite(filterKey),
    queryFn: ({ pageParam }) => fetchPage(filterKey, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Còn page tiếp theo nếu currentPage < totalPages
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 30 * 1000,
  });

  const transactions = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data]
  );

  return {
    transactions,
    hasMore: query.hasNextPage,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    error: query.error?.message ?? null,
    loadMore: query.fetchNextPage,
    reset: query.refetch,
  };
}
