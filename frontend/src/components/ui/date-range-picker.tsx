"use client";

import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "../shadcn-ui/button";
import { useDisclosure } from "@/hooks/use-disclosure";
import { cn } from "@/utils/cn";
import { vi } from "date-fns/locale";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type DateRangePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  formatStr?: string;
  disabled?: boolean;
  className?: string;
  classNameTrigger?: string;
  classNameContent?: string;
  minDate?: Date;
  maxDate?: Date;
};

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Chọn khoảng ngày",
  formatStr = "dd.MM.yyyy",
  disabled,
  className,
  classNameTrigger,
  classNameContent,
  minDate,
  maxDate,
}: DateRangePickerProps) {
  const { isOpen, onOpenChange, onClose } = useDisclosure();

  const range = value ?? { from: undefined, to: undefined };

  const displayValue = React.useMemo(() => {
    if (!range.from && !range.to) return placeholder;
    if (range.from && range.to) {
      return `${format(range.from, formatStr)} - ${format(range.to, formatStr)}`;
    }
    if (range.from) return `${format(range.from, formatStr)} - ...`;
    return "";
  }, [range, formatStr, placeholder]);

  const handleSelect = (from: Date | undefined, to: Date | undefined) => {
    onChange?.({ from, to });
  };

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    if (start && end) {
      handleSelect(start, end);
      onClose();
    } else if (start) {
      handleSelect(start, undefined);
    } else {
      handleSelect(undefined, undefined);
    }
  };

  return (
    <div className={cn("", className)}>
      <input
        type="hidden"
        name=""
        value={range.from ? range.from.toISOString() : ""}
      />
      <div className="relative">
        <Button
          id="date-range"
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal shadow-sm",
            !range.from && "text-muted-foreground",
            classNameTrigger,
          )}
          onClick={() => onOpenChange(!isOpen)}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
        {isOpen && (
          <div className="absolute z-50 mt-1 bg-popover rounded-md border shadow-md p-2">
            <DatePicker
              selected={range.from}
              onChange={handleChange as any}
              startDate={range.from || null}
              endDate={range.to || null}
              selectsRange
              monthsShown={2}
              inline
              locale={vi}
              minDate={minDate}
              maxDate={maxDate}
              className={cn("w-full", classNameContent)}
              onClickOutside={() => onClose()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
