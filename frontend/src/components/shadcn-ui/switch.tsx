'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

const Switch = ({
  ref,
  className,
  checked,
  onCheckedChange,
  ...props
}: React.ComponentPropsWithoutRef<'button'> & {
  ref?: React.RefObject<HTMLButtonElement | null>;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) => {
  return (
    <button
      ref={ref}
      role="switch"
      aria-checked={checked}
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        className,
      )}
      onClick={() => onCheckedChange?.(!checked)}
      data-state={checked ? 'checked' : 'unchecked'}
      {...props}
    >
      <span
        data-state={checked ? 'checked' : 'unchecked'}
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        )}
      />
    </button>
  );
};
Switch.displayName = 'Switch';

export { Switch };
