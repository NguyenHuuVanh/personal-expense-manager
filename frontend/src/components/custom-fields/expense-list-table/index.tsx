"use client";

import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-number";
import { CategoryIcon } from "@/components/ui/category-icon";

export interface ExpenseItem {
  _id: string;
  name: string;
  icon: string;
  total: number;
  color: string;
  percentage?: number;
}

export interface ExpenseListTableProps {
  data: ExpenseItem[];
  className?: string;
  showProgressBar?: boolean;
  maxItems?: number;
  size?: "sm" | "md" | "lg";
}

export function ExpenseListTable({
  data,
  className,
  showProgressBar = true,
  maxItems,
  size = "md",
}: ExpenseListTableProps) {
  const totalAmount = data.reduce((sum, item) => sum + item.total, 0);
  const displayData = maxItems ? data.slice(0, maxItems) : data;

  const sizeStyles = {
    sm: {
      row: "py-1.5 px-2",
      icon: "w-6 h-6 text-xs",
      name: "text-[10px]",
      amount: "text-[10px]",
      progress: "h-1",
      badge: "text-[9px] px-1 py-0 h-3",
    },
    md: {
      row: "py-2 px-3",
      icon: "w-8 h-8 text-sm",
      name: "text-xs",
      amount: "text-xs",
      progress: "h-1.5",
      badge: "text-[10px] px-1.5 py-0 h-4",
    },
    lg: {
      row: "py-2.5 px-4",
      icon: "w-10 h-10 text-base",
      name: "text-sm",
      amount: "text-sm",
      progress: "h-2",
      badge: "text-xs px-2 py-0.5 h-5",
    },
  };

  const styles = sizeStyles[size];

  return (
    <div className={cn("w-full", className)}>
      {/* Table Header */}
      <div
        className={cn(
          "flex items-center border-b border-[#ECEEF5] bg-[#F8F9FC]",
          styles.row
        )}
      >
        <div className="flex-1 flex items-center gap-2">
          <span className="text-[10px] font-medium text-[#9EA3B8] uppercase tracking-wide">
            Danh mục
          </span>
        </div>
        <div className="w-20 text-right">
          <span className="text-[10px] font-medium text-[#9EA3B8] uppercase tracking-wide">
            Chi tiêu
          </span>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#F2F4F8]">
        {displayData.map((item) => {
          const percentage = Math.round((item.total / totalAmount) * 100);
          const progressWidth = Math.min(percentage, 100);

          return (
            <div
              key={item._id}
              className={cn(
                "flex items-center hover:bg-[#FAFBFC] transition-colors cursor-pointer group",
                styles.row
              )}
            >
              {/* Category Info */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                {/* Icon */}
                <div
                  className={cn(
                    "rounded-lg flex items-center justify-center shrink-0",
                    styles.icon
                  )}
                  style={{ backgroundColor: item.color }}
                >
                  <CategoryIcon iconId={item.icon} size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} style={{ color: 'white' }} />
                </div>

                {/* Name & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={cn(
                        "font-medium text-[#1A1D2E] truncate",
                        styles.name
                      )}
                    >
                      {item.name}
                    </span>
                    <span
                      className={cn(
                        "font-semibold text-[#1A1D2E] shrink-0 ml-2",
                        styles.amount
                      )}
                    >
                      {formatCurrency(item.total)}
                    </span>
                  </div>

                  {showProgressBar && (
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex-1 bg-[#F2F4F8] rounded-full overflow-hidden",
                          styles.progress
                        )}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progressWidth}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-medium shrink-0",
                          styles.badge
                        )}
                        style={{ color: item.color }}
                      >
                        {percentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Footer - Total */}
      {maxItems && data.length > maxItems && (
        <div
          className={cn(
            "flex items-center justify-between bg-[#F8F9FC] border-t border-[#ECEEF5]",
            styles.row
          )}
        >
          <span className="text-[10px] font-medium text-[#5A607F]">
            +{data.length - maxItems} danh mục khác
          </span>
          <span className="text-[10px] font-medium text-[#5A607F]">
            {formatCurrency(
              data.slice(maxItems).reduce((sum, item) => sum + item.total, 0)
            )}
          </span>
        </div>
      )}
    </div>
  );
}
