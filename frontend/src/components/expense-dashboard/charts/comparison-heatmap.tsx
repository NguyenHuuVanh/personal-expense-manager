"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/utils/format-number";
import { SelectField } from "@/components/custom-fields/select-field";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  eachDayOfInterval,
  eachWeekOfInterval,
  addDays,
  format,
  getMonth,
  getQuarter,
  getYear,
} from "date-fns";
import { CHART_PERIOD_OPTIONS, type MainPeriod, type SubPeriod } from "@/constants/charts";
import { useDateRange } from "@/contexts/date-range-context";
import { apiClient } from "@/lib/api-client";

// =====================
// Comparison Chart: Category Comparison
// =====================
interface ComparisonDataItem {
  name: string;
  thisMonth: number;
  lastMonth: number;
}

interface ComparisonChartProps {
  data?: ComparisonDataItem[];
  className?: string;
}

// =====================
// Daily Expense Chart with Sub-filter
// =====================
interface DailyChartProps {
  data?: DailyChartData[];
  className?: string;
  mainPeriod?: MainPeriod;
  onSubPeriodChange?: (subPeriod: SubPeriod) => void;
}

interface DailyChartData {
  date: string;
  income: number;
  expense: number;
}

interface DailyTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

interface ChartResponse {
  data: DailyChartData[];
}

function DailyTooltip({ active, payload, label }: DailyTooltipProps) {
  if (!active || !payload || payload.length === 0 || !label) return null;

  const income = payload.find((p) => p.name === "Thu nhập");
  const expense = payload.find((p) => p.name === "Chi tiêu");

  const formattedDate = new Date(label).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
  });

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-100">
      <p className="text-xs text-gray-400 mb-2 font-medium">{formattedDate}</p>
      {income && (
        <div className="flex items-center justify-between gap-6 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-500">Thu nhập</span>
          </div>
          <span className="text-sm font-bold text-emerald-600">
            +{formatCurrency(income.value)}
          </span>
        </div>
      )}
      {expense && (
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            <span className="text-xs text-gray-500">Chi tiêu</span>
          </div>
          <span className="text-sm font-bold text-violet-600">
            -{formatCurrency(expense.value)}
          </span>
        </div>
      )}
    </div>
  );
}

// Generate labels based on dateRange and subPeriod
function generateDailyLabels(
  startDate: Date,
  endDate: Date,
  subPeriod: SubPeriod
): { label: string; date: Date }[] {
  const labels: { label: string; date: Date }[] = [];

  switch (subPeriod) {
    case "day": {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      days.forEach((day) => {
        labels.push({
          label: format(day, "dd/MM"),
          date: day,
        });
      });
      break;
    }
    case "week": {
      const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });
      weeks.forEach((weekStart) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        const effectiveEnd = weekEnd > endDate ? endDate : weekEnd;
        labels.push({
          label: `${format(weekStart, "dd/MM")} - ${format(effectiveEnd, "dd/MM")}`,
          date: weekStart,
        });
      });
      break;
    }
    case "month": {
      let current = startOfMonth(startDate);
      const last = endOfMonth(endDate);

      while (current <= last) {
        const monthNum = getMonth(current) + 1;
        labels.push({
          label: `T${monthNum}`,
          date: current,
        });
        current = addDays(endOfMonth(current), 1);
        current = startOfMonth(current);
      }
      break;
    }
    case "quarter": {
      let year = getYear(startDate);
      const endYear = getYear(endDate);

      while (year <= endYear) {
        for (let q = 1; q <= 4; q++) {
          const qStart = startOfQuarter(new Date(year, (q - 1) * 3, 1));
          const qEnd = endOfQuarter(new Date(year, (q - 1) * 3, 1));

          if (qStart <= endDate && qEnd >= startDate) {
            labels.push({
              label: `Q${q}`,
              date: qStart,
            });
          }
        }
        year++;
      }
      break;
    }
  }

  return labels;
}

