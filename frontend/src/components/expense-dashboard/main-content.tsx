"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/utils/cn";
import { IncomeExpenseBarChart } from "./charts/income-expense-bar-chart";
import { TransactionsTable } from "./sections";
import { MetricCardsGrid } from "@/components/dashboard/metric-cards-grid";
import { DatePickerField } from "@/components/custom-fields/date-picker-field";
import { Button } from "@/components/shadcn-ui/button";
import { RefreshCw } from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from "date-fns";
import { useDashboardReport } from "@/hooks";
import { useDateRange } from "@/contexts/date-range-context";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  PiggyBank,
  Receipt,
  Target,
} from "lucide-react";
import type { DashboardSummary } from "@/hooks";
import type { MainPeriod } from "@/constants/charts";

// ============================================================================
// CONSTANTS
// ============================================================================

type PeriodValue = MainPeriod | "custom";

const PRESET_OPTIONS: { value: PeriodValue; label: string }[] = [
  { value: "thisWeek", label: "Tuần này" },
  { value: "thisMonth", label: "Tháng này" },
  { value: "thisQuarter", label: "Quý này" },
  { value: "custom", label: "Tùy chỉnh" },
];

const PERIOD_BUTTON_CLASSES = {
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs",
  active: "bg-primary text-primary-foreground shadow hover:bg-primary-hover",
} as const;

const DATE_PICKER_CLASSES = {
  wrapper: "mb-0 w-36",
  button: "h-8 text-xs",
  size: "lg" as const,
};

// ============================================================================
// TYPES
// ============================================================================

interface MainContentProps {
  className?: string;
}

interface MetricCardItem {
  label: string;
  value: string;
  icon: typeof Wallet;
  color: "blue" | "green" | "red" | "cyan" | "purple" | "pink" | "orange";
  trend?: { value: number; label: string } | undefined;
}

// ============================================================================
// UTILITY FUNCTIONS (đặt TRƯỚC component)
// ============================================================================

