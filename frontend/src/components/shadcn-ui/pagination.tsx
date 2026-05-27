'use client';

import * as React from 'react';
import { ChevronLeft, MoreHorizontal, ChevronRight } from 'lucide-react';
import { Button } from '@/components/shadcn-ui/button';
import { cn } from '@/utils/cn';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'ul'> & {
  ref?: React.RefObject<HTMLUListElement | null>;
}) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'li'> & {
  ref?: React.RefObject<HTMLLIElement | null>;
}) => (
  <li ref={ref} className={cn('', className)} {...props} />
);
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<'button'>;

const PaginationLink = ({
  ref,
  className,
  isActive,
  ...props
}: PaginationLinkProps & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) => (
  <Button
    ref={ref}
    variant={isActive ? 'default' : 'outline'}
    size="sm"
    className={cn(
      'h-9 w-9 p-0',
      isActive && 'pointer-events-none opacity-50',
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to previous page"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to next page"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
