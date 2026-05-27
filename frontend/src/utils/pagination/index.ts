import { PAGINATION_LIMITS } from "@/types/pagination";

/**
 * Parse và clamp limit param từ URL về khoảng [MIN_LIMIT, MAX_LIMIT].
 */
export function parseLimit(value: string | null): number {
  const parsed = Number.parseInt(value || "", 10);
  if (!Number.isFinite(parsed)) return PAGINATION_LIMITS.DEFAULT_LIMIT;
  return Math.max(
    PAGINATION_LIMITS.MIN_LIMIT,
    Math.min(parsed, PAGINATION_LIMITS.MAX_LIMIT)
  );
}

/**
 * Parse page param. Mặc định page 1, không cho âm.
 */
export function parsePage(value: string | null): number {
  const parsed = Number.parseInt(value || "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

/**
 * Cursor format dùng cho transactions:
 *   `${ISO_DATE}|${OBJECT_ID}`
 *
 * Lý do tie-breaker bằng _id: nhiều transaction cùng date sẽ có thứ tự ổn định.
 */
const CURSOR_SEPARATOR = "|";

export function encodeCursor(date: Date | string, id: string): string {
  const isoDate = typeof date === "string" ? date : date.toISOString();
  return `${isoDate}${CURSOR_SEPARATOR}${id}`;
}

export function decodeCursor(
  cursor: string
): { date: Date; id: string } | null {
  const [isoDate, id] = cursor.split(CURSOR_SEPARATOR);
  if (!isoDate || !id) return null;

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;

  return { date, id };
}
