import { vi } from 'vitest';

interface MockFetchResponse {
  ok: boolean;
  status?: number;
  data: unknown;
}

/**
 * Mock fetch trả về 1 response duy nhất.
 *
 * @example
 * mockFetchOnce({ ok: true, data: { success: true, data: { user: {...} } } });
 */
export const mockFetchOnce = (response: MockFetchResponse) => {
  const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
  fetchMock.mockResolvedValueOnce({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 400),
    json: async () => response.data,
  } as Response);
};

/**
 * Mock fetch reject (mô phỏng network error).
 */
export const mockFetchReject = (error: Error = new Error('Network error')) => {
  const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
  fetchMock.mockRejectedValueOnce(error);
};

/**
 * Reset toàn bộ fetch mock giữa các test.
 */
export const resetFetchMock = () => {
  const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
  fetchMock.mockReset();
};

/**
 * Helper mock chuẩn cho test có submit form (login/register/refresh flow).
 *
 * AuthContext khi mount sẽ gọi:
 *   1. GET /api/auth/me → 401 (chưa đăng nhập)
 *   2. POST /api/auth/refresh → 401 (auto retry)
 *
 * Sau khi user submit form (login/register thành công):
 *   3. POST /api/auth/login (hoặc /register) → trả response từ caller
 *   4. POST /api/auth/refresh → trigger bởi auto-refresh effect (set ok)
 *
 * Helper này mock 2 cái đầu sẵn. Caller chỉ cần mock thêm cho submit + auto-refresh.
 */
export const mockUnauthenticatedMount = () => {
  // Mount: me 401
  mockFetchOnce({ ok: false, status: 401, data: {} });
  // Mount: refresh 401 (vì chưa đăng nhập)
  mockFetchOnce({ ok: false, status: 401, data: {} });
};

/**
 * Mock auto-refresh sau login/register thành công.
 * Gọi sau khi mock submit response.
 */
export const mockAutoRefreshSuccess = () => {
  mockFetchOnce({ ok: true, data: { success: true } });
};
