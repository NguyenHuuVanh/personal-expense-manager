/**
 * Cấu hình TTL và size cho từng loại cache.
 * TTL = Time To Live (ms) — bao lâu cache còn valid trước khi bị refresh.
 *
 * Quy tắc chọn TTL:
 * - Data ít thay đổi + đọc nhiều → TTL dài (10-30 phút)
 * - Data thay đổi vừa phải → TTL trung bình (1-5 phút)
 * - Data cá nhân hóa → TTL ngắn (30s-1 phút)
 */

export const CACHE_TTL = {
  // Categories: gần như không đổi, có thể cache lâu
  CATEGORIES: 10 * 60 * 1000, // 10 phút
  // User profile: thay đổi vừa phải (đổi tên, settings)
  USER: 5 * 60 * 1000, // 5 phút
} as const;

export const CACHE_MAX_SIZE = {
  // Số lượng entry tối đa trong mỗi cache
  CATEGORIES: 100, // tối đa 100 user/key
  USER: 500, // tối đa 500 user
} as const;

/**
 * Prefix cho cache key giúp debug và phân biệt các loại data.
 */
export const CACHE_KEY_PREFIX = {
  CATEGORIES_LIST: "categories:list",
  CATEGORIES_WITH_STATS: "categories:stats",
  USER_PROFILE: "user:profile",
} as const;
