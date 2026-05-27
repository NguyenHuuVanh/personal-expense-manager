'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog';

export type ConfirmDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  children?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Xác nhận',
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'default',
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className={variant === 'destructive' ? 'bg-red-500 hover:bg-red-600 text-white' : undefined}
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export type UseConfirmDialogReturn = {
  ConfirmDialogComponent: React.FC<ConfirmDialogProps>;
  confirm: (props?: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>) => Promise<boolean>;
};

export function useConfirmDialog(): UseConfirmDialogReturn {
  const [config, setConfig] = React.useState<ConfirmDialogProps | null>(null);
  const [resolveRef, setResolveRef] = React.useState<((value: boolean) => void) | null>(null);

  const confirm = React.useCallback((props?: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>) => {
    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
      setConfig({
        ...props,
        open: true,
        onOpenChange: (open) => {
          if (!open) {
            resolve(false);
            setConfig(null);
            setResolveRef(null);
          }
        },
        onConfirm: () => {
          resolve(true);
          setConfig(null);
          setResolveRef(null);
        },
        onCancel: () => {
          resolve(false);
          setConfig(null);
          setResolveRef(null);
        },
      });
    });
  }, []);

  const ConfirmDialogComponent = React.useCallback((props: ConfirmDialogProps) => {
    if (!config) return null;
    return (
      <ConfirmDialog
        {...config}
        {...props}
        open={config.open}
        onOpenChange={config.onOpenChange}
        onConfirm={() => {
          config.onConfirm?.();
          resolveRef?.(true);
        }}
        onCancel={() => {
          config.onCancel?.();
          resolveRef?.(false);
        }}
      />
    );
  }, [config, resolveRef]);

  return { ConfirmDialogComponent, confirm };
}
