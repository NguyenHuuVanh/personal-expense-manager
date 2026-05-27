'use client';

import type { CategoryDonutChartProps } from "@/types/expense-dashboard";
import { formatCurrency } from "@/utils/format-number";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { CategoryIcon } from "@/components/ui/category-icon";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      color: string;
      percent: number;
    };
  }>;
  currency?: string;
}

function CustomTooltip({ active, payload, currency = "VND" }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full ring-2 ring-offset-1"
          style={{ backgroundColor: data?.color }}
        />
        <span className="text-sm font-semibold text-gray-700">{data?.name}</span>
      </div>
      <div className="space-y-1">
        <p className="text-lg font-bold" style={{ color: data?.color }}>
          {formatCurrency(data?.value, currency)}
        </p>
        <p className="text-xs text-gray-400">
          {(data?.percent * 100).toFixed(1)}% tổng chi tiêu
        </p>
      </div>
    </div>
  );
}

// Loading skeleton
function CategoryDonutSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-4" />
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-[180px] h-[180px] bg-slate-100 rounded-full animate-pulse" />
        <div className="flex-1 w-full space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 flex-1 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryDonutChart({
  data,
  currency = "VND",
  isLoading,
  onCategoryClick,
}: CategoryDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  if (isLoading) {
    return <CategoryDonutSkeleton />;
  }

  const total = data.reduce((sum, item) => sum + item.total, 0);

  const chartData = data.map((item) => ({
    ...item,
    percent: total > 0 ? item.total / total : 0,
  }));

  const handleMouseEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(undefined);
  };

  const activeItem = activeIndex !== undefined ? chartData[activeIndex] : null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 p-5 sm:p-6 shadow-sm border border-slate-100">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100/30 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-100/30 to-transparent rounded-full blur-2xl" />

      {/* Header */}
      <div className="relative flex items-center gap-2 mb-4 sm:mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
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
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Chi tiêu theo danh mục
          </h3>
          <p className="text-xs text-slate-400">Phân bổ chi tiêu</p>
        </div>
      </div>

      <div className="relative flex flex-col lg:flex-row items-center gap-5 sm:gap-6">
        {/* Donut Chart */}
        <div className="relative w-[200px] h-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                dataKey="total"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(_, index) => onCategoryClick?.(data[index])}
                animationDuration={1000}
                animationEasing="ease-out"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    strokeWidth={0}
                    className={cn(
                      "transition-all duration-300 cursor-pointer",
                      activeIndex === index ? "scale-110" : "hover:scale-105"
                    )}
                    style={{
                      filter:
                        activeIndex === index
                          ? `drop-shadow(0 4px 12px ${entry.color}40)`
                          : "none",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip currency={currency} />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {activeItem ? (
              <>
                <span className="text-xs text-slate-400 mb-1">
                  {activeItem.name}
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: activeItem.color }}
                >
                  {(activeItem.percent * 100).toFixed(0)}%
                </span>
              </>
            ) : (
              <>
                <span className="text-xs text-slate-400 mb-1">Tổng chi</span>
                <span className="text-lg font-bold text-slate-700">
                  {formatCurrency(total, currency)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {chartData.map((item, index) => (
            <div
              key={item._id}
              className={cn(
                "group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer",
                "hover:bg-white/80 hover:shadow-sm",
                activeIndex === index &&
                  "bg-white/80 shadow-sm ring-2 ring-violet-500/20"
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
              onClick={() => onCategoryClick?.(item)}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-lg shrink-0 transition-transform duration-200",
                  activeIndex === index ? "scale-110" : "group-hover:scale-105"
                )}
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 2px 8px ${item.color}40`,
                }}
              />
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <CategoryIcon iconId={item.icon} size={18} />
                <span
                  className={cn(
                    "text-sm font-medium truncate transition-colors",
                    activeIndex === index ? "text-slate-800" : "text-slate-600"
                  )}
                >
                  {item.name}
                </span>
              </div>
              <div className="text-right shrink-0">
                <div
                  className={cn(
                    "text-sm font-bold transition-colors",
                    activeIndex === index ? "text-slate-800" : "text-slate-700"
                  )}
                >
                  {formatCurrency(item.total, currency)}
                </div>
                <div className="text-xs text-slate-400">
                  {(item.percent * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
