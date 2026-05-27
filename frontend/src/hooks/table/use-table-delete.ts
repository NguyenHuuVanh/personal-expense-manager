"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface UseTableDeleteOptions {
  /** API endpoint (e.g., "/api/transactions") */
  endpoint: string;
  /** HTTP method: "DELETE" for batch, "DELETE" with single ID */
  method?: "DELETE";
  /** Message shown on success */
  successMessage?: (count: number) => string;
  /** Callback khi xóa thành công - truyền IDs đã xóa */
  onSuccess?: (deletedIds: (string | number)[]) => void;
  /** Callback khi xóa thất bại */
  onError?: (error: Error) => void;
}

export interface UseTableDeleteReturn {
  /** Đang trong quá trình xóa */
  isDeleting: boolean;
  /** Xóa nhiều items */
  deleteSelected: (ids: (string | number)[]) => Promise<boolean>;
  /** Xóa 1 item */
  deleteOne: (id: string | number) => Promise<boolean>;
}

export function useTableDelete({
  endpoint,
  method = "DELETE",
  successMessage,
  onSuccess,
  onError,
}: UseTableDeleteOptions): UseTableDeleteReturn {
  const [isDeleting, setIsDeleting] = useState(false);

  const getSuccessMessage = useCallback(
    (count: number) => {
      if (successMessage) return successMessage(count);
      return count === 1
        ? "Đã xóa thành công"
        : `Đã xóa ${count} mục`;
    },
    [successMessage],
  );

  const deleteSelected = useCallback(
    async (ids: (string | number)[]): Promise<boolean> => {
      if (!ids.length) return false;

      setIsDeleting(true);
      try {
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "Xóa thất bại");
        }

        toast.success(getSuccessMessage(ids.length));
        onSuccess?.(ids);
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Đã xảy ra lỗi");
        toast.error(error.message);
        onError?.(error);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [endpoint, method, getSuccessMessage, onSuccess, onError],
  );

  const deleteOne = useCallback(
    async (id: string | number): Promise<boolean> => {
      return deleteSelected([id]);
    },
    [deleteSelected],
  );

  return { isDeleting, deleteSelected, deleteOne };
}
