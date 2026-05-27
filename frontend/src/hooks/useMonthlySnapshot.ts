"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  MonthlySnapshotSummary,
  WalletSnapshotResponse,
} from "@/types/wallet-snapshot";

const SNAPSHOTS_ENDPOINT = "/wallets/snapshots";

interface BackendSnapshotItem {
  snapshot: {
    _id: string;
    walletId: string;
    monthKey: string;
    startBalance: number;
    totalIncome: number;
    totalExpense: number;
    endBalance: number;
    transactionCount: number;
    currency: string;
    isCurrentMonth: boolean;
  };
  wallet: {
    _id: string;
    name: string;
    color: string;
    type: string;
  };
}

/**
 * Backend trả `[{ snapshot, wallet }]`. Frontend cần `MonthlySnapshotSummary`
 * (đã aggregate). Mình transform tại đây.
 */
async function fetchMonthlySnapshot(
  monthKey?: string
): Promise<MonthlySnapshotSummary> {
  const url = monthKey
    ? `${SNAPSHOTS_ENDPOINT}?monthKey=${encodeURIComponent(monthKey)}`
    : SNAPSHOTS_ENDPOINT;

  const items = await apiClient.get<BackendSnapshotItem[]>(url);

  const wallets: WalletSnapshotResponse[] = items.map(({ snapshot, wallet }) => ({
    walletId: snapshot.walletId,
    walletName: wallet.name,
    walletColor: wallet.color,
    walletType: wallet.type,
    monthKey: snapshot.monthKey,
    startBalance: snapshot.startBalance,
    totalIncome: snapshot.totalIncome,
    totalExpense: snapshot.totalExpense,
    endBalance: snapshot.endBalance,
    transactionCount: snapshot.transactionCount,
    currency: snapshot.currency,
    isCurrentMonth: snapshot.isCurrentMonth,
  }));

  const resolvedMonthKey =
    wallets[0]?.monthKey ?? monthKey ?? new Date().toISOString().slice(0, 7);

  return {
    monthKey: resolvedMonthKey,
    totalStartBalance: wallets.reduce((sum, w) => sum + w.startBalance, 0),
    totalEndBalance: wallets.reduce((sum, w) => sum + w.endBalance, 0),
    totalIncome: wallets.reduce((sum, w) => sum + w.totalIncome, 0),
    totalExpense: wallets.reduce((sum, w) => sum + w.totalExpense, 0),
    netChange: wallets.reduce(
      (sum, w) => sum + (w.totalIncome - w.totalExpense),
      0
    ),
    wallets,
  };
}

/**
 * Hook fetch monthly snapshot cho 1 tháng cụ thể (mặc định: tháng hiện tại).
 */
export function useMonthlySnapshot(monthKey?: string) {
  const query = useQuery({
    queryKey: QUERY_KEYS.wallets.snapshot(monthKey),
    queryFn: () => fetchMonthlySnapshot(monthKey),
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}
