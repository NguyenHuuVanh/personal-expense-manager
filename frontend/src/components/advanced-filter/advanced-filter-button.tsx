'use client';

import type { FilterModuleConfig } from '@/types/advanced-filter';
import type { UseAdvancedFilterReturn } from '@/hooks/use-advanced-filter';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { PopoverContent, PopoverPositioner, PopoverRoot, PopoverTrigger } from '@ark-ui/react/popover';
import { Button } from '@/components/shadcn-ui/button';
import { cn } from '@/utils/cn';
import { AdvancedFilterPanel } from './advanced-filter-panel';

type AdvancedFilterButtonProps<T extends FilterModuleConfig> = {
  filter: UseAdvancedFilterReturn<T>;
  className?: string;
  onApply?: () => void;
  onClearAll?: () => void;
};

export function AdvancedFilterButton<T extends FilterModuleConfig>({
  filter,
  className,
  onApply,
  onClearAll,
}: AdvancedFilterButtonProps<T>) {
  const { isActive, activeRulesCount } = filter;
  const [open, setOpen] = useState(false);

  return (
    <PopoverRoot open={open} onOpenChange={(details) => setOpen(details.open)} positioning={{ strategy: 'fixed' }}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'relative flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium border transition-all duration-200 cursor-pointer',
            isActive
              ? 'border-primary/50 bg-primary/5 text-primary hover:bg-primary/10'
              : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
            className,
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Lọc nâng cao</span>
          {isActive && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-sm">
              {activeRulesCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent
          className="z-[9999] w-auto min-w-[680px] max-w-[900px] p-5 shadow-xl border border-border rounded-xl bg-popover text-popover-foreground"
        >
          <AdvancedFilterPanel
            filter={filter}
            onApply={() => {
              onApply?.();
              setOpen(false);
            }}
            onClearAll={() => {
              onClearAll?.();
              setOpen(false);
            }}
          />
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
}
