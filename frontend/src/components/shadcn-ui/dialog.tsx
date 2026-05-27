"use client";

import type { VariantProps } from "class-variance-authority";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/utils/cn";
import { Button } from "./button";

const Dialog = DialogPrimitive.Root;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-40 bg-black/50 rounded-none animate-fade-in", className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
  "relative z-[60] w-full border rounded-lg bg-background shadow-lg sm:rounded-lg max-sm:w-[95%]",
  {
    variants: {
      size: {
        default: "max-w-lg",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
      },
    },
    defaultVariants: {
      size: "3xl",
    },
  },
);

type DialogContentProps = {
  isLoading?: boolean;
  hiddentClose?: boolean;
} & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogContentVariants>;

const DialogContent = ({
  ref,
  className,
  children,
  isLoading,
  size,
  hiddentClose,
  ...props
}: DialogContentProps & {
  ref?: React.RefObject<React.ElementRef<typeof DialogPrimitive.Content>>;
}) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            dialogContentVariants({ size, className }),
            "z-50 flex flex-col max-h-[90dvh] overflow-clip custom_scroll rounded-lg bg-white animate-zoom-in",
          )}
          aria-describedby={undefined}
          {...props}
        >
          {children}
          <DialogPrimitive.Title className="sr-only" aria-hidden />

          {!hiddentClose && (
            <DialogPrimitive.Close
              asChild
              className="absolute z-[11] top-2 right-2 rounded-full opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none"
            >
              <Button type="button" size="icon" className="!bg-none !border-none !p-0" variant="ghost">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogPrimitive.Close>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-gray-200/60 rounded-lg flex items-center justify-center z-10">
              <div className="border-[2px] rounded-full border-gray-200 shadow-sm animate-spin" />
            </div>
          )}
        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
  );
};
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col rounded-none space-y-1.5 text-center sm:text-left p-5 pb-3 flex-shrink-0 border-b",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => <div ref={ref} className={cn("flex justify-end gap-3 p-5 pt-3 flex-shrink-0 border-t", className)} {...props} />;
DialogFooter.displayName = "DialogFooter";

const DialogTitle = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
  ref?: React.RefObject<React.ElementRef<typeof DialogPrimitive.Title>>;
}) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-base font-semibold leading-none tracking-tight text-[#1A1D2E]", className)}
    {...props}
  />
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
  ref?: React.RefObject<React.ElementRef<typeof DialogPrimitive.Description>>;
}) => <DialogPrimitive.Description ref={ref} className={cn("text-xs text-[#5A607F]", className)} {...props} />;
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogMain = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={ref}
    className={cn("flex-1 min-h-0 overflow-y-auto overflow-x-hidden hide-scrollbar px-5 py-3 border-b", className)}
    {...props}
  />
);
DialogMain.displayName = "DialogMain";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogMain,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
