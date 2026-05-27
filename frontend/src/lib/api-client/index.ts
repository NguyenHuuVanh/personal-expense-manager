/**
 * Centralized HTTP client cho mọi API call tới backend NestJS.
 *
 * Đặc điểm:
 *  - Tự động prefix `NEXT_PUBLIC_API_URL` (mặc định `http://localhost:3001`)
 *  - Tự động gắn Bearer token từ localStorage
 *  - Tự động parse JSON
 *  - Throw `ApiError` với status + message khi request fail
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const TOKEN_STORAGE_KEY = "auth_token";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Token storage — đơn giản dùng localStorage.
 * Production có thể migrate sang in-memory + cookie httpOnly nếu cần bảo mật cao.
 */
export const tokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },
  set(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  // Bỏ qua việc tự gắn Authorization header (dùng cho login/register)
  skipAuth?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, skipAuth, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // Tự động gắn Bearer token nếu có
  if (!skipAuth) {
    const token = tokenStorage.get();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Try parse JSON ngay cả khi error để extract message
  let data: unknown = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      // Body rỗng, ok
    }
  }

  if (!response.ok) {
    const errorObj = data as { message?: string; error?: string } | null;
    const errorMessage =
      errorObj?.message || errorObj?.error || `HTTP ${response.status}`;
    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

/**
 * Wrapper compat tương thích với code cũ dùng `fetch('/api/...')`.
 * Convert "/api/..." → endpoint backend tương ứng + tự gắn token.
 *
 * Dùng tạm để migrate dần. Khuyến khích migrate qua `apiClient` thẳng.
 */
export async function apiFetch(
  url: string,
  init?: RequestInit
): Promise<Response> {
  // Map "/api/foo" → "/foo" (backend NestJS không có prefix /api)
  const endpoint = url.startsWith("/api/")
    ? url.replace(/^\/api/, "")
    : url;

  const finalUrl = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  // Tự gắn token nếu có
  const token = tokenStorage.get();
  const headers = new Headers(init?.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(finalUrl, { ...init, headers });
}

export { API_BASE_URL };
