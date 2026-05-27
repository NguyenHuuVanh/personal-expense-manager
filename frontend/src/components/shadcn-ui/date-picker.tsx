'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/shadcn-ui/button';
import { cn } from '@/utils/cn';
import { vi } from 'date-fns/locale';
import { useState, useEffect, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type DatePickerProps = {
  value?: Date;
  onChange: (date?: Date) => void;
  className?: string;
};

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Calendar height ~300px, show above if less than 320px below
      setShowAbove(spaceBelow < 320);
    }
  }, [open]);

  return (
    <div className="relative">
      <Button
        ref={triggerRef}
        variant="outline"
        className={cn(
          'w-full justify-start text-left font-normal',
          !value && 'text-muted-foreground',
          className,
        )}
        onClick={() => setOpen(!open)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, 'PPP', { locale: vi }) : <span>Pick a date</span>}
      </Button>
      {open && (
        <div
          className={cn(
            'absolute z-50 bg-popover rounded-md border shadow-md p-2',
            showAbove ? 'bottom-full mb-1' : 'top-full mt-1',
          )}
        >
          <ReactDatePicker
            selected={value || null}
            onChange={(date) => {
              onChange(date as Date | undefined);
              setOpen(false);
            }}
            inline
            locale={vi}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
      )}
    </div>
  );
}
