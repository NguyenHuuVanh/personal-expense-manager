// Re-export shared types
export type { CategoryOption, CategoryFormData, CategoryWithTotal } from '@/types/category';
export type { WalletOption } from '@/types/wallet-option';

export type TransactionType = 'income' | 'expense';

export interface TransactionFormData {
  walletId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  note?: string;
}

export interface TransactionFormDialogProps {
  trigger: React.ReactNode;
  initialData?: {
    _id?: string;
    walletId: string;
    categoryId: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: string;
    note?: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
