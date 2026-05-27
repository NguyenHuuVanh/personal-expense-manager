import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-number";
import type { CustomTooltipProps } from "@/types/income-expense-bar-chart";

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-100">
      <p className="text-xs text-gray-400 mb-2 font-medium">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-500">
            {entry.name}:{" "}
            <span
              className={cn(
                "font-semibold",
                entry.dataKey === "income" ? "text-emerald-500" : "text-pink-500"
              )}
            >
              {entry.dataKey === "income" ? "+" : "-"}
              {formatCurrency(Math.abs(entry.value))}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export { CustomTooltip };
