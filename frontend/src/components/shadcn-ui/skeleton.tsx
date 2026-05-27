'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

const Skeleton = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={ref}
    className={cn('animate-pulse rounded-md bg-muted', className)}
    {...props}
  />
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
