'use client';

import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/shadcn-ui/button';
import { Badge } from '@/components/shadcn-ui/badge';
import { SelectField } from '@/components/custom-fields/select-field';
import { DatePickerField } from '@/components/custom-fields/date-picker-field';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, RefreshCw } from 'lucide-react';
import { KPICard } from './sections';
import { TrendChart, CategoryDonutChart, IncomeExpenseBarChart } from './charts';
import { RecentTransactions } from './sections';
import { useDashboardReport } from '@/hooks';
import { useCategories } from '@/hooks/use-categories';
import type { DashboardFilters } from '@/hooks/use-dashboard-report';
import type { PersonalExpenseDashboardProps } from '@/types/expense-dashboard';

// ============================================================================
// CONSTANTS
// ============================================================================

const FILTER_TAG_CLASSES = {
  container: 'flex items-center gap-1 p-1 bg-[#F2F4F8] rounded-lg',
  buttonBase:
    'px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap',
  buttonActive: 'bg-white text-[#1A1D2E] shadow-sm',
  buttonInactive: 'text-[#5A607F] hover:text-[#1A1D2E] bg-transparent hover:bg-transparent',
} as const;

const FILTER_BADGE_CLASSES =
  'text-xs px-2 py-1 h-6 bg-[#827BF2]/10 text-[#827BF2] border border-[#827BF2]/20 gap-1';

// ============================================================================
// TYPES
// ============================================================================

// ============================================================================
// HELPER COMPONENTS (đặt đầu file - trước component chính)
// ============================================================================

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl border p-5 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
          <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
    <div className="h-[350px] bg-gray-100 rounded-xl animate-pulse" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" />
      <div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" />
    </div>
  </div>
);

interface QuickFilterTagsProps {
  selectedTag: string;
  onTagChange: (tag: string) => void;
  tagOptions: Array<{ value: string; label: string }>;
}

const QuickFilterTags = ({ selectedTag, onTagChange, tagOptions }: QuickFilterTagsProps) => (
  <div className={FILTER_TAG_CLASSES.container}>
    {tagOptions.map((tag) => (
      <Button
        key={tag.value}
        onClick={() => onTagChange(tag.value)}
        className={cn(
          FILTER_TAG_CLASSES.buttonBase,
          selectedTag === tag.value
            ? FILTER_TAG_CLASSES.buttonActive
            : FILTER_TAG_CLASSES.buttonInactive
        )}
        variant="ghost"
      >
        {tag.label}
      </Button>
    ))}
  </div>
);

interface ActiveFilterBadgesProps {
  selectedCategory: string;
  selectedTag: string;
  categoryOptions: Array<{ value: string; label: string }>;
  tagOptions: Array<{ value: string; label: string }>;
  onClearCategory: () => void;
  onClearTag: () => void;
  onClearAll: () => void;
}

const ActiveFilterBadges = ({
  selectedCategory,
  selectedTag,
  categoryOptions,
  tagOptions,
  onClearCategory,
  onClearTag,
  onClearAll,
}: ActiveFilterBadgesProps) => {
  if (!selectedCategory && selectedTag === 'all') return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-sm text-[#5A607F]">Bộ lọc đang áp dụng:</span>
      {selectedCategory && (
        <Badge variant="secondary" className={FILTER_BADGE_CLASSES}>
          {categoryOptions.find((c) => c.value === selectedCategory)?.label}
          <button className="ml-1 hover:text-[#E40127]" onClick={onClearCategory}>
            ×
          </button>
        </Badge>
      )}
      {selectedTag !== 'all' && (
        <Badge variant="secondary" className={FILTER_BADGE_CLASSES}>
          {tagOptions.find((t) => t.value === selectedTag)?.label}
          <button className="ml-1 hover:text-[#E40127]" onClick={onClearTag}>
            ×
          </button>
        </Badge>
      )}
      <button className="text-xs text-[#E40127] hover:underline" onClick={onClearAll}>
        Xóa tất cả
      </button>
    </div>
  );
};

interface FilterBarProps {
  selectedPeriod: string;
  selectedCategory: string;
  selectedTag: string;
  dateRange: { from?: Date; to?: Date } | null;
  categoryOptions: Array<{ value: string; label: string }>;
  tagOptions: Array<{ value: string; label: string }>;
  onPeriodChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onTagChange: (v: string) => void;
  onDateRangeChange: (range: { from?: Date; to?: Date } | null) => void;
  onRefresh: () => void;
  onClearCategory: () => void;
  onClearTag: () => void;
  onClearAll: () => void;
}

