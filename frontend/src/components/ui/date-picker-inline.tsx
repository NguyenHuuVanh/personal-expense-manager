'use client';

import type { FC, ReactNode } from 'react';
import { Calendar } from '@/components/shadcn-ui/calendar';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useId, useMemo, useState } from 'react';
import { PiCalendarDots } from 'react-icons/pi';
import { Button } from '@/components/shadcn-ui/button';
import { cn } from '@/utils/cn';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export type DatePickerInlineProps = {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  formatStr?: string;
  className?: string;
  classNameTrigger?: string;
  disabled?: boolean;
};

export const DatePickerInline: FC<DatePickerInlineProps> = ({
  selected,
  onSelect,
  placeholder = 'Chọn ngày',
  formatStr = 'dd/MM/yyyy',
  className,
  classNameTrigger,
  disabled,
}) => {
  const [open, setOpen] = useState(false);

  const displayValue = selected
    ? format(selected, formatStr, { locale: vi })
    : placeholder;

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className={cn(
            'justify-start text-left font-normal shadow-sm min-w-[130px]',
            !selected && 'text-muted-foreground',
            classNameTrigger,
          )}
          onClick={() => setOpen(!open)}
        >
          {displayValue}
        </Button>
        {open && (
          <div className="absolute z-50 mt-1">
            <ReactDatePicker
              selected={selected}
              onChange={(date) => {
                onSelect?.(date as Date | undefined);
                setOpen(false);
              }}
              onCalendarClose={() => setOpen(false)}
              locale={vi}
              inline
              monthsShown={1}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
        )}
      </div>
    </div>
  );
};
