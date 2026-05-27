"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "./client";

interface ReactQueryProviderProps {
  children: ReactNode;
}

/**
 * Provider TanStack Query. Đặt ở app root (app/layout.tsx) bao quanh toàn app.
 *
 * useState đảm bảo QueryClient là 1 singleton trong lifecycle của app.
 * Nếu khai báo `const client = new QueryClient()` ở module level → sẽ chia sẻ giữa
 * các users khi SSR (gây leak data).
 */
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools chỉ render trong dev — production tự bị tree-shaken */}
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
}
