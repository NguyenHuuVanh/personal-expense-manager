'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, CreditCard, Smartphone, Banknote, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/shadcn-ui/card';
import { Button } from '@/components/shadcn-ui/button';
import { Badge } from '@/components/shadcn-ui/badge';
import { formatCurrency } from '@/utils/format-number';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/shadcn-ui/dialog';
import { Input } from '@/components/shadcn-ui/input';
import { SelectField } from '@/components/custom-fields/select-field';
import { apiClient, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';

interface Wallet {
  _id: string;
  name: string;
  type: 'bank' | 'cash' | 'e-wallet';
  balance: number;
  currency: string;
  cardNumber?: string;
  isPrimary: boolean;
  color: string;
}

const walletTypeOptions = [
  { value: 'bank', label: 'Tài khoản ngân hàng' },
  { value: 'e-wallet', label: 'Ví điện tử' },
  { value: 'cash', label: 'Tiền mặt' },
];

const colorOptions = [
  '#F89C34',
  '#827BF2',
  '#F66FAC',
  '#21AE5A',
  '#F2CC00',
  '#38BDF8',
];

const initialFormData = {
  name: '',
  type: 'bank' as 'bank' | 'cash' | 'e-wallet',
  balance: '',
  cardNumber: '',
  color: '#827BF2',
  isPrimary: false,
};

export function WalletSettings() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const resetForm = () => setFormData(initialFormData);

  const fetchWallets = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<Wallet[]>('/wallets');
      setWallets(data);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      toast.error('Không thể tải danh sách ví');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return <Banknote className="w-5 h-5" />;
      case 'e-wallet':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getWalletTypeLabel = (type: string) => {
    if (type === 'bank') return 'Ngân hàng';
    if (type === 'e-wallet') return 'Ví điện tử';
    return 'Tiền mặt';
  };

  const handleAddWallet = async () => {
    if (!formData.name.trim()) {
      toast.error('Tên ví không được để trống');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post('/wallets', {
        name: formData.name,
        type: formData.type,
        balance: Number(formData.balance) || 0,
        cardNumber: formData.cardNumber || undefined,
        color: formData.color,
        isPrimary: formData.isPrimary,
      });
      toast.success('Thêm ví thành công');
      setShowAddDialog(false);
      resetForm();
      fetchWallets();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateWallet = async () => {
    if (!selectedWallet || !formData.name.trim()) {
      toast.error('Tên ví không được để trống');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.put(`/wallets/${selectedWallet._id}`, {
        name: formData.name,
        type: formData.type,
        color: formData.color,
        isPrimary: formData.isPrimary,
      });
      toast.success('Cập nhật ví thành công');
      setShowEditDialog(false);
      setSelectedWallet(null);
      resetForm();
      fetchWallets();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWallet = async () => {
    if (!selectedWallet) return;

    setIsSubmitting(true);

    try {
      await apiClient.delete(`/wallets/${selectedWallet._id}`);
      toast.success('Xóa ví thành công');
      setShowDeleteDialog(false);
      setSelectedWallet(null);
      fetchWallets();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setFormData({
      name: wallet.name,
      type: wallet.type,
      balance: wallet.balance.toString(),
      cardNumber: wallet.cardNumber || '',
      color: wallet.color,
      isPrimary: wallet.isPrimary,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setShowDeleteDialog(true);
  };

  const closeAddDialog = () => {
    setShowAddDialog(false);
    resetForm();
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setSelectedWallet(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#827BF2]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1A1D2E]">Ví tiền của tôi</h2>
          <p className="text-sm text-[#5A607F]">Quản lý các tài khoản và ví tiền</p>
        </div>
        <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]" onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm ví
        </Button>
      </div>

      {wallets.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <p className="text-[#5A607F] mb-4">Chưa có ví nào</p>
          <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm ví đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <Card key={wallet._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${wallet.color}20` }}
                    >
                      <span style={{ color: wallet.color }}>{getWalletIcon(wallet.type)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1D2E]">{wallet.name}</p>
                      <Badge variant="secondary" className="text-xs mt-0.5">
                        {getWalletTypeLabel(wallet.type)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(wallet)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-[#E40127] hover:bg-red-50"
                      onClick={() => openDeleteDialog(wallet)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-sm text-[#5A607F]">Số dư</p>
                  <p className="text-xl font-bold text-[#1A1D2E]">{formatCurrency(wallet.balance)}</p>
                </div>

                {wallet.cardNumber && (
                  <p className="text-xs text-[#5A607F] mt-2">{wallet.cardNumber}</p>
                )}

                {wallet.isPrimary && (
                  <Badge variant="default" className="mt-2 bg-[#827BF2]">
                    Ví chính
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Wallet Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm ví mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                Tên ví <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="VD: VCB - Tài khoản chính"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <SelectField
              label="Loại ví"
              placeholder="Chọn loại ví"
              options={walletTypeOptions}
              selected={formData.type}
              onChangeSelected={(value) => setFormData({ ...formData, type: value as 'bank' | 'cash' | 'e-wallet' })}
            />
            <div>
              <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                Số dư ban đầu
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1A1D2E] mb-2 block">
                Màu sắc
              </label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.color === color
                        ? 'ring-2 ring-offset-2 ring-[#827BF2]'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAddDialog} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]" onClick={handleAddWallet} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Thêm ví'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Wallet Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa ví</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                Tên ví <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="VD: VCB - Tài khoản chính"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <SelectField
              label="Loại ví"
              placeholder="Chọn loại ví"
              options={walletTypeOptions}
              selected={formData.type}
              onChangeSelected={(value) => setFormData({ ...formData, type: value as 'bank' | 'cash' | 'e-wallet' })}
            />
            <div>
              <label className="text-sm font-medium text-[#1A1D2E] mb-2 block">
                Màu sắc
              </label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.color === color
                        ? 'ring-2 ring-offset-2 ring-[#827BF2]'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]" onClick={handleUpdateWallet} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Wallet Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa ví</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Bạn có chắc chắn muốn xóa ví <strong>{selectedWallet?.name}</strong> không?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setSelectedWallet(null); }} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteWallet} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
