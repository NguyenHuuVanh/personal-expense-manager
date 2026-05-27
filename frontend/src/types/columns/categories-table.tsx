/**
 * Column Definitions - Categories
 * Định nghĩa columns cho bảng danh mục
 */

import { useState } from "react";
import type { Column } from "@/types/table";
import { formatCurrency } from "@/utils/format-number";
import { getIconById } from "@/data/icons";
import { Badge } from "@/components/shadcn-ui/badge";
import { Pencil, Trash2, Calendar, Clock, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover";
import { CategoryFormDialog } from "@/components/categories/category-form-dialog";
import { CategoryDeleteDialog } from "@/components/categories/category-delete-dialog";

// =====================
// Types
// =====================

export interface CategoryData {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense" | "both";
  isDefault: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CategoryBreakdown {
  _id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
}

export interface CategoryColumnContext {
  getExpenseTotal?: (categoryId: string) => number;
  getIncomeTotal?: (categoryId: string) => number;
  onSuccess?: () => void;
}

// =====================
// Helper Functions
// =====================

function formatDate(date: string | Date | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(date: string | Date | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================================================
// ACTION CELL COMPONENT
// ============================================================================

interface CategoryRowActionsCellProps {
  row: CategoryData;
  getExpenseTotal?: (categoryId: string) => number;
  getIncomeTotal?: (categoryId: string) => number;
  onSuccess?: () => void;
}

function CategoryRowActionsCell({ row, getExpenseTotal, getIncomeTotal, onSuccess }: CategoryRowActionsCellProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const totalSpent = getExpenseTotal?.(row._id) || 0;

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditOpen(true);
                setIsPopoverOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#5A607F] hover:bg-[#F8F9FB] rounded-md transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Sửa
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteOpen(true);
                setIsPopoverOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#E40127] hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Edit Dialog */}
      <CategoryFormDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={row}
        onSuccess={() => {
          onSuccess?.();
          setIsEditOpen(false);
        }}
      />

      {/* Delete Dialog */}
      <CategoryDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        category={row}
        totalSpent={totalSpent}
        onSuccess={() => {
          onSuccess?.();
          setIsDeleteOpen(false);
        }}
      />
    </>
  );
}

// ============================================================================
// CATEGORY COLUMNS
// ============================================================================

export function getCategoryTableColumns(context: CategoryColumnContext): Column<CategoryData>[] {
  const { getExpenseTotal, getIncomeTotal, onSuccess } = context;

  return [
    {
      key: "icon",
      header: "",
      width: 50,
      render: (row) => {
        const IconComp = getIconById(row.icon);
        return (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${row.color}20` }}
          >
            <IconComp className="w-5 h-5" style={{ color: row.color }} />
          </div>
        );
      },
    },
    {
      key: "name",
      header: "Tên danh mục",
      sortable: true,
      render: (row) => (
        <div>
          <div className="text-sm font-medium text-[#1A1D2E]">{row.name}</div>
          {row.isDefault && <span className="text-xs text-[#9EA3B8]">Danh mục mặc định</span>}
        </div>
      ),
    },
    {
      key: "type",
      header: "Loại",
      width: 150,
      render: (row) => {
        const typeConfig = {
          income: { label: "Thu nhập", variant: "success" as const },
          expense: { label: "Chi tiêu", variant: "destructive" as const },
          both: { label: "Tất cả", variant: "default" as const },
        };
        const config = typeConfig[row.type];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "expense",
      header: "Chi tiêu",
      align: "right",
      sortable: true,
      width: 140,
      render: (row) => {
        const total = getExpenseTotal?.(row._id) || 0;
        return <span className="text-sm font-semibold text-[#E40127]">{formatCurrency(total)}</span>;
      },
    },
    {
      key: "income",
      header: "Thu nhập",
      align: "right",
      sortable: true,
      width: 140,
      render: (row) => {
        const total = getIncomeTotal?.(row._id) || 0;
        return <span className="text-sm font-semibold text-[#21AE5A]">{formatCurrency(total)}</span>;
      },
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      width: 120,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-[#5A607F]">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(row.createdAt)}</span>
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "Cập nhật",
      width: 180,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-[#5A607F]">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDateTime(row.updatedAt)}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Hành động",
      width: 100,
      align: "right",
      render: (row) => (
        <CategoryRowActionsCell
          row={row}
          getExpenseTotal={getExpenseTotal}
          getIncomeTotal={getIncomeTotal}
          onSuccess={onSuccess}
        />
      ),
    },
  ];
}
