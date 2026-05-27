"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query";
import { apiClient } from "@/lib/api-client";

import type {
  Wallet,
  CreateWalletData,
  UpdateWalletData,
  WalletFormData,
} from "@/types/wallet";
import type { WalletOption } from "@/types/wallet-option";

export type { WalletFormData, WalletOption };
export type { Wallet, CreateWalletData, UpdateWalletData };

const WALLETS_ENDPOINT = "/wallets";

const fetchWallets = () => apiClient.get<Wallet[]>(WALLETS_ENDPOINT);

const postWallet = (input: CreateWalletData) =>
  apiClient.post<Wallet>(WALLETS_ENDPOINT, input);

const putWallet = (walletId: string, input: UpdateWalletData) =>
  apiClient.put<Wallet>(`${WALLETS_ENDPOINT}/${walletId}`, input);

const deleteWalletApi = (walletId: string) =>
  apiClient.delete<void>(`${WALLETS_ENDPOINT}/${walletId}`);

export function useWallets() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.wallets.list(),
    queryFn: fetchWallets,
    staleTime: 2 * 60 * 1000,
  });

  const wallets = query.data ?? [];

  const invalidateWallets = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets.all });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports.all });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: postWallet,
    onSuccess: invalidateWallets,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      walletId,
      data,
    }: {
      walletId: string;
      data: UpdateWalletData;
    }) => putWallet(walletId, data),
    onSuccess: invalidateWallets,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWalletApi,
    onSuccess: invalidateWallets,
  });

  const createWallet = useCallback(
    async (
      walletData: CreateWalletData
    ): Promise<{ success: boolean; error?: string; data?: Wallet }> => {
      try {
        const data = await createMutation.mutateAsync(walletData);
        return { success: true, data };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [createMutation]
  );

  const updateWallet = useCallback(
    async (
      walletId: string,
      walletData: UpdateWalletData
    ): Promise<{ success: boolean; error?: string; data?: Wallet }> => {
      try {
        const data = await updateMutation.mutateAsync({
          walletId,
          data: walletData,
        });
        return { success: true, data };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [updateMutation]
  );

  const deleteWallet = useCallback(
    async (
      walletId: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        await deleteMutation.mutateAsync(walletId);
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [deleteMutation]
  );

  const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
  const primaryWallet = wallets.find((w) => w.isPrimary) || wallets[0];

  return {
    wallets,
    primaryWallet,
    totalBalance,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    fetchWallets: query.refetch,
    createWallet,
    updateWallet,
    deleteWallet,
  };
}
