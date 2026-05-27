"use client";

import type { TrendChartProps } from "@/types/expense-dashboard";
import { formatCurrency } from "@/utils/format-number";
import { format, parseISO } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/utils/cn";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  currency?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  currency = "VND",
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const totalValue = payload.reduce((sum, entry) => sum + entry.value, 0);

  // Safe date formatting with validation
  let formattedDate = label;
  if (label) {
    try {
      const parsedDate = parseISO(label);
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = format(parsedDate, "EEEE, dd/MM/yyyy");
      }
    } catch {
      // Keep original label if parsing fails
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-100">
      <p className="text-xs font-medium text-gray-400 mb-2.5 pb-2 border-b border-gray-100">
        {formattedDate}
      </p>
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-500">
                {entry.dataKey === "income" ? "Thu nhập" : "Chi tiêu"}
              </span>
            </div>
            <span
              className={cn(
                "text-sm font-bold",
                entry.dataKey === "income" ? "text-emerald-500" : "text-pink-500"
              )}
            >
              {entry.dataKey === "income" ? "+" : "-"}
              {formatCurrency(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">Tổng cộng</span>
        <span className="text-sm font-bold text-slate-700">
          {formatCurrency(totalValue, currency)}
        </span>
      </div>
    </div>
  );
}

// Loading skeleton
function TrendChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100">
      <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-4" />
      <div className="h-[280px] bg-slate-100 rounded-xl animate-pulse" />
    </div>
  );
}

export function TrendChart({
  data,
  currency = "VND",
  isLoading,
}: TrendChartProps) {
  if (isLoading) {
    return <TrendChartSkeleton />;
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    ...item,
    date: item.date,
    dateLabel: format(parseISO(item.date), "dd/MM"),
  }));

  // Calculate totals for legend
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);

  const hasData = data.length > 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 p-5 sm:p-6 shadow-sm border border-slate-100">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-100/30 to-transparent rounded-full blur-2xl" />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-4 sm:mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
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
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                Xu hướng chi tiêu
              </h3>
              <p className="text-xs text-slate-400">Biến động theo thời gian</p>
            </div>
          </div>
        </div>

        {/* Summary badges */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-600 font-medium">
              Thu: {formatCurrency(totalIncome, currency)}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-200/50">
            <div className="w-2 h-2 rounded-full bg-pink-500" />
            <span className="text-xs text-pink-600 font-medium">
              Chi: {formatCurrency(totalExpense, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] sm:h-[320px] w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#34d399" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#f472b6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#fbcfe8" stopOpacity={0.02} />
                </linearGradient>
                <filter id="incomeAreaShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="4"
                    floodColor="#10b981"
                    floodOpacity="0.15"
                  />
                </filter>
                <filter id="expenseAreaShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="4"
                    floodColor="#ec4899"
                    floodOpacity="0.15"
                  />
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="dateLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }}
                dy={10}
                interval={Math.floor(chartData.length / 8)}
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
              />
              <Tooltip
                content={<CustomTooltip currency={currency} />}
                cursor={{
                  stroke: "#94a3b8",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="income"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#incomeGradient)"
                filter="url(#incomeAreaShadow)"
                animationDuration={1500}
                animationEasing="ease-out"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#10b981",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="expense"
                stroke="#ec4899"
                strokeWidth={2.5}
                fill="url(#expenseGradient)"
                filter="url(#expenseAreaShadow)"
                animationDuration={1500}
                animationBegin={200}
                animationEasing="ease-out"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#ec4899",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
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
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <p className="text-sm text-slate-400">Chưa có dữ liệu</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile summary */}
      {hasData && (
        <div className="sm:hidden flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500">
              Thu: {formatCurrency(totalIncome, currency)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-pink-500" />
            <span className="text-xs text-slate-500">
              Chi: {formatCurrency(totalExpense, currency)}
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      {hasData && (
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
            <span className="text-xs text-slate-500 font-medium">Thu nhập</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-pink-500" />
            <span className="text-xs text-slate-500 font-medium">Chi tiêu</span>
          </div>
        </div>
      )}
    </div>
  );
}
