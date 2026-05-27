"use client";

import { formatCurrency } from "@/utils/format-number";
import type { DonutTooltipProps } from "@/types/right-panel";

function DonutTooltip({ active, payload, total = 1 }: DonutTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0];
  const percentage = ((data.value / total) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-lg border shadow-lg p-2.5 z-50 relative">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
        <span className="text-xs font-medium text-[#1A1D2E]">{data.name}</span>
      </div>
      <div className="mt-1">
        <span className="text-sm font-semibold text-[#1A1D2E]">{formatCurrency(data.value)}</span>
        <span className="text-xs text-[#9EA3B8] ml-1">({percentage}%)</span>
      </div>
    </div>
  );
}

export { DonutTooltip };
