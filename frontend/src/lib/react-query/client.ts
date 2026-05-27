import { QueryClient } from "@tanstack/react-query";

/**
 * Default config cho mọi query trong app.
 *
 * Chọn các giá trị này dựa trên đặc thù của expense manager:
 * - User mở app, làm việc liên tục → ít chuyển tab xa → focus refetch không quá quan trọng
 * - Data thay đổi vừa phải (tạo transaction → balance đổi) → staleTime 1-5 phút phù hợp
 * - Mạng kém ở mobile → retry vừa phải
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Trong staleTime, data được coi là "fresh" → KHÔNG fetch lại khi component remount
        staleTime: 60 * 1000, // 1 phút (mặc định)

        // Sau gcTime, cache bị xóa khỏi memory nếu không component nào dùng
        // (gcTime = "garbage collection time", tên cũ là cacheTime)
        gcTime: 5 * 60 * 1000, // 5 phút

        // Retry 2 lần khi fail (mặc định 3, hơi nhiều)
        retry: 2,

        // Retry với exponential backoff: 1s, 2s, 4s...
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch khi user focus lại tab — UX tốt nhưng có thể tốn API
        // Tắt cho dev để dễ debug, bật cho production
        refetchOnWindowFocus: process.env.NODE_ENV === "production",

        // Refetch khi mạng restore lại (offline → online)
        refetchOnReconnect: true,

        // KHÔNG refetch on mount nếu data còn fresh
        refetchOnMount: true,
      },
      mutations: {
        // Mutations không retry mặc định (POST/PUT/DELETE — retry có thể nguy hiểm)
        retry: 0,
      },
    },
  });
}
