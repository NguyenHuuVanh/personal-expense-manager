"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/format-number";
import { cn } from "@/utils/cn";
import { Button } from "@/components/shadcn-ui/button";
import { Badge } from "@/components/shadcn-ui/badge";
import type { WalletsSectionProps } from "@/types/right-panel";
import type { Wallet } from "@/hooks/use-wallets";

const WalletTypeLabels: Record<string, string> = {
  cash: "Tiền mặt",
  bank: "Ngân hàng",
  "e-wallet": "Ví điện tử",
  card: "Thẻ",
};

function WalletsSection({
  onAddWallet,
  onEditWallet,
  onDeleteWallet,
  wallets,
  totalBalance,
  lowBalanceThreshold,
  isLoading,
}: WalletsSectionProps) {
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");

  useEffect(() => {
    if (!isLoading && wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0]._id);
    }
  }, [isLoading, wallets, selectedWalletId]);

  const selectedWallet = wallets.find((w) => w._id === selectedWalletId);
  const otherWallets = wallets.filter((w) => w._id !== selectedWalletId);

  const isLowBalance = (balance: number) => balance < lowBalanceThreshold;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#827BF2]" />
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-[#5A607F] mb-3">Chưa có ví nào</p>
        <Button onClick={onAddWallet} size="sm" className="bg-[#827BF2] hover:bg-[#6B5CE7] text-white">
          <Plus className="w-4 h-4 mr-1" />
          Thêm ví đầu tiên
        </Button>
      </div>
    );
  }

  return (
    <div>
      {selectedWallet && (
        <WalletCard
          wallet={selectedWallet}
          isLowBalance={isLowBalance(selectedWallet.balance)}
          onEdit={() => {
            onEditWallet(selectedWallet);
          }}
          onDelete={() => {
            onDeleteWallet(selectedWallet);
          }}
        />
      )}

      <div className="space-y-1.5">
        {otherWallets.map((wallet) => (
          <WalletListItem
            key={wallet._id}
            wallet={wallet}
            isLowBalance={isLowBalance(wallet.balance)}
            onClick={() => setSelectedWalletId(wallet._id)}
          />
        ))}
      </div>

      <button
        onClick={onAddWallet}
        className="w-full mt-2 flex items-center justify-center gap-1 py-1.5 rounded-lg border-2 border-dashed border-[#E0E3EC] text-[#827BF2] hover:bg-[#EAE8FD] hover:border-[#827BF2] transition-colors"
      >
        <Plus className="w-3 h-3" />
        <span className="text-xs font-medium">Thêm ví</span>
      </button>

      <div className="mt-2 pt-2 border-t">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#5A607F]">Tổng số dư</span>
          <span className="text-xs font-bold text-[#1A1D2E]">{formatCurrency(totalBalance)}</span>
        </div>
      </div>
    </div>
  );
}

interface WalletCardProps {
  wallet: Wallet;
  isLowBalance: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function WalletCard({ wallet, isLowBalance, onEdit, onDelete }: WalletCardProps) {
  return (
    <div
      className="rounded-lg p-3 mb-2 text-white transition-all duration-300 relative"
      style={{
        background: `linear-gradient(135deg, ${wallet.color}, ${wallet.color}CC)`,
      }}
    >
      <div className="text-[10px] opacity-80 mb-0.5">{wallet.name}</div>
      <div className="text-lg font-bold mb-0.5">{formatCurrency(wallet.balance)}</div>

      {(wallet.type === "bank" || wallet.type === "e-wallet" || wallet.type === "card") && (
        <>
          {wallet.accountNumber && (
            <div className="text-[10px] opacity-90 font-medium tracking-wider">{wallet.accountNumber}</div>
          )}
          {wallet.accountHolder && <div className="text-[10px] opacity-80 uppercase">{wallet.accountHolder}</div>}
        </>
      )}

      {wallet.type === "cash" && <div className="text-[10px] opacity-70">Tiền mặt</div>}

      {isLowBalance && (
        <div className="mt-1">
          <Badge variant="destructive" className="text-[9px] py-0 h-4 bg-white/20 text-white border-0">
            Sắp hết
          </Badge>
        </div>
      )}
    </div>
  );
}

interface WalletListItemProps {
  wallet: Wallet;
  isLowBalance: boolean;
  onClick: () => void;
}

function WalletListItem({ wallet, isLowBalance, onClick }: WalletListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between py-1.5 px-2.5 rounded-lg cursor-pointer transition-all duration-200",
        "hover:bg-[#F2F4F8] active:scale-[0.98]",
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: wallet.color }}
        >
          {wallet.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium text-[#1A1D2E] truncate">{wallet.name}</div>
          <div className="text-[10px] text-[#9EA3B8] truncate">{WalletTypeLabels[wallet.type] || wallet.type}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-[#1A1D2E]">{formatCurrency(wallet.balance)}</span>
        {isLowBalance && <span className="text-[10px] text-[#E40127] font-medium">Sắp hết</span>}
      </div>
    </div>
  );
}

export { WalletsSection };
