"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query";
import { VIETQR_BANKS_API, BANK_LIST_CACHE_TTL_MS } from "@/constants/bank";
import type { Bank, VietQrBanksResponse } from "@/types/bank";

export type { Bank };

async function fetchBanks(): Promise<Bank[]> {
  const response = await fetch(VIETQR_BANKS_API);
  if (!response.ok) {
    throw new Error("Không thể tải danh sách ngân hàng");
  }
  const json = (await response.json()) as VietQrBanksResponse;
  if (json.code !== "00" || !Array.isArray(json.data)) {
    throw new Error(json.desc || "Dữ liệu ngân hàng không hợp lệ");
  }
  // Sort theo shortName cho UX dễ tìm
  return [...json.data].sort((a, b) => a.shortName.localeCompare(b.shortName));
}

/**
 * Hook fetch danh sách ngân hàng VN từ VietQR API.
 *
 * Đặc điểm:
 *  - Cache 24h vì list bank rất ít thay đổi
 *  - Share cache toàn app (mọi nơi dùng `useBanks` đều dùng chung 1 lần fetch)
 *  - Không retry quá nhiều vì API public, fail thì để user reload
 */
export function useBanks() {
  const query = useQuery({
    queryKey: QUERY_KEYS.banks.list(),
    queryFn: fetchBanks,
    staleTime: BANK_LIST_CACHE_TTL_MS,
    gcTime: BANK_LIST_CACHE_TTL_MS,
    retry: 1,
  });

  return {
    banks: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}

/**
 * Helper tìm bank theo code (vd: "VCB" → object Bank).
 */
export function findBankByCode(banks: Bank[], code: string): Bank | undefined {
  return banks.find((b) => b.code === code);
}
