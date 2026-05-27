import type { MainPeriod, SubPeriod } from "@/constants/charts";

// ============================================================================
// Chart Data Types
// ============================================================================
export interface WeeklyDataItem {
  _id?: { week?: number; year?: number } | number | string;
  week?: string;
  _week?: number;
  _year?: number;
  income: number;
  expense: number;
  day?: string;
  month?: string;
  quarter?: string;
  date?: string;
}

export interface ChartDataItem {
  label: string;
  startDate: Date;
  endDate: Date;
}

// ============================================================================
// Component Props
// ============================================================================
export interface IncomeExpenseBarChartProps {
  data?: WeeklyDataItem[];
  totalIncome?: number;
  totalExpense?: number;
  className?: string;
  mainPeriod?: MainPeriod;
  onSubPeriodChange?: (subPeriod: SubPeriod) => void;
}

// ============================================================================
// Sub-Components Props
// ============================================================================
export interface ChartHeaderProps {
  labels: ChartDataItem[];
  subOptions: readonly { value: string; label: string }[];
  subPeriod: SubPeriod;
  onSubPeriodChange: (value: string) => void;
}

export interface ChartBodyProps {
  transformedData: WeeklyDataItem[];
  isLoading: boolean;
  hasData: boolean;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
}

// ============================================================================
// Hooks Types
// ============================================================================
export interface UseChartDataProps {
  dateRange: { from: Date | null; to: Date | null };
  subPeriod: SubPeriod;
  mainPeriod: MainPeriod;
  propData: WeeklyDataItem[];
  onSubPeriodChange?: (subPeriod: SubPeriod) => void;
}

export interface UseChartDataReturn {
  chartData: WeeklyDataItem[];
  isLoading: boolean;
  transformedData: WeeklyDataItem[];
  labels: ChartDataItem[];
  hasData: boolean;
  handleSubPeriodChange: (value: string) => void;
}
