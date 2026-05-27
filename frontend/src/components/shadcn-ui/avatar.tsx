'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

const Avatar = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className,
    )}
    {...props}
  />
);
Avatar.displayName = 'Avatar';

const AvatarImage = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'img'> & {
  ref?: React.RefObject<HTMLImageElement | null>;
}) => (
  <img
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
);
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium',
      className,
    )}
    {...props}
  />
);
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
