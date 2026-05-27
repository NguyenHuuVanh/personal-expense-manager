import { BarChart3 } from "lucide-react";
import { SelectField } from "@/components/custom-fields/select-field";
import type { ChartHeaderProps } from "@/types/income-expense-bar-chart";

const ChartHeader = ({ labels, subOptions, subPeriod, onSubPeriodChange }: ChartHeaderProps) => (
  <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-2">
      
      <div>
        <h3 className="text-base font-semibold text-gray-900">Thu nhập &amp; Chi tiêu</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {labels.length > 0 && (
            <span>
              {labels[0]?.label} - {labels[labels.length - 1]?.label}
            </span>
          )}
        </p>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-3 w-4 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-500" />
        <span className="text-gray-600">Thu nhập</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-4 rounded-sm bg-gradient-to-b from-pink-400 to-pink-500" />
        <span className="text-gray-600">Chi tiêu</span>
      </div>
      <SelectField
        placeholder="Chọn kỳ"
        options={subOptions}
        selected={subPeriod}
        onChangeSelected={onSubPeriodChange}
        classWapper="mb-0 min-w-[100px]"
        searchable={false}
      />
    </div>
  </div>
);

export { ChartHeader };
