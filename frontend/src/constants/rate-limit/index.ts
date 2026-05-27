/**
 * Cấu hình rate limit cho từng loại endpoint.
 * Format: số lần / khoảng thời gian
 */
export const RATE_LIMIT_CONFIG = {
  // Login: chống brute force password
  login: {
    maxRequests: 5,
    windowSeconds: 15 * 60, // 15 phút
    label: "login",
  },
  // Register: chống spam tạo tài khoản
  register: {
    maxRequests: 3,
    windowSeconds: 60 * 60, // 1 giờ
    label: "register",
  },
  // Refresh token: cho phép nhiều hơn vì client tự gọi định kỳ
  refresh: {
    maxRequests: 30,
    windowSeconds: 5 * 60, // 5 phút
    label: "refresh",
  },
} as const;

export type RateLimitKey = keyof typeof RATE_LIMIT_CONFIG;

// Prefix cho keys trong Redis để tránh collision với cache keys
export const RATE_LIMIT_PREFIX = "ratelimit";

// Header chuẩn theo spec RFC 6585
export const RATE_LIMIT_HEADERS = {
  LIMIT: "X-RateLimit-Limit",
  REMAINING: "X-RateLimit-Remaining",
  RESET: "X-RateLimit-Reset",
  RETRY_AFTER: "Retry-After",
} as const;

// Message hiển thị cho user khi vượt limit
export const RATE_LIMIT_MESSAGES = {
  login: "Quá nhiều lần thử đăng nhập. Vui lòng đợi vài phút và thử lại.",
  register: "Quá nhiều lần tạo tài khoản từ địa chỉ này. Vui lòng thử lại sau 1 giờ.",
  refresh: "Quá nhiều yêu cầu. Vui lòng đợi và thử lại.",
} as const satisfies Record<RateLimitKey, string>;
