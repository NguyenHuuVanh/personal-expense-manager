export interface WalletSnapshotResponse {
  walletId: string;
  walletName: string;
  walletColor: string;
  walletType: string;
  monthKey: string;
  startBalance: number;
  totalIncome: number;
  totalExpense: number;
  endBalance: number;
  transactionCount: number;
  currency: string;
  isCurrentMonth: boolean;
}

export interface MonthlySnapshotSummary {
  monthKey: string;
  totalStartBalance: number;
  totalEndBalance: number;
  totalIncome: number;
  totalExpense: number;
  netChange: number;
  wallets: WalletSnapshotResponse[];
}
