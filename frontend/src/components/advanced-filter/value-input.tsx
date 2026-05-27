'use client';

import type { FilterFieldConfig, FilterOperator } from '@/types/advanced-filter';
import { NO_VALUE_OPERATORS, RANGE_OPERATORS } from '@/types/advanced-filter';
import { Check, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DatePickerInline } from '@/components/ui/date-picker-inline';
import { PopoverContent, PopoverPositioner, PopoverRoot, PopoverTrigger } from '@ark-ui/react/popover';
import { Button } from '@/components/shadcn-ui/button';
import { cn } from '@/utils/cn';

function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

type ValueInputProps = {
  fieldConfig: FilterFieldConfig | undefined;
  operator: FilterOperator;
  value: any;
  value2?: any;
  onChange: (value: any, value2?: any) => void;
};

export function ValueInput({
  fieldConfig,
  operator,
  value,
  value2,
  onChange,
}: ValueInputProps) {
  // No value needed for certain operators
  if (NO_VALUE_OPERATORS.includes(operator)) {
    return (
      <span className="inline-flex items-center h-8 px-3 rounded-md text-sm bg-muted text-muted-foreground border border-dashed border-border italic">
        tự động
      </span>
    );
  }

  if (!fieldConfig) {
    return (
      <input
        type="text"
        disabled
        placeholder="giá trị"
        className="h-8 px-3 rounded-md text-sm border border-dashed border-border bg-muted text-muted-foreground w-[140px] cursor-not-allowed"
      />
    );
  }

  const isRange = RANGE_OPERATORS.includes(operator);
  const isMulti = operator === 'in' || operator === 'not_in';

  // ─── Select / Multi-select ────────────────────────────
  if (fieldConfig.type === 'select' && fieldConfig.options) {
    if (isMulti) {
      return (
        <MultiSelectValue
          options={fieldConfig.options}
          selected={Array.isArray(value) ? value : value ? [value] : []}
          onChange={selected => onChange(selected)}
        />
      );
    }
    return (
      <SingleSelectValue
        options={fieldConfig.options}
        selected={value as string}
        onChange={v => onChange(v)}
      />
    );
  }

  // ─── Number Range ─────────────────────────────────────
  if (fieldConfig.type === 'number' && isRange) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={value ?? ''}
          onChange={e => onChange(e.target.value, value2)}
          placeholder="từ"
          className="h-8 px-3 rounded-md text-sm border border-input bg-background w-[80px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-xs text-muted-foreground">—</span>
        <input
          type="number"
          value={value2 ?? ''}
          onChange={e => onChange(value, e.target.value)}
          placeholder="đến"
          className="h-8 px-3 rounded-md text-sm border border-input bg-background w-[80px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    );
  }

  // ─── Date Range ───────────────────────────────────────
  if (fieldConfig.type === 'date' && isRange) {
    return (
      <div className="flex items-center gap-1.5">
        <DatePickerInline
          selected={value ? new Date(value) : undefined}
          onSelect={(date: any) => onChange(date ? formatDateStr(date) : '', value2)}
          placeholder="Từ ngày"
          classNameTrigger="h-8 text-sm !shadow-none border-input bg-background min-w-[130px]"
        />
        <span className="text-xs text-muted-foreground">—</span>
        <DatePickerInline
          selected={value2 ? new Date(value2) : undefined}
          onSelect={(date: any) => onChange(value, date ? formatDateStr(date) : '')}
          placeholder="Đến ngày"
          classNameTrigger="h-8 text-sm !shadow-none border-input bg-background min-w-[130px]"
        />
      </div>
    );
  }

  // ─── Date single ──────────────────────────────────────
  if (fieldConfig.type === 'date') {
    return (
      <DatePickerInline
        selected={value ? new Date(value) : undefined}
        onSelect={(date: any) => onChange(date ? formatDateStr(date) : '')}
        placeholder="Chọn ngày"
        classNameTrigger="h-8 text-sm !shadow-none border-input bg-background min-w-[160px]"
      />
    );
  }

  // ─── Number single ────────────────────────────────────
  if (fieldConfig.type === 'number') {
    return (
      <input
        type="number"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={fieldConfig.placeholder || 'Nhập số...'}
        className="h-8 px-3 rounded-md text-sm border border-input bg-background w-[120px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    );
  }

  // ─── Text (default) ───────────────────────────────────
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={fieldConfig.placeholder || 'Nhập giá trị...'}
      className="h-8 px-3 rounded-md text-sm border border-input bg-background w-[160px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
    />
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SingleSelectValue
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SingleSelectValue({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string; avatarUrl?: string }[];
  selected: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selectedOpt = options.find(o => o.value === selected);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) {
      return options;
    }
    const q = search.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const showSearch = options.length >= 6;

  return (
    <PopoverRoot
      open={open}
      onOpenChange={(details) => {
        setOpen(details.open);
        if (!details.open) {
          setSearch('');
        }
      }}
      positioning={{ strategy: 'fixed' }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'flex items-center gap-1.5 h-8 px-3 rounded-md text-sm transition-all',
            'border-input hover:border-primary/50 hover:bg-primary/5',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            selected ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          <span className="truncate max-w-[140px]">
            {selectedOpt ? selectedOpt.label : 'Chọn...'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent
          className="z-[9999] w-[220px] p-0 shadow-lg border rounded-lg bg-popover text-popover-foreground"
        >
          {showSearch && (
            <div className="p-2 border-b border-border">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full h-7 pl-8 pr-2 rounded text-sm border border-input bg-background outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          )}
          <div className="max-h-[200px] overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                Không tìm thấy
              </div>
            ) : filteredOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch('');
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer',
                  opt.value === selected
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-muted',
                )}
              >
                <span className="flex-1 truncate">{opt.label}</span>
                {opt.value === selected && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MultiSelectValue
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function MultiSelectValue({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const selectedLabels = useMemo(
    () => selected.map(v => options.find(o => o.value === v)?.label || v),
    [selected, options],
  );

  const toggleValue = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

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
            'border-input hover:border-primary/50 hover:bg-primary/5',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            selected.length > 0 ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          <span className="truncate max-w-[140px]">
            {selected.length === 0
              ? 'Chọn...'
              : selected.length === 1
                ? selectedLabels[0]
                : `${selected.length} đã chọn`}
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent
          className="z-[9999] w-[200px] p-0 shadow-lg border rounded-lg bg-popover text-popover-foreground"
        >
          <div className="max-h-[200px] overflow-y-auto py-1">
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleValue(opt.value)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted',
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors',
                      isSelected
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground',
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className="flex-1">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
}
