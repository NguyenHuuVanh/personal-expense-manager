import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./custom-tooltip";
import { CHART_HEIGHT, BAR_CHART, BAR_COLORS, AXIS_STYLE, CURSOR_FILL, CURSOR_RADIUS } from "@/constants/income-expense-bar-chart";
import type { ChartBodyProps } from "@/types/income-expense-bar-chart";

const YAxisTickFormatter = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
};

function ChartBody({ transformedData, isLoading, hasData }: ChartBodyProps) {
  if (isLoading) {
    return <div className="h-[300px] animate-pulse rounded-lg bg-gray-100" />;
  }

  if (!hasData || transformedData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={transformedData}
        margin={BAR_CHART.MARGIN}
        barCategoryGap={BAR_CHART.CATEGORY_GAP}
        barGap={BAR_CHART.GAP}
      >
        <defs>
          <linearGradient id="barIncomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BAR_COLORS.INCOME.FROM} stopOpacity={1} />
            <stop offset="100%" stopColor={BAR_COLORS.INCOME.TO} stopOpacity={0.85} />
          </linearGradient>
          <linearGradient id="barExpenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BAR_COLORS.EXPENSE.FROM} stopOpacity={1} />
            <stop offset="100%" stopColor={BAR_COLORS.EXPENSE.TO} stopOpacity={0.85} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={AXIS_STYLE.GRID_STROKE} />
        <XAxis
          dataKey="week"
          tick={{ fontSize: AXIS_STYLE.TICK_FONT_SIZE, fill: AXIS_STYLE.TICK_FILL }}
          tickLine={false}
          axisLine={{ stroke: AXIS_STYLE.LINE_STROKE }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: AXIS_STYLE.TICK_FONT_SIZE, fill: AXIS_STYLE.TICK_FILL }}
          tickLine={false}
          axisLine={false}
          tickFormatter={YAxisTickFormatter}
          width={AXIS_STYLE.Y_AXIS_WIDTH}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: CURSOR_FILL, fillOpacity: 0.35, radius: CURSOR_RADIUS }}
        />
        <Bar
          dataKey="income"
          name="Thu nhập"
          fill="url(#barIncomeGradient)"
          radius={BAR_CHART.RADIUS}
          maxBarSize={BAR_CHART.MAX_SIZE}
          animationDuration={BAR_CHART.ANIMATION_DURATION}
          animationEasing="ease-out"
        />
        <Bar
          dataKey="expense"
          name="Chi tiêu"
          fill="url(#barExpenseGradient)"
          radius={BAR_CHART.RADIUS}
          maxBarSize={BAR_CHART.MAX_SIZE}
          animationDuration={BAR_CHART.ANIMATION_DURATION}
          animationBegin={BAR_CHART.ANIMATION_BEGIN}
          animationEasing="ease-out"
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export { ChartBody };
