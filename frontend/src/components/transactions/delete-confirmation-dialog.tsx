"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/shadcn-ui/dialog";
import { Button } from "@/components/shadcn-ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-number";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
  itemAmount?: number;
  itemType?: "income" | "expense";
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  itemName,
  itemAmount,
  itemType,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const isExpense = itemType === "expense";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Xác nhận xóa
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <p className="text-sm text-[#5A607F]">
            Bạn có chắc chắn muốn xóa giao dịch này không?
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-[#E40127] hover:bg-[#C40123]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xóa"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
