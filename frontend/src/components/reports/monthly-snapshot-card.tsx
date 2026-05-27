"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { ArrowRight, TrendingUp, TrendingDown, Wallet as WalletIcon, Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/format-number";
import { SNAPSHOT_LABELS } from "@/constants/wallet-snapshot";
import type { WalletSnapshotResponse, MonthlySnapshotSummary } from "@/types/wallet-snapshot";

interface MonthlySnapshotCardProps {
  data: MonthlySnapshotSummary | null;
  isLoading: boolean;
}

export function MonthlySnapshotCard({ data, isLoading }: MonthlySnapshotCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#827BF2]" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.wallets.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-[#5A607F]">
          {SNAPSHOT_LABELS.noData}
        </CardContent>
      </Card>
    );
  }

  const renderTotalSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 rounded-xl bg-[#827BF2]/5 border border-[#827BF2]/20">
        <p className="text-sm text-[#5A607F] mb-1">{SNAPSHOT_LABELS.startBalance}</p>
        <p className="text-xl font-bold text-[#1A1D2E]">
          {formatCurrency(data.totalStartBalance)}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-[#827BF2]/10 border border-[#827BF2]/30">
        <div className="flex items-center gap-1 mb-1">
          <p className="text-sm text-[#5A607F]">{SNAPSHOT_LABELS.netChange}</p>
          {data.netChange >= 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-[#21AE5A]" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-[#E40127]" />
          )}
        </div>
        <p
          className="text-xl font-bold"
          style={{ color: data.netChange >= 0 ? "#21AE5A" : "#E40127" }}
        >
          {data.netChange >= 0 ? "+" : ""}
          {formatCurrency(data.netChange)}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-[#21AE5A]/5 border border-[#21AE5A]/20">
        <p className="text-sm text-[#5A607F] mb-1">{SNAPSHOT_LABELS.endBalance}</p>
        <p className="text-xl font-bold text-[#21AE5A]">
          {formatCurrency(data.totalEndBalance)}
        </p>
      </div>
    </div>
  );

  const renderWalletRow = (wallet: WalletSnapshotResponse) => {
    const change = wallet.totalIncome - wallet.totalExpense;

    return (
      <div
        key={wallet.walletId}
        className="p-4 rounded-xl border border-[#E0E3EC] hover:border-[#827BF2]/40 transition-colors"
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${wallet.walletColor}20` }}
          >
            <WalletIcon className="w-4 h-4" style={{ color: wallet.walletColor }} />
          </div>
          <div>
            <p className="font-semibold text-[#1A1D2E]">{wallet.walletName}</p>
            <p className="text-xs text-[#5A607F]">
              {wallet.transactionCount} giao dịch
              {wallet.isCurrentMonth && " · Đang trong tháng"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-[#5A607F]">{SNAPSHOT_LABELS.startBalance}</p>
            <p className="font-semibold text-[#1A1D2E]">
              {formatCurrency(wallet.startBalance)}
            </p>
          </div>

          <ArrowRight className="w-4 h-4 text-[#9EA3B8] mx-3 shrink-0" />

          <div className="flex-1 text-right">
            <p className="text-xs text-[#5A607F]">{SNAPSHOT_LABELS.endBalance}</p>
            <p className="font-bold" style={{ color: wallet.walletColor }}>
              {formatCurrency(wallet.endBalance)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E0E3EC]">
          <div>
            <p className="text-xs text-[#5A607F]">{SNAPSHOT_LABELS.totalIncome}</p>
            <p className="text-sm font-semibold text-[#21AE5A]">
              +{formatCurrency(wallet.totalIncome)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#5A607F]">{SNAPSHOT_LABELS.totalExpense}</p>
            <p className="text-sm font-semibold text-[#E40127]">
              -{formatCurrency(wallet.totalExpense)}
            </p>
          </div>
        </div>

        {change !== 0 && (
          <div className="mt-2 pt-2 border-t border-[#E0E3EC] text-right">
            <span
              className="text-xs font-medium"
              style={{ color: change >= 0 ? "#21AE5A" : "#E40127" }}
            >
              {change >= 0 ? "+" : ""}
              {formatCurrency(change)} {SNAPSHOT_LABELS.netChange.toLowerCase()}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Số dư theo tháng — {data.monthKey}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderTotalSummary()}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.wallets.map(renderWalletRow)}
        </div>
      </CardContent>
    </Card>
  );
}
