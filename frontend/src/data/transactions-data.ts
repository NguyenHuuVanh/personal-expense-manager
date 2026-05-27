/**
 * Mock Data - Transactions
 * Dữ liệu mẫu cho bảng Giao dịch
 */

import type { RecentTransaction } from "@/types/expense-dashboard";

export const TRANSACTION_OPTIONS = {
  categories: [
    { value: "", label: "Tất cả danh mục" },
    { value: "utensils", label: "Ăn uống" },
    { value: "car", label: "Di chuyển" },
    { value: "shopping-bag", label: "Mua sắm" },
    { value: "pill", label: "Sức khỏe" },
    { value: "gamepad", label: "Giải trí" },
    { value: "zap", label: "Điện" },
    { value: "droplets", label: "Nước" },
    { value: "wifi", label: "Internet" },
    { value: "wallet", label: "Phí dịch vụ" },
    { value: "smartphone", label: "Điện thoại" },
  ],
  wallets: [
    { value: "", label: "Tất cả ví" },
    { value: "wallet-1", label: "VCB" },
    { value: "wallet-2", label: "Momo" },
    { value: "wallet-3", label: "Tiền mặt" },
    { value: "wallet-4", label: "ZaloPay" },
  ],
  types: [
    { value: "", label: "Tất cả loại" },
    { value: "income", label: "Thu nhập" },
    { value: "expense", label: "Chi tiêu" },
  ],
  sorts: [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "highest", label: "Số tiền cao nhất" },
    { value: "lowest", label: "Số tiền thấp nhất" },
  ],
};

export type TransactionSortValue =
  (typeof TRANSACTION_OPTIONS.sorts)[number]["value"];
export type TransactionCategoryValue =
  (typeof TRANSACTION_OPTIONS.categories)[number]["value"];
export type TransactionWalletValue =
  (typeof TRANSACTION_OPTIONS.wallets)[number]["value"];
export type TransactionTypeValue =
  (typeof TRANSACTION_OPTIONS.types)[number]["value"];