function aggregateDailyData(
  apiData: { date?: string; day?: string; income: number; expense: number }[],
  labels: { label: string; date: Date }[],
  subPeriod: SubPeriod
) {
  if (!apiData || apiData.length === 0) {
    return labels.map((l) => ({
      label: l.label,
      income: 0,
      expense: 0,
    }));
  }

  return labels.map((labelItem) => {
    const match = apiData.find((d) => {
      const dataDateStr = d.date || d.day;
      if (!dataDateStr) return false;

      const dataDate = new Date(dataDateStr);
      const localDateStr = `${dataDate.getFullYear()}-${String(dataDate.getMonth() + 1).padStart(2, "0")}-${String(dataDate.getDate()).padStart(2, "0")}`;
      const labelDateStr = `${labelItem.date.getFullYear()}-${String(labelItem.date.getMonth() + 1).padStart(2, "0")}-${String(labelItem.date.getDate()).padStart(2, "0")}`;

      if (subPeriod === "day") {
        return localDateStr === labelDateStr;
      }

      switch (subPeriod) {
        case "week": {
          const weekStart = startOfWeek(labelItem.date, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(labelItem.date, { weekStartsOn: 1 });
          const localDate = new Date(localDateStr);
          return localDate >= weekStart && localDate <= weekEnd;
        }
        case "month":
          return (
            dataDate.getMonth() === labelItem.date.getMonth() &&
            dataDate.getFullYear() === labelItem.date.getFullYear()
          );
        case "quarter":
          return (
            getQuarter(dataDate) === getQuarter(labelItem.date) &&
            dataDate.getFullYear() === labelItem.date.getFullYear()
          );
        default:
          return localDateStr === labelDateStr;
      }
    });

    return {
      label: labelItem.label,
      income: match?.income || 0,
      expense: match?.expense || 0,
    };
  });
}

export function DailyExpenseChart({
  data: propData = [],
  className,
  mainPeriod = "thisMonth",
  onSubPeriodChange,
}: DailyChartProps) {
  const [subPeriod, setSubPeriod] = useState<SubPeriod>("day");
  const [chartData, setChartData] = useState<DailyChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { dateRange } = useDateRange();

  const subOptions = CHART_PERIOD_OPTIONS.sub[mainPeriod] || [
    { value: "day", label: "Ngày" },
  ];

  useEffect(() => {
    setSubPeriod(subOptions[0].value as SubPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainPeriod]);

  const fetchData = async () => {
    if (!dateRange.from || !dateRange.to) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      const startYear = dateRange.from.getFullYear();
      const startMonth = String(dateRange.from.getMonth() + 1).padStart(2, "0");
      const startDay = String(dateRange.from.getDate()).padStart(2, "0");
      params.set("startDate", `${startYear}-${startMonth}-${startDay}`);

      const endYear = dateRange.to.getFullYear();
      const endMonth = String(dateRange.to.getMonth() + 1).padStart(2, "0");
      const endDay = String(dateRange.to.getDate()).padStart(2, "0");
      params.set("endDate", `${endYear}-${endMonth}-${endDay}`);

      params.set("subPeriod", subPeriod);

      const result = await apiClient.get<ChartResponse>(`/charts/income-expense?${params.toString()}`);
      setChartData(result.data || []);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subPeriod, dateRange, mainPeriod]);

  const handleSubPeriodChange = (value: string) => {
    setSubPeriod(value as SubPeriod);
    onSubPeriodChange?.(value as SubPeriod);
  };

  const { labels, transformedData } = useMemo(() => {
    if (!dateRange.from || !dateRange.to) {
      return { labels: [], transformedData: [] };
    }

    const generatedLabels = generateDailyLabels(
      dateRange.from,
      dateRange.to,
      subPeriod
    );

    const aggregated = aggregateDailyData(
      chartData.length > 0 ? chartData : (propData as DailyChartData[]),
      generatedLabels,
      subPeriod
    );

    return {
      labels: generatedLabels,
      transformedData: aggregated,
    };
  }, [dateRange, subPeriod, chartData, propData]);

  const hasData = transformedData.length > 0 && transformedData.some((d) => d.income > 0 || d.expense > 0);
  const maxAmount = Math.max(
    ...transformedData.map((d) => Math.max(d.income, d.expense)),
    1
  );

  const displayRange = labels.length > 0
    ? `${labels[0]?.label} - ${labels[labels.length - 1]?.label}`
    : "";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 p-5 sm:p-6 shadow-sm border border-slate-100">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-100/30 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-full blur-2xl" />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-5 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg
                className="w-4.5 h-4.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Chi tiêu &amp; Thu nhập
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">{displayRange}</p>
        </div>

        {/* Sub-period filter */}
        <SelectField
          placeholder="Chọn kỳ"
          options={subOptions}
          selected={subPeriod}
          onChangeSelected={handleSubPeriodChange}
          classWapper="mb-0 min-w-[120px]"
          searchable={false}
        />
      </div>

      {/* Chart */}
      <div className="h-[220px] sm:h-[260px] w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : hasData || transformedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={transformedData}
              margin={{ top: 10, right: 5, left: 0, bottom: 0 }}
              barCategoryGap="35%"
              barGap={8}
            >
              <defs>
                <linearGradient id="dailyIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="dailyExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }}
                dy={10}
                interval="preserveStartEnd"
                minTickGap={5}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value;
                }}
                width={45}
                domain={[0, maxAmount * 1.1]}
              />
              <Tooltip
                content={<DailyTooltip />}
                cursor={{ fill: "#f1f5f9", radius: 8 }}
              />
              <Bar
                dataKey="income"
                name="Thu nhập"
                fill="url(#dailyIncomeGradient)"
                radius={[6, 6, 0, 0]}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="expense"
                name="Chi tiêu"
                fill="url(#dailyExpenseGradient)"
                radius={[6, 6, 0, 0]}
                animationDuration={1200}
                animationBegin={200}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-slate-400">Chưa có dữ liệu</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {hasData && (
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
            <span className="text-xs text-slate-500 font-medium">Thu nhập</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-violet-400 to-violet-500" />
            <span className="text-xs text-slate-500 font-medium">Chi tiêu</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Backwards compatibility exports
export function ComparisonChart(props: ComparisonChartProps) {
  return <DailyExpenseChart {...props} data={props.data as unknown as DailyChartData[]} />;
}

export function Heatmap(props: ComparisonChartProps) {
  return <DailyExpenseChart {...props} data={props.data as unknown as DailyChartData[]} />;
}
