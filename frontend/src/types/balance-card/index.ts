export interface BalanceCardProps {
  className?: string;
  totalIncome?: number;
  totalExpense?: number;
  netBalance?: number;
  incomeTrend?: number;
  expenseTrend?: number;
  balanceTrend?: number;
}

export interface QuickLinksProps {
  className?: string;
}

export interface QuickLink {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
}
