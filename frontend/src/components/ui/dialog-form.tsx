"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { Button } from "../shadcn-ui/button";
import {
  Dialog,
  DialogMain,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shadcn-ui/dialog";
import { ScrollArea } from "../shadcn-ui/scroll-area";

export type DialogFormProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  hiddenFooter?: boolean;
  hiddenClose?: boolean;
  hiddenCancel?: boolean;
  hiddenSubmit?: boolean;
  confirmText?: string;
  cancelText?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
  classNameFooter?: string;
  scroll?: boolean;
  formId?: string;
};

export function DialogForm({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  isLoading,
  hiddenFooter,
  hiddenClose,
  hiddenCancel,
  hiddenSubmit,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onSubmit,
  onCancel,
  size = "3xl",
  className,
  classNameFooter,
  scroll = true,
  formId,
}: DialogFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size={size}
        isLoading={isLoading}
        hiddentClose={hiddenClose}
        className={className}
      >
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {scroll ? (
          <DialogMain className={cn("[&>:nth-child(2)]:!p-6")}>
            {children}
          </DialogMain>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6">
            {children}
          </div>
        )}

        {!hiddenFooter && (
          <DialogFooter className={cn("", classNameFooter)}>
            {footer ? (
              footer
            ) : (
              <>
                {!hiddenCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => {
                      onCancel?.();
                      onOpenChange?.(false);
                    }}
                  >
                    {cancelText}
                  </Button>
                )}
                {!hiddenSubmit && (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    form={formId}
                    onClick={() => onSubmit?.()}
                  >
                    {isLoading ? "Đang xử lý..." : confirmText}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
