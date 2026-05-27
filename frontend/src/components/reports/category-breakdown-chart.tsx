"use client";

import { useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { getIconById } from "@/data/icons";
import { formatCurrency } from "@/utils/format-number";
import { DonutChartSection } from "@/components/expense-dashboard/panels/sections/donut-chart-section";
import { CATEGORY_BREAKDOWN_CONFIG } from "@/constants/report";
import type { ReportCategory, CategoryBreakdownVariant } from "@/types/report";
import type { CategoryBreakdown } from "@/types/expense-dashboard";

interface CategoryBreakdownChartProps {
  variant: CategoryBreakdownVariant;
  categories: ReportCategory[];
  total: number;
  chartTitle: string;
  detailTitle: string;
}

export function CategoryBreakdownChart({
  variant,
  categories,
  total,
  chartTitle,
  detailTitle,
}: CategoryBreakdownChartProps) {
  const config = CATEGORY_BREAKDOWN_CONFIG[variant];

  // Map ReportCategory → CategoryBreakdown shape mà DonutChartSection cần
  const donutCategories = useMemo<CategoryBreakdown[]>(
    () =>
      categories.map((cat) => ({
        _id: cat._id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        total: cat.total,
      })),
    [categories]
  );

  const calculatePercentage = useCallback(
    (categoryTotal: number) => {
      if (total <= 0) return "0.0";
      return ((categoryTotal / total) * 100).toFixed(1);
    },
    [total]
  );

  const renderCategoryRow = useCallback(
    (category: ReportCategory) => {
      const percentage = calculatePercentage(category.total);
      const IconComp = getIconById(category.icon);

      return (
        <div key={category._id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <IconComp className="w-4 h-4" style={{ color: category.color }} />
            </div>
            <div>
              <p className="font-medium text-[#1A1D2E]">{category.name}</p>
              <p className="text-sm text-[#5A607F]">{percentage}%</p>
            </div>
          </div>
          <p className="font-semibold text-[#1A1D2E]">
            {formatCurrency(category.total)}
          </p>
        </div>
      );
    },
    [calculatePercentage]
  );

  const hasData = categories.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Donut chart — dùng component dùng chung từ expense dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>{chartTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <DonutChartSection categories={donutCategories} isLoading={false} />
        </CardContent>
      </Card>

      {/* Category list với icon */}
      <Card>
        <CardHeader>
          <CardTitle>{detailTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <div className="space-y-3">
              {categories.map(renderCategoryRow)}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#1A1D2E]">
                    {config.totalLabel}
                  </p>
                  <p
                    className="font-bold text-lg"
                    style={{ color: config.totalColor }}
                  >
                    {formatCurrency(total)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-[#5A607F]">
              {config.emptyMessage}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
