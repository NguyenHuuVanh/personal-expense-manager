// Timezone Việt Nam (UTC+7) — dùng để tính monthKey theo múi giờ local
export const VN_TIMEZONE_OFFSET_MINUTES = 7 * 60;

// Cache TTL cho snapshot tháng hiện tại (chưa "đóng sổ"): 5 phút
// Snapshot tháng quá khứ KHÔNG bao giờ invalid (immutable)
export const CURRENT_MONTH_SNAPSHOT_TTL_MS = 5 * 60 * 1000;

export const SNAPSHOT_LABELS = {
  startBalance: "Số dư đầu tháng",
  endBalance: "Số dư cuối tháng",
  totalIncome: "Thu nhập",
  totalExpense: "Chi tiêu",
  netChange: "Biến động ròng",
  noData: "Chưa có dữ liệu cho tháng này",
} as const;