const getDateRangeFromPreset = (preset: PeriodValue): { from: Date; to: Date } | null => {
  const now = new Date();
  switch (preset) {
    case "thisWeek":
      return { from: startOfWeek(now), to: endOfWeek(now) };
    case "thisMonth":
      return { from: startOfMonth(now), to: endOfMonth(now) };
    case "thisQuarter":
      return { from: startOfQuarter(now), to: endOfQuarter(now) };
    case "thisYear":
      return { from: startOfYear(now), to: endOfYear(now) };
    default:
      return null;
  }
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface PeriodButtonProps {
  value: PeriodValue;
  label: string;
  isActive: boolean;
  onClick: (value: PeriodValue) => void;
}

const PeriodButton = ({ value, label, isActive, onClick }: PeriodButtonProps) => (
  <button
    type="button"
    onClick={() => onClick(value)}
    className={cn(PERIOD_BUTTON_CLASSES.base, isActive && PERIOD_BUTTON_CLASSES.active)}
  >
    {label}
  </button>
);

interface FiltersBarProps {
  selectedPeriod: PeriodValue;
  showDatePickers: boolean;
  localDateFrom?: Date;
  localDateTo?: Date;
  onPeriodChange: (value: PeriodValue) => void;
  onDateFromChange: (from: Date | undefined | { from?: Date; to?: Date }) => void;
  onDateToChange: (to: Date | undefined | { from?: Date; to?: Date }) => void;
  onReset: () => void;
}

const FiltersBar = ({
  selectedPeriod,
  showDatePickers,
  localDateFrom,
  localDateTo,
  onPeriodChange,
  onDateFromChange,
  onDateToChange,
  onReset,
}: FiltersBarProps) => (
  <div className="z-10 space-y-4 rounded-lg border bg-white p-4">
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center justify-between">
      {/* Period Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {PRESET_OPTIONS.map((option) => (
          <PeriodButton
            key={option.value}
            value={option.value}
            label={option.label}
            isActive={selectedPeriod === option.value}
            onClick={onPeriodChange}
          />
        ))}
      </div>

      {/* Date Pickers & Reset */}
      <div className="flex flex-1 items-center gap-2">
        {showDatePickers && (
          <>
            <DatePickerField
              variant="simple"
              mode="single"
              selected={localDateFrom}
              onSelect={onDateFromChange}
              placeholder="Từ ngày"
              classWapper={DATE_PICKER_CLASSES.wrapper}
              buttonClassName={DATE_PICKER_CLASSES.button}
              size={DATE_PICKER_CLASSES.size}
            />
            <DatePickerField
              variant="simple"
              mode="single"
              selected={localDateTo}
              onSelect={onDateToChange}
              placeholder="Đến ngày"
              classWapper={DATE_PICKER_CLASSES.wrapper}
              buttonClassName={DATE_PICKER_CLASSES.button}
              size={DATE_PICKER_CLASSES.size}
            />
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="h-8 px-3 text-xs"
      >
        <RefreshCw className="w-4 h-4 mr-1" />
        Làm mới
      </Button>
    </div>
  </div>
);

// ============================================================================
// BUILD METRIC ITEMS
// ============================================================================

const buildMetricItems = (summary: DashboardSummary | undefined, categoryCount: number): MetricCardItem[] => {
  if (!summary) return [];

  return [
    // Row 1: 4 cards
    {
      label: "Tổng số dư",
      value: `${(summary.totalBalance ?? 0).toLocaleString("vi-VN")}đ`,
      icon: Wallet,
      color: "blue",
      trend: undefined,
    },
    {
      label: "Tổng thu",
      value: `${summary.totalIncome.toLocaleString("vi-VN")}đ`,
      icon: TrendingUp,
      color: "green",
      trend: { value: summary.incomeTrend ?? 0, label: "vs tháng trước" },
    },
    {
      label: "Tổng chi",
      value: `${summary.totalExpense.toLocaleString("vi-VN")}đ`,
      icon: TrendingDown,
      color: "red",
      trend: { value: summary.expenseTrend ?? 0, label: "vs tháng trước" },
    },
    {
      label: "Số dư tháng",
      value: `${(summary.netBalance ?? 0).toLocaleString("vi-VN")}đ`,
      icon: DollarSign,
      color: (summary.netBalance ?? 0) >= 0 ? "cyan" : "red",
      trend: { value: summary.balanceTrend ?? 0, label: "vs tháng trước" },
    },
    // Row 2: 4 cards
    {
      label: "Số giao dịch",
      value: String((summary.incomeCount ?? 0) + (summary.expenseCount ?? 0)),
      icon: CreditCard,
      color: "purple",
      trend: undefined,
    },
    {
      label: "Thu nhập",
      value: String(summary.incomeCount),
      icon: PiggyBank,
      color: "green",
      trend: undefined,
    },
    {
      label: "Chi tiêu",
      value: String(summary.expenseCount),
      icon: Receipt,
      color: "pink",
      trend: undefined,
    },
    {
      label: "Danh mục",
      value: String(categoryCount),
      icon: Target,
      color: "orange",
      trend: undefined,
    },
  ];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MainContent({ className }: MainContentProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodValue>("thisMonth");
  const [localDateFrom, setLocalDateFrom] = useState<Date | undefined>();
  const [localDateTo, setLocalDateTo] = useState<Date | undefined>();
  const [showDatePickers, setShowDatePickers] = useState(false);

  // Context
  const { dateRange, setDateRange } = useDateRange();

  // API data
  const { data, isLoading } = useDashboardReport({ dateRange });
  const summary: DashboardSummary | undefined = data?.summary;

  // Derived state
  const metricItems = useMemo(
    () => buildMetricItems(summary, data?.quickStats?.categoryCount || 0),
    [summary, data?.quickStats?.categoryCount]
  );

  // Initialize dateRange on mount
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) {
      const range = getDateRangeFromPreset("thisMonth");
      if (range) {
        setDateRange(range);
      }
    }
  }, [dateRange.from, dateRange.to, setDateRange]);

  // Handlers
  const handlePeriodChange = useCallback((period: PeriodValue) => {
    setSelectedPeriod(period);
    if (period === "custom") {
      setShowDatePickers(true);
    } else {
      setShowDatePickers(false);
      setLocalDateFrom(undefined);
      setLocalDateTo(undefined);
      const range = getDateRangeFromPreset(period);
      if (range) {
        setDateRange(range);
      }
    }
  }, [setDateRange]);

  const handleDateChange = useCallback((from: Date | undefined, to: Date | undefined) => {
    setLocalDateFrom(from);
    setLocalDateTo(to);
  }, []);

  const handleDateToChange = useCallback((to: Date | undefined) => {
    setLocalDateTo(to);
    if (to) {
      setDateRange({ from: localDateFrom, to });
    }
  }, [localDateFrom, setDateRange]);

  const handleReset = useCallback(() => {
    setSelectedPeriod("thisMonth");
    setLocalDateFrom(undefined);
    setLocalDateTo(undefined);
    setShowDatePickers(false);
    const range = getDateRangeFromPreset("thisMonth");
    if (range) {
      setDateRange(range);
    }
  }, [setDateRange]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={cn("space-y-4", className)}>
      <FiltersBar
        selectedPeriod={selectedPeriod}
        showDatePickers={showDatePickers}
        localDateFrom={localDateFrom}
        localDateTo={localDateTo}
        onPeriodChange={handlePeriodChange}
        onDateFromChange={(date) => setLocalDateFrom((date as { from?: Date })?.from || undefined)}
        onDateToChange={(date) => handleDateToChange((date as { from?: Date })?.from)}
        onReset={handleReset}
      />

      {/* Metric Cards - Row 1 (4 cards) */}
      <MetricCardsGrid
        metricCardsItems={metricItems.slice(0, 4)}
        loading={isLoading}
        columns={4}
      />

      {/* Metric Cards - Row 2 (4 cards) */}
      <MetricCardsGrid
        metricCardsItems={metricItems.slice(4, 8)}
        loading={isLoading}
        columns={4}
      />

      {/* Income/Expense Bar Chart */}
      <IncomeExpenseBarChart
        totalIncome={summary?.totalIncome}
        totalExpense={summary?.totalExpense}
        mainPeriod={selectedPeriod === "custom" ? "thisMonth" : selectedPeriod}
        data={[]}
      />

      <TransactionsTable />
    </div>
  );
}
