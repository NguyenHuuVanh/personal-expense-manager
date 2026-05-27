"use client";

import type { ReportFilter } from "@/types/email-report";
import { vi } from "date-fns/locale/vi";
import { Filter as FilterIcon, RefreshCw } from "lucide-react";
import { DatePickerInline } from "@/components/ui/date-picker-inline";
import { Button } from "@/components/shadcn-ui/button";
import { PERIOD_OPTIONS } from "@/types/email-report";
import { cn } from "@/utils/cn";

type ReportFiltersProps = {
  filters: ReportFilter;
  onUpdateFilters: (filters: Partial<ReportFilter>) => void;
  onApplyFilters: () => void;
  loading?: boolean;
};

export function ReportFilters({
  filters,
  onUpdateFilters,
  onApplyFilters,
  loading = false,
}: ReportFiltersProps) {
  /** Parse 'YYYY-MM-DD' thành Date local (không bị lệch timezone như new Date('YYYY-MM-DD')). */
  const parseLocalDate = (dateStr: string | null): Date | undefined => {
    if (!dateStr) {
      return undefined;
    }
    const parts = dateStr.split("-").map(Number);
    const y = parts[0] ?? 0;
    const m = parts[1] ?? 1;
    const d = parts[2] ?? 1;
    return new Date(y, m - 1, d);
  };

  const handlePeriodChange = (period: ReportFilter["period"]) => {
    if (period === "custom") {
      // Mặc định: hôm nay đến hôm nay
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      onUpdateFilters({ period, start_date: todayStr, end_date: todayStr });
    } else {
      onUpdateFilters({ period });
    }
  };

  const handleDateChange = (
    field: "start_date" | "end_date",
    date: Date | undefined,
  ) => {
    if (!date) {
      onUpdateFilters({ period: "custom", [field]: "" });
      return;
    }
    // Format date local thành 'YYYY-MM-DD' (không dùng toISOString vì nó convert sang UTC)
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    onUpdateFilters({
      period: "custom",
      [field]: `${yyyy}-${mm}-${dd}`,
    });
  };

  return (
    <div className="bg-background rounded-lg border p-4 sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Period Quick Select */}
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Kỳ báo cáo:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <Button
              type="button"
              key={option.value}
              variant={filters.period === option.value ? "default" : "outline"}
              size="sm"
              onClick={() =>
                handlePeriodChange(option.value as ReportFilter["period"])
              }
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Custom Date Range */}
        {filters.period === "custom" && (
          <div className="flex items-center gap-2 ml-0 sm:ml-4">
            <DatePickerInline
              selected={parseLocalDate(filters.start_date)}
              onSelect={(date: Date | undefined) =>
                handleDateChange("start_date", date)
              }
              placeholder="Ngày bắt đầu"
              classNameTrigger="h-9 text-sm"
            />
            <span className="text-muted-foreground">-</span>
            <DatePickerInline
              selected={parseLocalDate(filters.end_date)}
              onSelect={(date: Date | undefined) =>
                handleDateChange("end_date", date)
              }
              placeholder="Ngày kết thúc"
              classNameTrigger="h-9 text-sm"
            />
          </div>
        )}

        {/* Apply / Refresh Button */}
        <div className="flex-1 flex justify-end">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onApplyFilters}
            disabled={loading}
          >
            <RefreshCw
              className={cn(`h-4 w-4 mr-2`, loading && "animate-spin")}
            />
            {loading ? "Đang tải..." : "Làm mới"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReportFilters;
