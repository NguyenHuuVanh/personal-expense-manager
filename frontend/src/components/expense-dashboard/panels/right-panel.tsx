"use client";

import { useState } from "react";
import { useWallets } from "@/hooks/use-wallets";
import { useAuth } from "@/contexts/auth-context";
import { useDateRange } from "@/contexts/date-range-context";
import { useDashboardReport } from "@/hooks/use-dashboard-report";
import { DeleteWalletModal, WalletsSection, DonutChartSection } from "./sections";
import { Card } from "./components/card";
import { WalletFormDialog } from "@/components/wallets/wallet-form-dialog";
import type { Wallet } from "@/hooks/use-wallets";
import { DEFAULT_LOW_BALANCE_THRESHOLD } from "@/constants/right-panel";

export function RightPanel() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [deletingWallet, setDeletingWallet] = useState<Wallet | null>(null);

  const { wallets, totalBalance, error, createWallet, updateWallet, deleteWallet } = useWallets();
  const { user } = useAuth();
  const { dateRange } = useDateRange();
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardReport({ dateRange });
  const categoryBreakdown = dashboardData?.categoryBreakdown || [];
  const lowBalanceThreshold = user?.settings?.lowBalanceThreshold || DEFAULT_LOW_BALANCE_THRESHOLD;

  const openWalletModal = (wallet?: Wallet) => {
    setEditingWallet(wallet ?? null);
    setIsWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
    setEditingWallet(null);
  };

  const openDeleteModal = (wallet: Wallet) => {
    setDeletingWallet(wallet);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingWallet(null);
  };

  const handleWalletSubmit = async (data: Parameters<typeof createWallet>[0]) => {
    if (editingWallet) {
      return await updateWallet(editingWallet._id, data);
    }
    return await createWallet(data);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingWallet) return { success: false, error: "No wallet selected" };
    return await deleteWallet(deletingWallet._id);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto hide-scrollbar overscroll-y-auto pt-4 gap-3 bg-[#f2f4f8] pr-3">
      <WalletFormDialog
        open={isWalletModalOpen}
        onOpenChange={(next) => (next ? setIsWalletModalOpen(true) : closeWalletModal())}
        wallet={editingWallet}
        onSubmit={handleWalletSubmit}
      />

      <DeleteWalletModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        wallet={deletingWallet}
        onConfirm={handleDeleteConfirm}
      />

      {error && <div className="mx-3 p-2 rounded-lg bg-red-50 text-red-600 text-xs">{error}</div>}

      <Card title="Ví & Tài Khoản" className="flex-1">
        <WalletsSection
          onAddWallet={() => openWalletModal()}
          onEditWallet={openWalletModal}
          onDeleteWallet={openDeleteModal}
          wallets={wallets}
          totalBalance={totalBalance}
          lowBalanceThreshold={lowBalanceThreshold}
          isLoading={false}
        />
      </Card>

      <Card title="Chi tiêu theo danh mục" badge={`${categoryBreakdown.length} danh mục`} className="flex-1">
        <DonutChartSection categories={categoryBreakdown} isLoading={isDashboardLoading} />
      </Card>
    </div>
  );
}
