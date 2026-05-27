'use client';

import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  classNameIcon?: string;
  classNameTitle?: string;
  classNameDescription?: string;
  classNameAction?: string;
};

export function EmptyState({
  title = 'Chưa có dữ liệu',
  description,
  icon,
  action,
  className,
  classNameIcon,
  classNameTitle,
  classNameDescription,
  classNameAction,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className,
    )}>
      {icon && (
        <div className={cn('mb-4 text-muted-foreground', classNameIcon)}>
          {icon}
        </div>
      )}
      <h3 className={cn('text-base font-medium text-muted-foreground', classNameTitle)}>
        {title}
      </h3>
      {description && (
        <p className={cn('mt-1 text-sm text-muted-foreground/70', classNameDescription)}>
          {description}
        </p>
      )}
      {action && (
        <div className={cn('mt-4', classNameAction)}>
          {action}
        </div>
      )}
    </div>
  );
}
