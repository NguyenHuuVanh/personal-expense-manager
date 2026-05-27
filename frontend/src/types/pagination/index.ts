/**
 * Generic pagination types — dùng được cho mọi list endpoint.
 */

// Offset-based pagination (truyền page + limit, biết tổng số trang)
export interface OffsetPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OffsetPaginatedResponse<T> {
  data: T[];
  pagination: OffsetPagination;
}

// Cursor-based pagination (infinite scroll, không biết total)
export interface CursorPagination {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  pagination: CursorPagination;
}

// Constants giới hạn limit để tránh client request quá nhiều
export const PAGINATION_LIMITS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;
