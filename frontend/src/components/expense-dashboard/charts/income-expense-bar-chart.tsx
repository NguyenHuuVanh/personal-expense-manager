"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/utils/cn";
import { ChartHeader, ChartBody } from "./components";
import { CHART_PERIOD_OPTIONS } from "@/constants/charts";
import { useDateRange } from "@/contexts/date-range-context";
import { generateLabels, aggregateDataByLabels, formatLocalDate } from "@/utils/income-expense-bar-chart";
import { apiClient } from "@/lib/api-client";
import type { SubPeriod } from "@/constants/charts";
import type { WeeklyDataItem, IncomeExpenseBarChartProps } from "@/types/income-expense-bar-chart";

interface ChartResponse {
  data: WeeklyDataItem[];
}

export function IncomeExpenseBarChart({
  data: propData = [],
  className,
  mainPeriod = "thisMonth",
  onSubPeriodChange,
}: IncomeExpenseBarChartProps) {
  const [subPeriod, setSubPeriod] = useState<SubPeriod>("day");
  const [chartData, setChartData] = useState<WeeklyDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { dateRange } = useDateRange();
  const subOptions = CHART_PERIOD_OPTIONS.sub[mainPeriod] || [{ value: "day", label: "Ngày" }];

  useEffect(() => {
    setSubPeriod(subOptions[0].value as SubPeriod);
  }, [mainPeriod, subOptions]);

  const fetchChartData = useCallback(async () => {
    if (!dateRange.from || !dateRange.to) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("startDate", formatLocalDate(dateRange.from));
      params.set("endDate", formatLocalDate(dateRange.to));
      params.set("subPeriod", subPeriod);

      const result = await apiClient.get<ChartResponse>(`/charts/income-expense?${params.toString()}`);
      setChartData(result.data || propData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartData(propData);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, subPeriod, propData]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const handleSubPeriodChange = useCallback(
    (value: string) => {
      const newPeriod = value as SubPeriod;
      setSubPeriod(newPeriod);
      onSubPeriodChange?.(newPeriod);
    },
    [onSubPeriodChange]
  );

  const { labels: generatedLabels, transformedData } = useMemo(() => {
    if (!dateRange.from || !dateRange.to) {
      return { labels: [], transformedData: [] };
    }

    const labels = generateLabels(dateRange.from, dateRange.to, subPeriod, mainPeriod);
    const aggregated = aggregateDataByLabels(
      chartData.length > 0 ? chartData : propData,
      labels,
      subPeriod
    );

    return { labels, transformedData: aggregated };
  }, [dateRange, subPeriod, mainPeriod, chartData, propData]);

  const hasData = transformedData.some((d) => Math.abs(d.income) > 0 || Math.abs(d.expense) > 0);

  return (
    <div className={cn("rounded-xl border border-gray-100 bg-white p-6 shadow-sm", className)}>
      <ChartHeader
        labels={generatedLabels}
        subOptions={subOptions}
        subPeriod={subPeriod}
        onSubPeriodChange={handleSubPeriodChange}
      />

      <div className="h-[300px] w-full">
        <ChartBody
          transformedData={transformedData}
          isLoading={isLoading}
          hasData={hasData}
        />
      </div>
    </div>
  );
}
