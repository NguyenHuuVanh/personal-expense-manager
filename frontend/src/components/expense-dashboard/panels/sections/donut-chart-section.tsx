"use client";

import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DONUT_CHART, PIE_COLORS } from "@/constants/right-panel";
import type { DonutChartSectionProps } from "@/types/right-panel";

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number; color: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white z-[1000] rounded-xl shadow-xl border p-3 pointer-events-none">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
        <span className="text-xs font-medium text-gray-600">{data.name}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-base font-bold text-gray-900">
          {data.value > 999999
            ? `${(data.value / 1000000).toFixed(1)}M`
            : data.value.toLocaleString("vi-VN")}
        </span>
      </div>
    </div>
  );
};

function DonutChartSection({ categories, isLoading }: DonutChartSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const safeCategories = categories ?? [];
  const total = safeCategories.reduce((sum, cat) => sum + cat.total, 0) ?? 0;
  const isEmpty = total === 0;

  const pieData = safeCategories.map((cat, i) => ({
    name: cat.name,
    value: cat.total,
    color: cat.color ?? PIE_COLORS[i % PIE_COLORS.length],
  }));

  const handlePieEnter = useCallback((_data: unknown, index: number) => {
    setActiveIndex(index);
  }, []);

  const handlePieLeave = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

  const getCellStyle = useCallback(
    (index: number) => {
      const isActive = activeIndex === index;
      const entry = pieData[index];
      return {
        filter: isActive
          ? `drop-shadow(0 0 8px ${entry?.color ?? "#ccc"}60) brightness(1.05)`
          : "none",
        transform: isActive ? `scale(1.04)` : "scale(1)",
        transformOrigin: "center",
        transition: "filter 0.25s ease, transform 0.25s ease",
        cursor: "pointer",
      };
    },
    [activeIndex, pieData]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[220px]">
        <Loader2 className="w-6 h-6 animate-spin text-[#827BF2]" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-[220px] text-center">
        <span className="text-xs text-[#9EA3B8]">Chưa có dữ liệu chi tiêu</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Donut Chart */}
      <div className="relative w-[220px] h-[220px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {pieData.map((entry, index) => (
                <linearGradient
                  key={`grad-${index}`}
                  id={`pieGrad-${index}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={DONUT_CHART.INNER_RADIUS}
              outerRadius={DONUT_CHART.OUTER_RADIUS}
              dataKey="value"
              nameKey="name"
              onMouseEnter={handlePieEnter}
              onMouseLeave={handlePieLeave}
              strokeWidth={DONUT_CHART.STROKE_WIDTH}
              stroke="#fff"
              cornerRadius={DONUT_CHART.CORNER_RADIUS}
              paddingAngle={DONUT_CHART.PADDING_ANGLE}
              isAnimationActive={!isEmpty}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#pieGrad-${index})`}
                  style={getCellStyle(index)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center total text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-200"
             style={{ opacity: activeIndex !== undefined ? 0 : 1 }}>
          <span className="text-2xl font-bold text-gray-900">
            {total > 999999
              ? `${(total / 1000000).toFixed(1)}M`
              : total.toLocaleString("vi-VN")}
          </span>
          <span className="text-xs text-gray-500 font-medium">Tổng</span>
        </div>
      </div>

      {/* Legend with progress bars */}
      <div className="flex-1 space-y-2.5 w-full">
        {pieData.map((row, i) => {
          const percent = total > 0 ? (row.value / total) * 100 : 0;
          const isActive = activeIndex === i;

          return (
            <div
              key={row.name}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gray-50 shadow-sm scale-[1.02]"
                  : "hover:bg-gray-50/50"
              }`}
              onMouseEnter={() => handlePieEnter(undefined, i)}
              onMouseLeave={() => handlePieLeave()}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: row.color,
                  outline: isActive
                    ? `2px solid ${row.color}`
                    : "2px solid transparent",
                  outlineOffset: "1px",
                  boxShadow: isActive ? `0 0 8px ${row.color}40` : "none",
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium truncate ${
                      isActive ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {row.name}
                  </span>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <span className="text-sm font-semibold text-gray-900 tabular-nums">
                      {row.value > 999999
                        ? `${(row.value / 1000000).toFixed(1)}M`
                        : row.value.toLocaleString("vi-VN")}
                    </span>
                    <span className="text-xs font-medium text-gray-500 w-12 text-right tabular-nums">
                      {percent.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(percent, 1)}%`,
                      backgroundColor: row.color,
                      opacity: isActive ? 1 : 0.6,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { DonutChartSection };
