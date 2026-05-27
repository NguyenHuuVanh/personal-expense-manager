/**
 * Default categories được tạo cho mỗi user mới khi register.
 * Mỗi user có bản sao riêng → có thể tự do đổi tên/màu/icon hoặc xóa.
 */
export const DEFAULT_CATEGORIES = [
  // Expense categories
  { name: "Ăn uống", icon: "utensils", color: "#F89C34", type: "expense" as const },
  { name: "Di chuyển", icon: "car", color: "#827BF2", type: "expense" as const },
  { name: "Mua sắm", icon: "shopping-bag", color: "#F66PAC", type: "expense" as const },
  { name: "Sức khỏe", icon: "pill", color: "#21AE5A", type: "expense" as const },
  { name: "Giải trí", icon: "gamepad", color: "#F2CC00", type: "expense" as const },
  { name: "Nhà cửa", icon: "home", color: "#38BDF8", type: "expense" as const },
  { name: "Điện", icon: "zap", color: "#F89C34", type: "expense" as const },
  { name: "Nước", icon: "droplets", color: "#38BDF8", type: "expense" as const },
  { name: "Internet", icon: "wifi", color: "#F66PAC", type: "expense" as const },
  { name: "Điện thoại", icon: "smartphone", color: "#F2CC00", type: "expense" as const },
  { name: "Phí dịch vụ", icon: "wallet", color: "#21AE5A", type: "expense" as const },
  { name: "Vận chuyển", icon: "truck", color: "#827BF2", type: "expense" as const },
  { name: "Giáo dục", icon: "book", color: "#38BDF8", type: "expense" as const },
  { name: "Du lịch", icon: "plane", color: "#F66PAC", type: "expense" as const },
  { name: "Khác", icon: "package", color: "#9EA3B8", type: "expense" as const },

  // Income categories
  { name: "Lương", icon: "wallet", color: "#21AE5A", type: "income" as const },
  { name: "Thưởng", icon: "gift", color: "#F2CC00", type: "income" as const },
  { name: "Phụ cấp", icon: "briefcase", color: "#827BF2", type: "income" as const },
  { name: "Đầu tư", icon: "trending-up", color: "#38BDF8", type: "income" as const },
  { name: "Thưởng dự án", icon: "gift", color: "#F66PAC", type: "income" as const },
] as const;
