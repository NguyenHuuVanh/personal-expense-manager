"use client";

import { cn } from "@/utils/cn";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/utils/format-number";
import { CategoryIcon } from "@/components/ui/category-icon";
import type { BudgetItem } from "@/hooks";

interface BudgetTrackerProps {
  data?: BudgetItem[];
  className?: string;
}

function getProgressColor(percent: number): string {
  if (percent <= 60) return "#10b981"; // Green
  if (percent <= 85) return "#f59e0b"; // Orange
  return "#ef4444"; // Red
}

function EmptyBudgetState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-violet-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h4 className="text-base font-semibold text-slate-700 mb-1">Chưa có ngân sách</h4>
      <p className="text-sm text-slate-400 max-w-[240px]">
        Bắt đầu tạo ngân sách để theo dõi chi tiêu của bạn
      </p>
      <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
        <Plus className="w-4 h-4" />
        Tạo ngân sách
      </button>
    </div>
  );
}

export function BudgetTracker({ data = [], className }: BudgetTrackerProps) {
  const totalBudget = data.reduce((sum, item) => sum + item.budgetAmount, 0);
  const totalSpent = data.reduce((sum, item) => sum + item.spentAmount, 0);
  const overallPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const hasData = data.length > 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 p-5 sm:p-6 shadow-sm border border-slate-100">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-100/30 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full blur-2xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
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
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Ngân sách tháng này
            </h3>
            <p className="text-xs text-slate-400">Theo dõi chi tiêu</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl text-xs sm:text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Thêm danh mục</span>
        </button>
      </div>

      {/* Content */}
      {!hasData ? (
        <EmptyBudgetState />
      ) : (
        <>
          {/* Overall Progress */}
          <div className="relative p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 mb-5 border border-slate-200/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm text-slate-500">Tổng tiến độ</span>
                <p className="text-lg font-bold text-slate-700">
                  {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
                </p>
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: getProgressColor(overallPercent) }}
              >
                {overallPercent}%
              </div>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(overallPercent, 100)}%`,
                  backgroundColor: getProgressColor(overallPercent),
                  boxShadow: `0 0 12px ${getProgressColor(overallPercent)}50`,
                }}
              />
            </div>
            {overallPercent > 100 && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Đã vượt ngân sách {formatCurrency(totalSpent - totalBudget)}
              </p>
            )}
          </div>

          {/* Budget Items */}
          <div className="space-y-3">
            {data.map((item) => {
              const percent =
                item.budgetAmount > 0
                  ? Math.round((item.spentAmount / item.budgetAmount) * 100)
                  : 0;
              const isOverBudget = item.isOverBudget || percent >= 100;

              return (
                <div
                  key={item._id}
                  className={cn(
                    "group p-3 sm:p-4 rounded-xl border transition-all duration-200",
                    isOverBudget
                      ? "border-red-200/50 bg-gradient-to-br from-red-50/50 to-rose-50/30"
                      : "border-slate-200/50 bg-white/80 hover:bg-white hover:shadow-sm hover:border-violet-200"
                  )}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${item.categoryId.color}15`,
                        }}
                      >
                        <CategoryIcon
                          iconId={item.categoryId.icon}
                          size={18}
                          className={cn("transition-transform group-hover:scale-110")}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {item.categoryId.name}
                      </span>
                      {isOverBudget && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium shrink-0">
                          Vượt
                        </span>
                      )}
                    </div>
                    <span
                      className="text-sm font-bold shrink-0 ml-2"
                      style={{ color: getProgressColor(percent) }}
                    >
                      {percent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2.5">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.min(percent, 100)}%`,
                        backgroundColor: isOverBudget
                          ? "#ef4444"
                          : item.categoryId.color,
                        boxShadow: `0 0 8px ${isOverBudget ? "#ef4444" : item.categoryId.color}50`,
                      }}
                    />
                  </div>

                  {/* Amount Row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {formatCurrency(item.spentAmount)} / {formatCurrency(item.budgetAmount)}
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        isOverBudget ? "text-red-500" : "text-emerald-500"
                      )}
                    >
                      {isOverBudget
                        ? `+${formatCurrency(item.spentAmount - item.budgetAmount)} vượt`
                        : `${formatCurrency(item.budgetAmount - item.spentAmount)} còn lại`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
