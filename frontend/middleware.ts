import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware đơn giản — KHÔNG check auth ở server side.
 *
 * Lý do: token JWT giờ lưu ở localStorage (browser), server không đọc được.
 * Auth guard chuyển xuống client-side qua `<ProtectedLayout>` component
 * sử dụng `useAuth()` hook.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect / về /login mặc định
  // (Sau khi login, AuthProvider sẽ tự redirect tới dashboard)
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
