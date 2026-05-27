"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { toast } from "sonner";
import type { DeleteWalletModalProps } from "@/types/right-panel";

function DeleteWalletModal({ isOpen, onClose, wallet, onConfirm }: DeleteWalletModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);

    try {
      const result = await onConfirm();
      if (result.success) {
        toast.success(`Đã xóa ví "${wallet?.name}" thành công`);
        onClose();
      } else {
        setError(result.error || "Đã xảy ra lỗi");
        toast.error(result.error || "Đã xảy ra lỗi");
      }
    } catch {
      setError("Đã xảy ra lỗi");
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !wallet) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-[101] w-full max-w-[320px] bg-white rounded-lg shadow-lg p-5">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-[#1A1D2E] mb-2">Xóa ví</h3>
          <p className="text-sm text-[#5A607F] mb-4">
            Bạn có chắc muốn xóa ví <span className="font-medium">{wallet.name}</span>? Hành động này không thể hoàn
            tác.
          </p>
        </div>

        {error && <div className="mb-4 p-2 rounded-lg bg-red-50 text-red-600 text-xs text-center">{error}</div>}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-9 text-xs"
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            className="flex-1 h-9 text-xs bg-red-500 hover:bg-red-600 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DeleteWalletModal };