const FilterBar = ({
  selectedPeriod,
  selectedCategory,
  selectedTag,
  dateRange,
  categoryOptions,
  tagOptions,
  onPeriodChange,
  onCategoryChange,
  onTagChange,
  onDateRangeChange,
  onRefresh,
  onClearCategory,
  onClearTag,
  onClearAll,
}: FilterBarProps) => (
  <div className="bg-white rounded-xl border p-3 sm:p-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      {/* Left: Period + Category */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <SelectField
          placeholder="Kỳ"
          options={tagOptions.slice(0, 5)}
          selected={selectedPeriod}
          onChangeSelected={onPeriodChange}
          classWapper="mb-0 w-36 sm:w-40"
        />
        <DatePickerField
          mode="range"
          selectedForm={dateRange?.from}
          selectedTo={dateRange?.to}
          onSelect={(range) => onDateRangeChange((range as { from?: Date; to?: Date }) || null)}
          placeholder="Khoảng ngày"
          classWapper="mb-0"
        />
        <SelectField
          placeholder="Danh mục"
          options={categoryOptions}
          selected={selectedCategory}
          onChangeSelected={onCategoryChange}
          classWapper="mb-0 w-40 sm:w-48"
        />
      </div>

      {/* Right: Filter Tags + Refresh */}
      <div className="flex items-center gap-2 sm:gap-3">
        <QuickFilterTags
          selectedTag={selectedTag}
          onTagChange={onTagChange}
          tagOptions={tagOptions}
        />
        <Button variant="outline" size="icon" onClick={onRefresh} className="h-9 w-9">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>

    <ActiveFilterBadges
      selectedCategory={selectedCategory}
      selectedTag={selectedTag}
      categoryOptions={categoryOptions}
      tagOptions={tagOptions}
      onClearCategory={onClearCategory}
      onClearTag={onClearTag}
      onClearAll={onClearAll}
    />
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PersonalExpenseDashboard({
  currency = 'VND',
  onTransactionClick,
  onCategoryClick,
  showTrendChart = true,
  showCategoryChart = true,
  showIncomeExpenseChart = true,
  showRecentTransactions = true,
  className,
}: PersonalExpenseDashboardProps) {
  const PERIOD_OPTIONS = [
    { value: 'thisWeek', label: 'Tuần này' },
    { value: 'thisMonth', label: 'Tháng này' },
    { value: 'thisQuarter', label: 'Quý này' },
    { value: 'thisYear', label: 'Năm nay' },
  ];

  const FILTER_TAG_OPTIONS = [
    { value: 'all', label: 'Tất cả' },
    { value: 'income', label: 'Thu nhập' },
    { value: 'expense', label: 'Chi tiêu' },
  ];

  // State
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | null>(null);
  const [selectedTag, setSelectedTag] = useState('all');

  // API
  const { data, isLoading, error, fetchReport } = useDashboardReport({
    dateRange,
    categoryId: selectedCategory || undefined,
    type: (selectedTag === 'all' ? 'all' : selectedTag) as 'income' | 'expense' | 'all',
  });

  const { categories } = useCategories();

  // Derived state
  const categoryOptions = useMemo(
    () => [{ value: '', label: 'Tất cả danh mục' }, ...categories.map((cat) => ({ value: cat._id, label: cat.name }))],
    [categories]
  );

  const incomeTrend = data?.summary.incomeTrend ?? 0;
  const expenseTrend = data?.summary.expenseTrend ?? 0;
  const balanceTrend = data?.summary.balanceTrend ?? 0;
  const transactionTrend = useMemo(() => {
    if (!data?.quickStats?.transactionCount) return 0;
    return (((data.summary.incomeCount ?? 0) + (data.summary.expenseCount ?? 0)) / data.quickStats.transactionCount) * 100 - 100;
  }, [data]);

  // Handlers
  const handleClearCategory = useCallback(() => setSelectedCategory(''), []);
  const handleClearTag = useCallback(() => setSelectedTag('all'), []);
  const handleClearAll = useCallback(() => {
    setSelectedCategory('');
    setSelectedTag('all');
  }, []);

  // Loading / Error states
  if (isLoading || !data) return <DashboardSkeleton />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-[#E40127] mb-4">{error}</p>
        <Button onClick={() => fetchReport()}>Thử lại</Button>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={cn('space-y-6', className)}>
      <FilterBar
        selectedPeriod={selectedPeriod}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        dateRange={dateRange}
        categoryOptions={categoryOptions}
        tagOptions={FILTER_TAG_OPTIONS}
        onPeriodChange={setSelectedPeriod}
        onCategoryChange={setSelectedCategory}
        onTagChange={setSelectedTag}
        onDateRangeChange={setDateRange}
        onRefresh={fetchReport}
        onClearCategory={handleClearCategory}
        onClearTag={handleClearTag}
        onClearAll={handleClearAll}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Tổng thu" value={data.summary.totalIncome} icon={<TrendingUp className="w-5 h-5" />} trend={incomeTrend} format="currency" color="green" />
        <KPICard label="Tổng chi" value={data.summary.totalExpense} icon={<TrendingDown className="w-5 h-5" />} trend={expenseTrend} format="currency" color="red" />
        <KPICard
          label="Số dư"
          value={data.summary.netBalance ?? 0}
          icon={<DollarSign className="w-5 h-5" />}
          trend={balanceTrend}
          format="currency"
          color={(data.summary.netBalance ?? 0) >= 0 ? 'green' : 'red'}
        />
        <KPICard
          label="Số giao dịch"
          value={(data.summary.incomeCount ?? 0) + (data.summary.expenseCount ?? 0)}
          icon={<CreditCard className="w-5 h-5" />}
          trend={transactionTrend}
          format="number"
          color="blue"
        />
      </div>

      {/* Trend Chart - Full Width */}
      {showTrendChart && <TrendChart data={data.dailyTrend || []} currency={currency} />}

      {/* Bottom Section: Charts + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-6">
          {showCategoryChart && (
            <CategoryDonutChart data={data.categoryBreakdown} currency={currency} onCategoryClick={onCategoryClick} />
          )}
        </div>
        <div className="space-y-6">
          {showIncomeExpenseChart && (
            <IncomeExpenseBarChart data={data.dailyTrend || []} />
          )}
        </div>
      </div>

      {/* Recent Transactions - Full Width */}
      {showRecentTransactions && (
        <RecentTransactions
          data={data.recentTransactions}
          currency={currency}
          maxItems={5}
          onTransactionClick={onTransactionClick}
        />
      )}
    </div>
  );
}
