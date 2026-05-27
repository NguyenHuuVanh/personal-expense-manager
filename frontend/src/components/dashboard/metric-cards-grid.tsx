"use client";

import React from "react";
import { cn } from "@/utils/cn";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  PiggyBank,
  Receipt,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  PiggyBank,
  Receipt,
};

type MetricCardItem = {
  label: string;
  value: string | number;
  icon?: LucideIcon | React.ReactNode;
  iconName?: string;
  color?: "blue" | "purple" | "orange" | "green" | "red" | "yellow" | "cyan" | "pink";
  trend?: {
    value: number;
    label: string;
  };
};

type MetricCardsGridProps = {
  metricCardsItems: MetricCardItem[];
  loading?: boolean;
  columns?: 2 | 3 | 4 | 5;
};

const colorGradients = {
  blue: "from-blue-600 to-blue-400",
  purple: "from-purple-600 to-purple-400",
  orange: "from-orange-600 to-orange-400",
  green: "from-green-600 to-green-400",
  red: "from-red-600 to-red-400",
  yellow: "from-yellow-600 to-yellow-400",
  cyan: "from-cyan-600 to-cyan-400",
  pink: "from-pink-600 to-pink-400",
} as const;

type ColorType = keyof typeof colorGradients;

export function MetricCardsGrid({
  metricCardsItems,
  loading,
  columns = 4,
}: MetricCardsGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2 gap-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2",
  };

  if (loading) {
    return (
      <div className={cn("grid", gridCols[columns])}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl gap-2 bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", gridCols[columns])}>
      {metricCardsItems.map((item, index) => {
        const colorKey = (item.color ||
          Object.keys(colorGradients)[index % Object.keys(colorGradients).length]) as ColorType;
        const gradient = colorGradients[colorKey] || colorGradients.blue;
        return (
          <div
            key={index}
            className={cn(
              "rounded-xl bg-gradient-to-br p-4 text-white shadow-lg flex flex-col",
              gradient,
            )}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white opacity-90">{item.label}</div>
              {(item.icon || item.iconName) && (
                <div className="opacity-80">
                  {item.icon ? (
                    <>{React.createElement(item.icon as LucideIcon, { className: "w-5 h-5" })}</>
                  ) : item.iconName && iconMap[item.iconName] ? (
                    React.createElement(iconMap[item.iconName], { className: "w-5 h-5" })
                  ) : null}
                </div>
              )}
            </div>
            <div className="mt-2 text-lg sm:text-xl font-bold truncate">{item.value}</div>
            {item.trend ? (
              <div
                className={cn(
                  "mt-auto pt-2 text-xs",
                  item.trend.value > 0 ? "text-green-200" : "text-red-200",
                )}
              >
                {item.trend.value > 0 ? "+" : ""}
                {item.trend.value}% {item.trend.label}
              </div>
            ) : (
              <div className="mt-auto pt-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}
