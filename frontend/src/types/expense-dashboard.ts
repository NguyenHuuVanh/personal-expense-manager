// Expense Dashboard Types - API response structure

/** KPI Summary - tổng hợp thông tin chính */
export type ExpenseKPISummary = {
  totalIncome: number;
  totalExpense: number;
  incomeCount?: number;
  expenseCount?: number;
  netBalance?: number;
  incomeTrend?: number;
  expenseTrend?: number;
  balanceTrend?: number;
  totalBalance?: number;
  savingsRate?: number;
  monthKey?: string;
  period?: string;
  dateRange?: {
    start: string;
    end: string;
  };
};

export type DashboardSummary = ExpenseKPISummary;

/** Quick Stats - thống kê nhanh */
export type QuickStats = {
  transactionCount?: number;
  incomeCount?: number;
  expenseCount?: number;
  categoryCount?: number;
  walletCount?: number;
  budgetCount?: number;
  overBudgetCount?: number;
};

/** Budget Summary - tổng hợp ngân sách */
export type BudgetSummary = {
  totalBudgetAmount: number;
  totalBudgetSpent: number;
  totalBudgetRemaining: number;
  percentUsed: number;
};

/** Date Range */
export interface DateRange {
  from?: Date;
  to?: Date;
}

/** Category Breakdown - chi tiêu theo danh mục */
export type CategoryBreakdown = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
};

/** Top Category - danh mục top với count và avg */
export type TopCategory = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  count: number;
  avgAmount?: number;
};

/** Recent Transaction */
export type RecentTransaction = {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  currency?: string;
  categoryId: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
  description?: string;
  date: string | Date;
  walletId?: {
    _id: string;
    name: string;
    color: string;
  } | null;
};

/** Budget Item - chi tiết ngân sách */
export type BudgetItem = {
  _id: string;
  categoryId?: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount?: number;
  percentUsed?: number;
  period?: 'daily' | 'weekly' | 'monthly';
  isOverBudget?: boolean;
};

/** Full Dashboard Response - response đầy đủ từ API */
export type ExpenseDashboardData = {
  summary: DashboardSummary;
  quickStats: QuickStats;
  budgetSummary?: BudgetSummary;
  recentTransactions: RecentTransaction[];
  categoryBreakdown: CategoryBreakdown[];
  topExpenses?: TopCategory[];
  topIncomes?: TopCategory[];
  budgets?: BudgetItem[];
  dailyTrend?: Array<{ date: string; income: number; expense: number }>;
};

export type DashboardReport = ExpenseDashboardData;

/** Wallet */
export type Wallet = {
  _id: string;
  name: string;
  type: 'bank' | 'cash' | 'e-wallet';
  balance: number;
  currency: string;
  cardNumber?: string;
  isPrimary?: boolean;
  isLowBalance?: boolean;
  color: string;
};

/** Saving Goal */
export type SavingGoal = {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  isCompleted?: boolean;
  completedAt?: string;
};

/** Category - Full category data */
export type Category = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/** KPI Card Variant Colors */
export type KPICardColor = 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'cyan' | 'pink';

/** KPI Card Props */
export type KPICardProps = {
  label: string;
  value?: number;
  icon: React.ReactNode;
  trend?: number | undefined;
  format?: 'currency' | 'number' | 'percent';
  color?: KPICardColor;
  isLoading?: boolean;
  sparklineData?: number[];
};

/** Category Donut Chart Props */
export type CategoryDonutChartProps = {
  data: CategoryBreakdown[];
  currency?: string;
  isLoading?: boolean;
  onCategoryClick?: (category: CategoryBreakdown) => void;
};

/** Income Expense Bar Chart Props */
export type IncomeExpenseBarChartProps = {
  data: Array<{ date: string; income: number; expense: number }>;
  currency?: string;
  isLoading?: boolean;
  totalIncome?: number;
  totalExpense?: number;
  mainPeriod?: "thisMonth" | "thisWeek" | "thisQuarter" | "thisYear" | "custom";
};

/** Trend Chart Props */
export type TrendChartProps = {
  data: Array<{ date: string; income: number; expense: number }>;
  currency?: string;
  isLoading?: boolean;
};

/** Recent Transactions Props */
export type RecentTransactionsProps = {
  data: RecentTransaction[];
  currency?: string;
  maxItems?: number;
  isLoading?: boolean;
  onTransactionClick?: (transaction: RecentTransaction) => void;
};

/** Main Dashboard Props */
export type PersonalExpenseDashboardProps = {
  apiUrl?: string;
  currency?: string;
  dateRange?: { from: Date; to: Date } | null;
  onTransactionClick?: (transaction: RecentTransaction) => void;
  onCategoryClick?: (category: CategoryBreakdown) => void;
  onRefresh?: () => void;
  showTrendChart?: boolean;
  showCategoryChart?: boolean;
  showIncomeExpenseChart?: boolean;
  showRecentTransactions?: boolean;
  className?: string;
};
