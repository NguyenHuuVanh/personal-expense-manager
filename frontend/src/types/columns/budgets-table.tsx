/**
 * Column Definitions - Budgets
 * Định nghĩa columns cho bảng ngân sách
 */

import { useState } from "react";
import type { Column } from "@/types/table";
import { formatCurrency } from "@/utils/format-number";
import { getIconById } from "@/data/icons";
import { Badge } from "@/components/shadcn-ui/badge";
import { Pencil, Trash2, Wallet, AlertTriangle, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn-ui/popover";
import type { BudgetItem } from "@/types/budget";

export interface BudgetRow {
  _id: string;
  categoryId: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
  budgetAmount: number;
  spentAmount: number;
  period: 'daily' | 'weekly' | 'monthly';
  isOverBudget?: boolean;
}

export interface BudgetColumnContext {
  onEdit?: (row: BudgetRow) => void;
  onDelete?: (row: BudgetRow) => void;
}

function formatPeriod(period: 'daily' | 'weekly' | 'monthly'): string {
  const labels = {
    daily: 'Ngày',
    weekly: 'Tuần',
    monthly: 'Tháng',
  };
  return labels[period] || period;
}

function calculatePercentage(spent: number, budget: number): number {
  if (budget <= 0) return 0;
  return Math.min(Math.round((spent / budget) * 100), 100);
}

function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 80) return 'bg-amber-500';
  return 'bg-emerald-500';
}

// ============================================================================
// ACTION CELL COMPONENT
// ============================================================================

interface BudgetRowActionsCellProps {
  row: BudgetRow;
  onEdit?: (row: BudgetRow) => void;
  onDelete?: (row: BudgetRow) => void;
}

function BudgetRowActionsCell({ row, onEdit, onDelete }: BudgetRowActionsCellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-md hover:bg-[#F2F4F8] transition-colors"
          title="Hành động"
        >
          <Settings className="w-4 h-4 text-[#5A607F]" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-32 p-1" sideOffset={4}>
        <div className="flex flex-col">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#5A607F] hover:bg-[#F8F9FB] rounded-md transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Sửa
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#E40127] hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function getBudgetTableColumns(context: BudgetColumnContext): Column<BudgetRow>[] {
  const { onEdit, onDelete } = context;

  return [
    {
      key: "icon",
      header: "",
      width: 50,
      render: (row) => {
        const IconComp = getIconById(row.categoryId.icon);
        return (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${row.categoryId.color}20` }}
          >
            <IconComp className="w-5 h-5" style={{ color: row.categoryId.color }} />
          </div>
        );
      },
    },
    {
      key: "name",
      header: "Danh mục",
      sortable: true,
      render: (row) => (
        <div>
          <div className="text-sm font-medium text-[#1A1D2E]">{row.categoryId.name}</div>
          {row.isOverBudget && (
            <div className="flex items-center gap-1 text-xs text-red-500">
              <AlertTriangle className="w-3 h-3" />
              <span>Vượt ngân sách</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "period",
      header: "Kỳ",
      width: 100,
      render: (row) => (
        <Badge variant="secondary">
          {formatPeriod(row.period)}
        </Badge>
      ),
    },
    {
      key: "budget",
      header: "Ngân sách",
      align: "right",
      sortable: true,
      width: 150,
      render: (row) => (
        <span className="text-sm font-semibold text-[#1A1D2E]">
          {formatCurrency(row.budgetAmount)}
        </span>
      ),
    },
    {
      key: "spent",
      header: "Đã chi",
      align: "right",
      sortable: true,
      width: 150,
      render: (row) => (
        <span className={`text-sm font-semibold ${row.isOverBudget ? 'text-red-500' : 'text-[#1A1D2E]'}`}>
          {formatCurrency(row.spentAmount)}
        </span>
      ),
    },
    {
      key: "remaining",
      header: "Còn lại",
      align: "right",
      width: 150,
      render: (row) => {
        const remaining = row.budgetAmount - row.spentAmount;
        const isNegative = remaining < 0;
        return (
          <span className={`text-sm font-semibold ${isNegative ? 'text-red-500' : 'text-emerald-500'}`}>
            {formatCurrency(Math.abs(remaining))}
            {isNegative && ' (thiếu)'}
          </span>
        );
      },
    },
    {
      key: "progress",
      header: "Tiến độ",
      width: 200,
      render: (row) => {
        const percentage = calculatePercentage(row.spentAmount, row.budgetAmount);
        const progressColor = getProgressColor(percentage);
        
        return (
          <div className="w-full max-w-[180px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#5A607F]">{percentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${progressColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Hành động",
      width: 60,
      align: "right",
      render: (row) => (
        <BudgetRowActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
