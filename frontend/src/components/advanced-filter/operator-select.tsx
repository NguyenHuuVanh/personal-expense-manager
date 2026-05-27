'use client';

import type { FilterFieldConfig, FilterOperator } from '@/types/advanced-filter';
import { OPERATOR_LABELS, OPERATOR_SYMBOLS } from '@/types/advanced-filter';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { PopoverContent, PopoverPositioner, PopoverRoot, PopoverTrigger } from '@ark-ui/react/popover';
import { Button } from '@/components/shadcn-ui/button';
import { cn } from '@/utils/cn';

type OperatorSelectProps = {
  fieldConfig: FilterFieldConfig | undefined;
  selectedOperator: FilterOperator;
  onSelect: (operator: FilterOperator) => void;
};

export function OperatorSelect({
  fieldConfig,
  selectedOperator,
  onSelect,
}: OperatorSelectProps) {
  const [open, setOpen] = useState(false);

  if (!fieldConfig) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className="flex items-center gap-1 h-8 px-3 rounded-md text-sm border border-dashed text-muted-foreground cursor-not-allowed"
      >
        <span>điều kiện</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-30" />
      </Button>
    );
  }

  const operators = fieldConfig.operators;
  const selectedLabel = OPERATOR_LABELS[selectedOperator] || selectedOperator;
  const selectedSymbol = OPERATOR_SYMBOLS[selectedOperator];

  return (
    <PopoverRoot
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      positioning={{ strategy: 'fixed' }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'flex items-center gap-1.5 h-8 px-3 rounded-md text-sm transition-all',
            'border-secondary/50 bg-secondary/5 hover:bg-secondary/10 hover:border-secondary',
            'focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary',
          )}
        >
          {selectedSymbol && (
            <span className="font-mono text-secondary font-semibold">{selectedSymbol}</span>
          )}
          <span className="truncate max-w-[100px]">{selectedLabel}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent
          className="z-[9999] w-[200px] p-0 shadow-lg border rounded-lg bg-popover text-popover-foreground"
        >
          <div className="max-h-[280px] overflow-y-auto hide-scrollbar py-1">
            {operators.map(op => {
              const isSelected = op === selectedOperator;
              const symbol = OPERATOR_SYMBOLS[op];
              return (
                <button
                  key={op}
                  type="button"
                  onClick={() => {
                    onSelect(op);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-secondary/10 text-secondary font-medium'
                      : 'text-foreground hover:bg-muted',
                  )}
                >
                  {symbol && (
                    <span className="w-5 text-center font-mono text-secondary/70 shrink-0">{symbol}</span>
                  )}
                  {!symbol && <span className="w-5 shrink-0" />}
                  <span className="flex-1">{OPERATOR_LABELS[op]}</span>
                  {isSelected && <Check className="w-4 h-4 text-secondary shrink-0" />}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
}