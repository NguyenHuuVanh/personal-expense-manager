'use client';

import type { IOptionSelect } from '@/types/advanced-filter';
import { PopoverContent, PopoverPositioner, PopoverRoot, PopoverTrigger } from '@ark-ui/react/popover';
import { ChevronDown, Check } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { Button } from '@/components/shadcn-ui/button';
import { cn } from '@/utils/cn';

export type ComboboxMultiSelectProps = {
  options: readonly IOptionSelect[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  classNameTrigger?: string;
};

export function ComboboxMultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Chọn...',
  searchPlaceholder = 'Tìm kiếm...',
  disabled,
  className,
  classNameTrigger,
}: ComboboxMultiSelectProps) {
  const selectId = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedLabels = useMemo(
    () => selected.map(v => options.find(o => o.value === v)?.label || v),
    [selected, options],
  );

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const lower = search.toLowerCase();
    return options.filter(
      opt => opt.label.toLowerCase().includes(lower) || String(opt.value).toLowerCase().includes(lower),
    );
  }, [options, search]);

  const toggleValue = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const displayValue =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selectedLabels[0]
        : `${selected.length} đã chọn`;

  return (
    <div className={cn('relative', className)}>
      <PopoverRoot
        open={open}
        onOpenChange={({ open }) => {
          if (!open) setSearch('');
          setOpen(open);
        }}
        positioning={{ strategy: 'fixed' }}
      >
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            data-container={selectId}
            variant="outline"
            className={cn(
              'w-full justify-between shadow-sm font-normal',
              !selected.length && 'text-muted-foreground',
              classNameTrigger,
            )}
          >
            <span className="truncate flex-1 text-left">{displayValue}</span>
            <ChevronDown className="opacity-50 h-4 w-4 shrink-0 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverPositioner>
          <PopoverContent
            data-state={open ? 'open' : 'closed'}
            className={cn(
              'z-[9999] w-[var(--reference-width)] rounded-md border bg-popover text-popover-foreground shadow-md outline-none',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2',
              'min-w-[200px] p-0',
            )}
            onWheel={e => e.stopPropagation()}
          >
            {options.length >= 6 && (
              <div className="p-2 border-b border-border">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full h-8 px-3 rounded text-sm border border-input bg-background outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            )}
            <div className="max-h-[200px] overflow-y-auto hide-scrollbar py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                  Không tìm thấy
                </div>
              ) : (
                filteredOptions.map(opt => {
                  const isSelected = selected.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleValue(opt.value)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer',
                        isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors',
                          isSelected ? 'bg-primary border-primary' : 'border-muted-foreground',
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className="flex-1">{opt.label}</span>
                    </button>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverRoot>
    </div>
  );
}
