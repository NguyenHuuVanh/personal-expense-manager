"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn-ui/alert-dialog";
import { Button } from "@/components/shadcn-ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { getIconById } from "@/data/icons";
import { formatCurrency } from "@/utils/format-number";
import { apiClient, ApiError } from "@/lib/api-client";
import { toast } from "sonner";

interface CategoryData {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  isDefault: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface CategoryDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryData | null;
  totalSpent?: number;
  onSuccess?: () => void;
}

export function CategoryDeleteDialog({
  isOpen,
  onClose,
  category,
  totalSpent = 0,
  onSuccess,
}: CategoryDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!category) return;

    setIsDeleting(true);

    try {
      await apiClient.delete(`/categories/${category._id}`);
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Đã xảy ra lỗi khi xóa danh mục";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!category) return null;

  const IconComp = getIconById(category.icon);

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#E40127]" />
            Xóa danh mục
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 p-3 bg-[#F2F4F8] rounded-lg">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <IconComp className="w-5 h-5" style={{ color: category.color }} />
                </div>
                <div>
                  <p className="font-semibold text-[#1A1D2E]">{category.name}</p>
                  <p className="text-xs text-[#5A607F]">
                    {totalSpent > 0 && `Đã chi ${formatCurrency(totalSpent)}`}
                  </p>
                </div>
              </div>

              {totalSpent > 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Danh mục này đã có giao dịch. Nếu xóa, tất cả giao dịch liên quan sẽ bị xóa theo.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[#5A607F]">
                  Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Hủy</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-[#E40127] hover:bg-[#C7011F]"
            >
              {isDeleting ? (
                "Đang xóa..."
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa danh mục
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
