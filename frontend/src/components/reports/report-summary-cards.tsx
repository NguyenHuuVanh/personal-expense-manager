"use client";

import { Card, CardContent } from "@/components/shadcn-ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/utils/format-number";
import { REPORT_SUMMARY_CONFIG } from "@/constants/report";
import type { CategoryBreakdownVariant } from "@/types/report";

interface ReportSummaryCardsProps {
  variant: CategoryBreakdownVariant;
  totalAmount: number;
  transactionCount: number;
}

export function ReportSummaryCards({
  variant,
  totalAmount,
  transactionCount,
}: ReportSummaryCardsProps) {
  const config = REPORT_SUMMARY_CONFIG[variant];
  const TotalIcon = variant === "income" ? DollarSign : TrendingDown;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Total amount card */}
      <Card className={config.totalCardBg}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: config.iconBgColor }}
            >
              <TotalIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#5A607F]">{config.totalLabel}</p>
              <p
                className="text-2xl font-bold whitespace-nowrap"
                style={{ color: config.totalColor }}
              >
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction count card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#827BF2]/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#827BF2]" />
            </div>
            <div>
              <p className="text-sm text-[#5A607F]">{config.countLabel}</p>
              <p className="text-2xl font-bold text-[#1A1D2E]">
                {transactionCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
