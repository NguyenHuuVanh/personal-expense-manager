/**
 * Transactions Table Column Definitions
 * Định nghĩa columns cho bảng Giao dịch
 */

import { useState } from "react";
import type { Column } from "@/types/table";
import type { Transaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/utils/format-number";
import { getIconById } from "@/data/icons";
import { Pencil, Trash2, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn-ui/popover";

// ============================================================================
// CONSTANTS
// ============================================================================

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

const COLORS = {
  primary: "#1A1D2E",
  muted: "#9EA3B8",
  secondary: "#5A607F",
  income: "#21AE5A",
  expense: "#E40127",
} as const;

const WALLET_LABELS: Record<string, string> = {
  "wallet-1": "VCB",
  "wallet-2": "Momo",
  "wallet-3": "Tiền mặt",
  "wallet-4": "ZaloPay",
};

interface WalletInfo {
  _id?: string;
  name?: string;
  color?: string;
}

// ============================================================================
// TYPES
// ============================================================================

export interface TransactionColumnContext {
  onRowClick?: (row: Transaction) => void;
  onEdit?: (row: Transaction) => void;
  onDelete?: (row: Transaction) => void;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getCategoryInfo(categoryId: Transaction["categoryId"]) {
  if (!categoryId) return null;
  if (typeof categoryId === "string") return null;
  return categoryId;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("vi-VN", DATE_FORMAT_OPTIONS);

const getWalletLabel = (walletId: unknown) => {
  if (!walletId) return "-";
  if (typeof walletId === "object") {
    const wallet = walletId as WalletInfo;
    return wallet.name ?? "-";
  }
  return WALLET_LABELS[walletId as string] ?? "-";
};

// ============================================================================
// RENDER HELPERS (cho mỗi column)
// ============================================================================

const renderDateCell = (row: Transaction) => (
  <span className="text-sm font-semibold" style={{ color: COLORS.primary }}>
    {formatDate(row.date)}
  </span>
);

const renderCategoryCell = (row: Transaction) => {
  const categoryInfo = getCategoryInfo(row.categoryId);
  if (!categoryInfo) {
    return <span className="text-sm" style={{ color: COLORS.muted }}>-</span>;
  }

  const IconComp = getIconById(categoryInfo.icon);
  const typeColor = row.type === "income" ? COLORS.income : COLORS.expense;
  const typeLabel = row.type === "income" ? "Thu nhập" : "Chi tiêu";

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{
          backgroundColor: `${categoryInfo.color}15`,
          boxShadow: `0 4px 12px ${categoryInfo.color}20`,
        }}
      >
        <IconComp className="w-4 h-4" style={{ color: categoryInfo.color }} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold" style={{ color: COLORS.primary }}>
          {categoryInfo.name}
        </span>
        <span className="text-xs font-medium" style={{ color: typeColor }}>
          {typeLabel}
        </span>
      </div>
    </div>
  );
};

const renderDescriptionCell = (row: Transaction) => (
  <span className="text-sm max-w-[160px] truncate block" style={{ color: COLORS.secondary }}>
    {row.description || "-"}
  </span>
);

const renderWalletCell = (row: Transaction) => (
  <span className="text-sm" style={{ color: COLORS.secondary }}>
    {getWalletLabel(row.walletId)}
  </span>
);

const renderAmountCell = (row: Transaction) => {
  const color = row.type === "income" ? COLORS.income : COLORS.expense;
  const prefix = row.type === "income" ? "+" : "-";

  return (
    <span className="text-sm lg:text-base font-bold" style={{ color }}>
      {prefix}
      {formatCurrency(row.amount)}
    </span>
  );
};

// ============================================================================
// ACTION CELL COMPONENT (cần useState nên phải là component riêng)
// ============================================================================

interface RowActionsCellProps {
  row: Transaction;
  onEdit?: (row: Transaction) => void;
  onDelete?: (row: Transaction) => void;
}

function RowActionsCell({ row, onEdit, onDelete }: RowActionsCellProps) {
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

const renderActionsCell = (
  row: Transaction,
  context: TransactionColumnContext
) => {
  return <RowActionsCell row={row} onEdit={context.onEdit} onDelete={context.onDelete} />;
};

// ============================================================================
// COLUMN DEFINITIONS
// ============================================================================

export type TransactionColumnsVariant = "default" | "dashboard";

export interface ColumnWidths {
  date?: number;
  category?: number;
  description?: number;
  walletId?: number;
  amount?: number;
  actions?: number;
}

export interface GetTransactionColumnsOptions extends TransactionColumnContext {
  variant?: TransactionColumnsVariant;
  columnWidths?: ColumnWidths;
}

export function getTransactionColumns(
  options: GetTransactionColumnsOptions = {},
): Column<Transaction>[] {
  const { variant = "default", columnWidths = {} } = options;

  const baseColumns: Column<Transaction>[] = [
    {
      key: "date",
      header: "Ngày",
      width: columnWidths.date ?? 200,
      sortable: true,
      render: (row) => renderDateCell(row),
    },
    {
      key: "category",
      header: "Danh mục",
      sortable: true,
      width: columnWidths.category,
      render: (row) => renderCategoryCell(row),
    },
    {
      key: "description",
      header: "Mô tả",
      width: columnWidths.description,
      render: (row) => renderDescriptionCell(row),
    },
    {
      key: "walletId",
      header: "Ví",
      width: columnWidths.walletId ?? 110,
      render: (row) => renderWalletCell(row),
    },
    {
      key: "amount",
      header: "Số tiền",
      align: "right",
      sortable: true,
      width: columnWidths.amount ?? 200,
      render: (row) => renderAmountCell(row),
    },
    {
      key: "actions",
      header: "Hành động",
      width: columnWidths.actions ?? 150,
      align: "right",
      render: (row) => renderActionsCell(row, options),
    },
  ];

  // Dashboard variant - compact columns
  if (variant === "dashboard") {
    return baseColumns.map((col) => {
      switch (col.key) {
        case "date":
          return { ...col, width: columnWidths.date ?? 160 };
        case "category":
          return { ...col, width: columnWidths.category ?? 250 };
        case "description":
          return { ...col, width: columnWidths.description ?? 250 };
        case "walletId":
          return { ...col, width: columnWidths.walletId ?? 110 };
        case "amount":
          return { ...col, width: columnWidths.amount ?? 140 };
        case "actions":
          return { ...col, width: columnWidths.actions ?? 80 };
        default:
          return col;
      }
    });
  }

  return baseColumns;
}
