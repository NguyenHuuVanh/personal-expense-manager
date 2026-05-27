'use client';

import type { IOptionSelect } from '@/types/fields';
import { PopoverContent, PopoverPositioner, PopoverRoot, PopoverTrigger } from '@ark-ui/react/popover';
import { ChevronDown, Search, X } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { Button } from '../shadcn-ui/button';
import {
  Command as CommandPrimitive,
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandList as CommandListPrimitive,
  CommandSeparator as CommandSeparatorPrimitive,
} from 'cmdk';
import { cn } from '@/utils/cn';

const Command = CommandPrimitive;
const CommandEmpty = CommandEmptyPrimitive;
const CommandGroup = CommandGroupPrimitive;
const CommandInput = CommandInputPrimitive;
const CommandItem = CommandItemPrimitive;
const CommandList = CommandListPrimitive;
const CommandSeparator = CommandSeparatorPrimitive;

export type ComboboxProps = {
  value?: string;
  onChange?: (value: string) => void;
  options: readonly IOptionSelect[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  classNameTrigger?: string;
  classNameContent?: string;
  showClear?: boolean;
  clearText?: string;
};

export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Chọn...',
  searchPlaceholder = 'Tìm kiếm...',
  emptyText = 'Không tìm thấy',
  disabled,
  className,
  classNameTrigger,
  classNameContent,
  showClear = true,
  clearText = 'Bỏ chọn',
}: ComboboxProps) {
  const selectId = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedOption = useMemo(
    () => options.find(opt => opt.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const lower = search.toLowerCase();
    return options.filter(
      opt =>
        opt.label.toLowerCase().includes(lower) ||
        String(opt.value).toLowerCase().includes(lower),
    );
  }, [options, search]);

  const handleSelect = (optValue: string) => {
    onChange?.(optValue);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('' as any);
    setOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <PopoverRoot
        open={open}
        onOpenChange={({ open }) => {
          if (!open) setSearch('');
          setOpen(open);
        }}
        lazyMount
        unmountOnExit
        positioning={{ strategy: 'fixed' }}
      >
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            data-container={selectId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between shadow-sm font-normal',
              !selectedOption && 'text-muted-foreground',
              classNameTrigger,
            )}
          >
            <span className="truncate flex-1 text-left">
              {selectedOption?.label || placeholder}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              {showClear && selectedOption && (
                <span
                  onClick={handleClear}
                  className="hover:bg-muted rounded p-0.5 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <ChevronDown className="opacity-50 h-4 w-4" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverPositioner>
          <PopoverContent
            data-state={open ? 'open' : 'closed'}
            className={cn(
              'z-[9999] w-[var(--reference-width)] rounded-md border bg-popover text-popover-foreground shadow-md outline-none',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2',
              'min-w-[200px] p-0',
              classNameContent,
            )}
            onWheel={e => e.stopPropagation()}
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={searchPlaceholder}
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map(opt => (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={() => handleSelect(opt.value)}
                      className={cn(
                        'cursor-pointer',
                        opt.value === value && 'bg-accent',
                      )}
                    >
                      {opt.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {selectedOption && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        value="clear"
                        onSelect={() => {
                          onChange?.('' as any);
                          setOpen(false);
                          setSearch('');
                        }}
                        className="cursor-pointer text-center justify-center text-muted-foreground"
                      >
                        {clearText}
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverRoot>
    </div>
  );
}
