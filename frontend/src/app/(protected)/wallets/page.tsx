'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Wallet, CreditCard, Building2, Smartphone } from 'lucide-react';
import { formatCurrency } from '@/utils/format-number';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Button } from '@/components/shadcn-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn-ui/dialog';
import { toast } from 'sonner';
import { WalletFormDialog, type WalletInitialData } from '@/components/wallets/wallet-form-dialog';
import { useWallets } from '@/hooks/use-wallets';
import type { Wallet as WalletType } from '@/types/wallet';

const WalletTypeLabels: Record<string, string> = {
  cash: 'Tiền mặt',
  bank: 'Ngân hàng',
  'e-wallet': 'Ví điện tử',
  card: 'Thẻ',
};

const walletTypeIcons: Record<string, React.ReactNode> = {
  cash: <Wallet className="w-6 h-6 text-white" />,
  bank: <Building2 className="w-6 h-6 text-white" />,
  'e-wallet': <Smartphone className="w-6 h-6 text-white" />,
  card: <CreditCard className="w-6 h-6 text-white" />,
};

const walletToInitialData = (wallet: WalletType): WalletInitialData => ({
  _id: wallet._id,
  name: wallet.name,
  type: wallet.type,
  balance: wallet.balance,
  cardNumber: wallet.cardNumber,
  accountNumber: wallet.accountNumber,
  accountHolder: wallet.accountHolder,
  bankCode: wallet.bankCode,
  color: wallet.color,
});

export default function WalletsPage() {
  const { wallets, totalBalance, isLoading, deleteWallet, fetchWallets } = useWallets();
  const [deletingWallet, setDeletingWallet] = useState<WalletType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingWallet) return;

    setIsDeleting(true);
    const result = await deleteWallet(deletingWallet._id);
    setIsDeleting(false);

    if (result.success) {
      toast.success('Xóa ví thành công');
      setDeletingWallet(null);
    } else {
      toast.error(result.error || 'Xóa thất bại');
    }
  };

  if (isLoading) {
    return (
      <DashboardShell title="Ví của tôi" subtitle="Quản lý tất cả ví của bạn">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#827BF2]" />
        </div>
      </DashboardShell>
    );
  }

  const renderEmpty = () => (
    <div className="text-center py-12 bg-[#FAFBFC] rounded-xl border-2 border-dashed border-[#E0E3EC]">
      <Wallet className="w-12 h-12 mx-auto text-[#9EA3B8] mb-3" />
      <p className="text-[#5A607F] mb-4">Chưa có ví nào</p>
      <WalletFormDialog
        trigger={
          <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]">
            <Plus className="w-4 h-4 mr-2" />
            Tạo ví đầu tiên
          </Button>
        }
        onSuccess={() => void fetchWallets()}
      />
    </div>
  );

  const renderWalletCard = (wallet: WalletType) => (
    <div
      key={wallet._id}
      className="rounded-xl p-4 text-white relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${wallet.color}, ${wallet.color}CC)` }}
    >
      <div className="absolute top-3 right-3 flex gap-1">
        <WalletFormDialog
          trigger={
            <button
              type="button"
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Sửa ví"
            >
              <Pencil className="w-4 h-4" />
            </button>
          }
          initialData={walletToInitialData(wallet)}
          onSuccess={() => void fetchWallets()}
        />
        <button
          onClick={() => setDeletingWallet(wallet)}
          className="p-1.5 rounded-lg bg-white/20 hover:bg-red-500/50 transition-colors"
          aria-label="Xóa ví"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
          {walletTypeIcons[wallet.type]}
        </div>
        <div>
          <p className="font-semibold">{wallet.name}</p>
          <p className="text-xs opacity-80">{WalletTypeLabels[wallet.type]}</p>
        </div>
      </div>

      <p className="text-2xl font-bold mb-1">{formatCurrency(wallet.balance)}</p>

      {(wallet.type === 'bank' || wallet.type === 'e-wallet' || wallet.type === 'card') && (
        <div className="space-y-0.5 mt-3">
          {wallet.accountNumber && (
            <p className="text-xs opacity-90 font-mono">{wallet.accountNumber}</p>
          )}
          {wallet.accountHolder && (
            <p className="text-xs opacity-80 uppercase">{wallet.accountHolder}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <DashboardShell
      title="Ví của tôi"
      subtitle="Quản lý tất cả ví của bạn"
      actions={
        <WalletFormDialog
          trigger={
            <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]">
              <Plus className="w-4 h-4 mr-2" />
              Thêm ví mới
            </Button>
          }
          onSuccess={() => void fetchWallets()}
        />
      }
    >
      <div className="bg-gradient-to-r from-[#827BF2] to-[#6B5FD4] rounded-xl p-6 text-white mb-6">
        <p className="text-sm opacity-80 mb-1">Tổng số dư</p>
        <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
        <p className="text-sm opacity-80 mt-2">{wallets.length} ví</p>
      </div>

      {wallets.length === 0 ? renderEmpty() : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map(renderWalletCard)}
        </div>
      )}

      <Dialog open={!!deletingWallet} onOpenChange={() => setDeletingWallet(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa ví</DialogTitle>
          </DialogHeader>
          <p className="p-4">
            Bạn có chắc chắn muốn xóa ví <strong>{deletingWallet?.name}</strong> không?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingWallet(null)} disabled={isDeleting}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
