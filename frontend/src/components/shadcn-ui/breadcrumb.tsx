'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { ChevronRight, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';

const breadcrumbVariants = cva(
  'inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      separator: {
        default: '[&>svg]:block',
        slash: '[&>span]:block [&>span]:w-1 [&>span]:h-1 [&>span]:rounded-full [&>span]:bg-current [&>svg]:hidden',
        arrow: '[&>svg]:block [&>span]:hidden',
      },
    },
    defaultVariants: {
      separator: 'default',
    },
  },
);

const Breadcrumb = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <nav
    aria-label="breadcrumb"
    className={cn(breadcrumbVariants(), className)}
    {...props}
  />
);
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = ({
  ref,
  className,
  ...props
}: React.OlHTMLAttributes<HTMLOListElement> & {
  ref?: React.RefObject<HTMLOListElement | null>;
}) => (
  <ol
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words sm:gap-2.5',
      className,
    )}
    {...props}
  />
);
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = ({
  ref,
  className,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement> & {
  ref?: React.RefObject<HTMLLIElement | null>;
}) => (
  <li
    ref={ref}
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = ({
  ref,
  className,
  asChild,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  asChild?: boolean;
  ref?: React.RefObject<HTMLAnchorElement | null>;
}) => {
  return (
    <a
      ref={ref}
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    />
  );
};
BreadcrumbLink.displayName = 'BreadcrumbLink';

type BreadcrumbSeparatorProps = {
  children?: React.ReactNode;
  className?: string;
  separator?: 'default' | 'slash' | 'arrow';
};

const BreadcrumbSeparator = ({
  children,
  className,
  separator = 'default',
  ...props
}: BreadcrumbSeparatorProps) => {
  if (separator === 'slash') {
    return (
      <span
        aria-hidden
        className={cn('[&+&]:ml-1.5', className)}
        {...props}
      >
        <span className="w-1 h-1 rounded-full bg-current inline-block" />
      </span>
    );
  }
  if (separator === 'arrow') {
    return (
      <ChevronRight
        aria-hidden
        className={cn('w-4 h-4', className)}
        {...props}
      />
    );
  }
  return (
    <ChevronRight
      aria-hidden
      className={cn('w-4 h-4', className)}
      {...props}
    />
  );
};
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbPage = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.RefObject<HTMLSpanElement | null>;
}) => (
  <span
    ref={ref}
    role="link"
    aria-disabled
    aria-current="page"
    className={cn('font-normal text-foreground', className)}
    {...props}
  />
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="presentation"
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
