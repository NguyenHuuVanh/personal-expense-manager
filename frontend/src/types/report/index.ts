export interface ReportCategory {
  _id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  count?: number;
  avgAmount?: number;
}

export interface ReportTransactionCategory {
  _id?: string;
  name: string;
  icon: string;
  color: string;
}

export interface ReportTransactionWallet {
  _id: string;
  name: string;
  color: string;
}

export interface ReportTransaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  description?: string;
  date: string;
  categoryId: ReportTransactionCategory | null;
  walletId?: ReportTransactionWallet | null;
}

export type CategoryBreakdownVariant = 'expense' | 'income';
