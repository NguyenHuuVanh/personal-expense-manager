export const VIETQR_BANKS_API = "https://api.vietqr.io/v2/banks";

// Cache lâu vì danh sách ngân hàng gần như không đổi (vài tháng/lần)
export const BANK_LIST_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 giờ
