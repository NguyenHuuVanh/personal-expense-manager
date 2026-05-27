'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';
import { cn } from '@/utils/cn';

type CheckboxIconProps = {
  checked?: boolean;
  isIndeterminate?: boolean;
} & React.SVGProps<SVGSVGElement>;

export const CheckboxIcon = ({
  checked,
  isIndeterminate,
  className,
  ...props
}: CheckboxIconProps) => {
  return (
    <>
      {!isIndeterminate && (
        <svg
          aria-hidden="true"
          role="presentation"
          viewBox="0 0 17 18"
          className={cn(
            'transition-opacity pointer-events-none motion-reduce:transition-none',
            checked ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...props}
        >
          <polyline
            fill="none"
            points="1 9 7 14 15 4"
            stroke="currentColor"
            strokeDasharray={22}
            strokeDashoffset={checked ? 44 : 66}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            style={
              checked
                ? {
                    transition: 'stroke-dashoffset 250ms linear 0.2s',
                  }
                : {}
            }
          />
        </svg>
      )}

      {isIndeterminate && (
        <svg
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
          className={cn('pointer-events-none', className)}
          {...props}
        >
          <line x1="21" x2="3" y1="12" y2="12" />
        </svg>
      )}
    </>
  );
};

export type CheckboxProps = {
  checked?: boolean;
  isIndeterminate?: boolean;
} & Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'checked'
>;

const Checkbox = ({
  ref,
  className,
  checked,
  isIndeterminate,
  disabled,
  ...props
}: CheckboxProps & {
  ref?: React.RefObject<React.ComponentRef<
    typeof CheckboxPrimitive.Root
  > | null>;
}) => (
  <CheckboxPrimitive.Root
    ref={ref}
    disabled={disabled}
    className={cn(
      'relative group inline-flex items-center justify-center flex-shrink-0 overflow-hidden motion-reduce:transition-none outline-none transition-transform w-5 h-5 rounded-md text-primary-foreground',
      'before:content-[\'\'] before:absolute before:inset-0 before:border-solid before:border-2 before:box-border before:border-default before:rounded-md before:transition-colors',
      !disabled && 'hover:before:bg-zinc-100',
      'after:rounded-md after:bg-primary after:text-primary-foreground after:content-[\'\'] after:absolute after:inset-0 after:origin-center after:transition-transform-opacity after:!ease-linear after:!duration-200',
      checked || isIndeterminate
        ? 'after:scale-100 after:opacity-100'
        : 'after:scale-50 after:opacity-0',
      className,
    )}
    {...props}
  >
    <CheckboxIcon
      className="text-white z-10 w-4 h-3"
      checked={checked}
      isIndeterminate={isIndeterminate}
    />
  </CheckboxPrimitive.Root>
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
