/**
 * Column Definitions - Expense Dashboard
 * Định nghĩa columns cho các bảng trong Expense Dashboard
 */

import { useState } from "react";
import type { Column } from "@/types/table";
import { formatCurrency } from "@/utils/format-number";
import type { CategoryBreakdown } from "@/hooks";
import type { Wallet } from "@/hooks";
import type { SavingGoal } from "@/hooks";
import type { BudgetItem } from "@/hooks";
import type { Category } from "@/hooks";
import { getIconById } from "@/data/icons";
import { Badge } from "@/components/shadcn-ui/badge";
import { Pencil, Trash2, Settings, Eye, Settings2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn-ui/popover";

// ============================================================================
// ACTION CELL COMPONENTS
// ============================================================================

// Category Actions Cell
interface CategoryActionsCellProps {
  row: CategoryBreakdown;
  onViewDetail?: (row: CategoryBreakdown) => void;
  onAdjustBudget?: (row: CategoryBreakdown) => void;
}

function CategoryActionsCell({ row, onViewDetail, onAdjustBudget }: CategoryActionsCellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-[#F2F4F8] transition-colors"
          title="Hành động"
        >
          <Settings className="w-3.5 h-3.5 text-[#5A607F]" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-1" sideOffset={4}>
        <div className="flex flex-col">
          {onViewDetail && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(row);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#5A607F] hover:bg-[#F8F9FB] rounded-md transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Xem chi tiết
            </button>
          )}
          {onAdjustBudget && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdjustBudget(row);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#5A607F] hover:bg-[#F8F9FB] rounded-md transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Điều chỉnh ngân sách
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Wallet Actions Cell
interface WalletActionsCellProps {
  row: Wallet;
  onEdit?: (row: Wallet) => void;
  onDelete?: (row: Wallet) => void;
}

function WalletActionsCell({ row, onEdit, onDelete }: WalletActionsCellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-[#F2F4F8] transition-colors"
          title="Hành động"
        >
          <Settings className="w-3.5 h-3.5 text-[#5A607F]" />
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
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#5A607F] hover:bg-[#F8F9FB] rounded-md transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
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
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#E40127] hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Saving Goal Actions Cell
interface SavingGoalActionsCellProps {
  row: SavingGoal;
  onEdit?: (row: SavingGoal) => void;
  onDelete?: (row: SavingGoal) => void;
}

function SavingGoalActionsCell({ row, onEdit, onDelete }: SavingGoalActionsCellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-[#F2F4F8] transition-colors"
          title="Hành động"
        >
          <Settings className="w-3.5 h-3.5 text-[#5A607F]" />
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
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#5A607F] hover:bg-[#F8F9FB] rounded-md transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
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
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#E40127] hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Budget Actions Cell
interface BudgetActionsCellProps {
  row: BudgetItem;
  onEdit?: (row: BudgetItem) => void;
  onDelete?: (row: BudgetItem) => void;
}

function BudgetActionsCell({ row, onEdit, onDelete }: BudgetActionsCellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-[#F2F4F8] transition-colors"
          title="Hành động"
        >
          <Settings className="w-3.5 h-3.5 text-[#5A607F]" />
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
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#5A607F] hover:bg-[#F8F9FB] rounded-md transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
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
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#E40127] hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Full Category Actions Cell
interface FullCategoryActionsCellProps {
  row: Category;
  onEdit?: (row: Category) => void;
  onDelete?: (row: Category) => void;
}

function FullCategoryActionsCell({ row, onEdit, onDelete }: FullCategoryActionsCellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-[#F2F4F8] transition-colors"
          title="Hành động"
        >
          <Settings className="w-3.5 h-3.5 text-[#5A607F]" />
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
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#5A607F] hover:bg-[#F8F9FB] rounded-md transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
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
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#E40127] hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// =====================
// Category Columns
// =====================

export interface CategoryColumnContext {
  totalAmount: number;
  onRowClick?: (row: CategoryBreakdown) => void;
  onViewDetail?: (row: CategoryBreakdown) => void;
  onAdjustBudget?: (row: CategoryBreakdown) => void;
}

export function getCategoryColumns(context: CategoryColumnContext): Column<CategoryBreakdown>[] {
  const { totalAmount, onRowClick, onViewDetail, onAdjustBudget } = context;

  return [
    {
      key: "name",
      header: "Danh mục",
      sortable: true,
      width: 200,
      render: (row) => {
        const IconComp = getIconById(row.icon);
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: row.color }}
            >
              <IconComp className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-medium text-[#1A1D2E] truncate">{row.name}</span>
          </div>
        );
      },
    },
    {
      key: "total",
      header: "Chi tiêu",
      align: "right",
      sortable: true,
      width: 250,
      render: (row) => <span className="text-xs font-semibold text-[#1A1D2E]">{formatCurrency(row.total)}</span>,
    },
    {
      key: "progress",
      header: "%",
      align: "right",
      width: 150,
      render: (row) => {
        const percentage = Math.round((row.total / totalAmount) * 100);
        return (
          <div className="flex items-center gap-1.5 justify-end">
            <div className="w-12 h-1 bg-[#F2F4F8] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: row.color,
                }}
              />
            </div>
            <span className="text-[10px] font-medium w-7 text-right" style={{ color: row.color }}>
              {percentage}%
            </span>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "",
      width: 40,
      align: "right",
      render: (row) => (
        <CategoryActionsCell row={row} onViewDetail={onViewDetail} onAdjustBudget={onAdjustBudget} />
      ),
    },
  ];
}

// =====================
// Wallet Columns
// =====================

export interface WalletColumnContext {
  onRowClick?: (row: Wallet) => void;
  onEdit?: (row: Wallet) => void;
  onDelete?: (row: Wallet) => void;
}

export function getWalletColumns(context: WalletColumnContext): Column<Wallet>[] {
  const { onEdit, onDelete } = context;

  return [
    {
      key: "name",
      header: "Tên ví",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: row.color }}
          >
            {row.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#1A1D2E] truncate">{row.name}</div>
            <div className="text-[10px] text-[#9EA3B8] truncate">
              {row.type}
              {row.cardNumber && ` • ${row.cardNumber}`}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "balance",
      header: "Số dư",
      align: "right",
      sortable: true,
      width: 120,
      render: (row) => (
        <div className="text-right">
          <div className="text-xs font-semibold text-[#1A1D2E]">{formatCurrency(row.balance)}</div>
          {row.isLowBalance && <div className="text-[10px] text-[#E40127]">Số dư thấp</div>}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      width: 40,
      align: "right",
      render: (row) => (
        <WalletActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}

// =====================
// Saving Goal Columns
// =====================

export interface SavingGoalColumnContext {
  onRowClick?: (row: SavingGoal) => void;
  onEdit?: (row: SavingGoal) => void;
  onDelete?: (row: SavingGoal) => void;
}

export function getSavingGoalColumns(context: SavingGoalColumnContext): Column<SavingGoal>[] {
  const { onEdit, onDelete } = context;

  return [
    {
      key: "name",
      header: "Mục tiêu",
      sortable: true,
      render: (row) => {
        const IconComp = getIconById(row.icon);
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${row.color}20` }}
            >
              <IconComp className="w-4 h-4" style={{ color: row.color }} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-[#1A1D2E] truncate">{row.name}</div>
              <div className="text-[10px] text-[#9EA3B8]">
                Deadline: {new Date(row.deadline).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "progress",
      header: "Tiến độ",
      width: 140,
      render: (row) => {
        const progress = Math.round((row.currentAmount / row.targetAmount) * 100);
        const isCompleted = progress >= 100;
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#5A607F]">{formatCurrency(row.currentAmount)}</span>
              <span
                className={`font-semibold ${isCompleted ? "text-[#21AE5A]" : ""}`}
                style={{ color: isCompleted ? undefined : row.color }}
              >
                {progress}%
              </span>
            </div>
            <div className="h-1.5 bg-[#F2F4F8] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: row.color,
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "targetAmount",
      header: "Mục tiêu",
      align: "right",
      width: 100,
      render: (row) => <span className="text-xs font-medium text-[#1A1D2E]">{formatCurrency(row.targetAmount)}</span>,
    },
    {
      key: "actions",
      header: "",
      width: 40,
      align: "right",
      render: (row) => (
        <SavingGoalActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}

// =====================
// Budget Columns
// =====================

export interface BudgetColumnContext {
  onRowClick?: (row: BudgetItem) => void;
  onEdit?: (row: BudgetItem) => void;
  onDelete?: (row: BudgetItem) => void;
}

export function getBudgetColumns(context: BudgetColumnContext): Column<BudgetItem>[] {
  const { onEdit, onDelete } = context;

  return [
    {
      key: "category",
      header: "Danh mục",
      sortable: true,
      render: (row) => {
        if (!row.categoryId) {
          return <span className="text-xs text-[#9EA3B8]">-</span>;
        }
        const IconComp = getIconById(row.categoryId.icon);
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: row.categoryId.color }}
            >
              <IconComp className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-medium text-[#1A1D2E]">{row.categoryId.name}</span>
          </div>
        );
      },
    },
    {
      key: "budgetAmount",
      header: "Ngân sách",
      align: "right",
      sortable: true,
      width: 100,
      render: (row) => <span className="text-xs font-semibold text-[#1A1D2E]">{formatCurrency(row.budgetAmount)}</span>,
    },
    {
      key: "spentAmount",
      header: "Đã chi",
      align: "right",
      sortable: true,
      width: 100,
      render: (row) => {
        const percentage = Math.round((row.spentAmount / row.budgetAmount) * 100);
        const isOverBudget = row.isOverBudget || percentage > 100;
        return (
          <div className="text-right">
            <span className={`text-xs font-semibold ${isOverBudget ? "text-[#E40127]" : "text-[#1A1D2E]"}`}>
              {formatCurrency(row.spentAmount)}
            </span>
          </div>
        );
      },
    },
    {
      key: "remaining",
      header: "Còn lại",
      align: "right",
      width: 100,
      render: (row) => {
        const remaining = row.budgetAmount - row.spentAmount;
        const isOverBudget = remaining < 0;
        return (
          <span className={`text-xs font-medium ${isOverBudget ? "text-[#E40127]" : "text-[#21AE5A]"}`}>
            {isOverBudget ? "-" : ""}
            {formatCurrency(Math.abs(remaining))}
          </span>
        );
      },
    },
    {
      key: "progress",
      header: "%",
      align: "right",
      width: 80,
      render: (row) => {
        const percentage = Math.round((row.spentAmount / row.budgetAmount) * 100);
        const isOverBudget = percentage > 100;
        const color = isOverBudget ? "#E40127" : row.categoryId.color;
        return (
          <div className="flex items-center gap-1.5 justify-end">
            <div className="w-12 h-1 bg-[#F2F4F8] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span className="text-[10px] font-medium w-8 text-right" style={{ color }}>
              {percentage}%
            </span>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "",
      width: 40,
      align: "right",
      render: (row) => (
        <BudgetActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}

// =====================
// Full Category Columns (for categories list)
// =====================

export interface FullCategoryColumnContext {
  onRowClick?: (row: Category) => void;
  onEdit?: (row: Category) => void;
  onDelete?: (row: Category) => void;
}

export function getFullCategoryColumns(context: FullCategoryColumnContext = {}): Column<Category>[] {
  const { onEdit, onDelete } = context;

  return [
    {
      key: "name",
      header: "Tên danh mục",
      sortable: true,
      render: (row) => {
        const IconComp = getIconById(row.icon);
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${row.color}15`,
                boxShadow: `0 4px 12px ${row.color}20`,
              }}
            >
              <IconComp className="w-5 h-5" style={{ color: row.color }} />
            </div>
            <span className="text-sm font-semibold text-[#1A1D2E]">{row.name}</span>
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Loại",
      sortable: true,
      width: 120,
      render: (row) => {
        const typeConfig = {
          income: { label: "Thu nhập", variant: "success" as const },
          expense: { label: "Chi tiêu", variant: "destructive" as const },
          both: { label: "Cả hai", variant: "secondary" as const },
        };
        const config = typeConfig[row.type] || typeConfig.expense;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "isDefault",
      header: "Mặc định",
      width: 100,
      render: (row) =>
        row.isDefault ? (
          <span className="text-xs text-[#9EA3B8]">Mặc định</span>
        ) : (
          <span className="text-xs text-[#5A607F]">Tùy chỉnh</span>
        ),
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      sortable: true,
      width: 120,
      render: (row) => (
        <span className="text-xs text-[#5A607F]">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("vi-VN")
            : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: 40,
      align: "right",
      render: (row) => (
        <FullCategoryActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
