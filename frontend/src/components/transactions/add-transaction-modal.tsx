'use client';

import { apiFetch } from '@/lib/api-client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogMain,
  DialogFooter,
} from '@/components/shadcn-ui/dialog';
import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';
import { Label } from '@/components/shadcn-ui/label';
import { Textarea } from '@/components/shadcn-ui/textarea';
import { useWallets } from '@/hooks/use-wallets';
import { useCategories } from '@/hooks/use-categories';
import { formatNumberVN, parseInputForSubmit, formatInputValue } from '@/utils/format-number';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import { DatePickerField } from '../custom-fields/date-picker-field';
import { SelectField } from '../custom-fields/select-field';

import type { AddTransactionModalProps } from '@/types/transaction';

export type { AddTransactionModalProps } from '@/types/transaction';

export function AddTransactionModal({ isOpen, onClose, onSuccess }: AddTransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { wallets, isLoading: isLoadingWallets } = useWallets();
  const { categories, isLoading: isLoadingCategories } = useCategories(type);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setType('expense');
      setAmount('');
      setDescription('');
      setCategoryId('');
      setWalletId('');
      setDate(new Date());
      setNote('');
      setErrors({});
    }
  }, [isOpen]);

  // Format categories to options for SelectField
  const categoryOptions = categories.map((cat) => ({ value: cat._id, label: cat.name }));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseInputForSubmit(amount) <= 0) {
      newErrors.amount = 'Vui lÃ²ng nháº­p sá»‘ tiá»n há»£p lá»‡';
    }
    if (!description.trim()) {
      newErrors.description = 'Vui lÃ²ng nháº­p mÃ´ táº£';
    }
    if (!categoryId) {
      newErrors.categoryId = 'Vui lÃ²ng chá»n danh má»¥c';
    }
    if (!walletId) {
      newErrors.walletId = 'Vui lÃ²ng chá»n vÃ­';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await apiFetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount: parseInputForSubmit(amount),
          description: description.trim(),
          categoryId,
          walletId,
          date: date.toISOString(),
          note: note.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'ÄÃ£ xáº£y ra lá»—i');
      }

      toast.success('ThÃªm giao dá»‹ch thÃ nh cÃ´ng');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ÄÃ£ xáº£y ra lá»—i');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg" isLoading={isSubmitting}>
        <DialogHeader>
          <DialogTitle>ThÃªm giao dá»‹ch má»›i</DialogTitle>
        </DialogHeader>

        <DialogMain className='hide-scrollbar-y'>
          <form id="add-transaction-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Transaction Type Toggle */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={cn(
                  'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                  type === 'expense'
                    ? 'bg-white text-[#E40127] shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Chi tiÃªu
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={cn(
                  'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                  type === 'income'
                    ? 'bg-white text-[#21AE5A] shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Thu nháº­p
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Sá»‘ tiá»n</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(formatInputValue(e.target.value))}
                  className={cn(
                    'pr-12 text-lg font-semibold text-right w-full outline-none text-[#5A607F] bg-[#F2F4F8] focus-visible:outline-[#827BF2] transition-all border-none',
                    type === 'expense' ? 'text-[#E40127]' : 'text-[#21AE5A]',
                    errors.amount && 'border-red-500'
                  )}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  VNÄ
                </span>
              </div>
              {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">MÃ´ táº£</Label>
              <Input
                id="description"
                placeholder="Nháº­p mÃ´ táº£ giao dá»‹ch"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(errors.description ? 'border-red-500' : '', 'w-full outline-none text-[#5A607F] bg-[#F2F4F8] focus-visible:outline-[#827BF2] transition-all border-none')}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Danh má»¥c</Label>
              {isLoadingCategories ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <SelectField
                  options={categoryOptions}
                  selected={categoryId}
                  onChangeSelected={setCategoryId}
                  placeholder="Chá»n danh má»¥c"
                />
              )}
              {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
            </div>

            {/* Wallet */}
            <div className="space-y-2">
              <Label>VÃ­</Label>
              <SelectField
                options={wallets.map((wallet) => ({ value: wallet._id, label: wallet.name }))}
                selected={walletId}
                onChangeSelected={setWalletId}
                placeholder={isLoadingWallets ? 'Äang táº£i...' : 'Chá»n vÃ­'}
                hiddenArrow={false}
              />
              {errors.walletId && <p className="text-xs text-red-500">{errors.walletId}</p>}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>NgÃ y</Label>
              <DatePickerField selected={date} onSelect={(d) => { const dateVal = d as Date | undefined; if (dateVal) setDate(dateVal); }} placeholder="Chá»n ngÃ y" size='lg' positionClassName='top-[-310px] left-0'/>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Ghi chÃº (tÃ¹y chá»n)</Label>
              <Textarea
                id="note"
                placeholder="ThÃªm ghi chÃº..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
              />
            </div>
          </form>
        </DialogMain>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Há»§y
          </Button>
          <Button
            form="add-transaction-form"
            type="submit"
            disabled={isSubmitting}
            className={cn(
              type === 'expense'
                ? 'bg-[#E40127] hover:bg-[#c90120]'
                : 'bg-[#21AE5A] hover:bg-[#1a9550]'
            )}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            ThÃªm giao dá»‹ch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
