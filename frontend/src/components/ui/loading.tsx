'use client';

import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/utils/cn';

export type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-muted-foreground', sizeClasses[size], className)}
    />
  );
}

export type LoadingOverlayProps = {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  spinnerClassName?: string;
};

export function LoadingOverlay({
  isLoading,
  children,
  className,
  spinnerClassName,
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center z-50">
          <Spinner size="lg" className={spinnerClassName} />
        </div>
      )}
    </div>
  );
}

export type SkeletonProps = {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
};

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variantClass = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        variantClass[variant],
        className,
      )}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <Skeleton height={20} width="60%" />
      <Skeleton height={16} width="100%" />
      <Skeleton height={16} width="80%" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton height={14} width="40%" />
            <Skeleton height={12} width="60%" />
          </div>
        </div>
      ))}
    </div>
  );
}
