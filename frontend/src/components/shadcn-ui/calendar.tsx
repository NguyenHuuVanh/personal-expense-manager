"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { format, Locale } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/utils/cn";
import { buttonVariants } from "./button";

export type CalendarProps = {
  className?: string;
  classNames?: Record<string, string>;
  mode?: "single" | "range";
  selected?: Date | Date[];
  onSelect?: (date: Date | Date[] | undefined) => void;
  defaultMonth?: Date;
  fromMonth?: Date;
  toYear?: number;
  fromYear?: number;
  captionLayout?: "label" | "buttons";
  numberOfMonths?: number;
  disabled?: boolean | ((date: Date) => boolean);
  locale?: any;
  components?: Record<string, React.ComponentType<any>>;
  showOutsideDays?: boolean;
};

interface DayPickerProps extends Omit<CalendarProps, 'selected' | 'onSelect'> {
  selected?: Date | { from?: Date; to?: Date };
  onSelect?: (date: Date | { from?: Date; to?: Date } | undefined) => void;
}

function Calendar({
  className,
  classNames,
  mode = "single",
  selected,
  onSelect,
  defaultMonth,
  fromMonth,
  toYear,
  fromYear,
  numberOfMonths = 1,
  disabled,
  locale = vi,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    defaultMonth || (selected instanceof Date ? selected : new Date()),
  );

  // Convert selected to Date | null for react-datepicker
  const getSelectedDate = (): Date | null => {
    if (!selected) return null;
    if (selected instanceof Date) return selected;
    if ("from" in selected && selected.from) return selected.from;
    return null;
  };

  // Convert selected to range for react-datepicker
  const getSelectedRange = (): [Date | null, Date | null] => {
    if (!selected) return [null, null];
    if (Array.isArray(selected) && selected.length === 2) {
      return [selected[0] || null, selected[1] || null];
    }
    if ("from" in selected) {
      return [selected.from || null, selected.to || null];
    }
    return [null, null];
  };

  const handleChange = (date: Date | [Date | null, Date | null] | null) => {
    if (mode === "single") {
      onSelect?.(date as Date | undefined);
    } else if (mode === "range") {
      const [from, to] = date as [Date | null, Date | null];
      onSelect?.({
        from: from || undefined,
        to: to || undefined,
      } as any);
    }
  };

  const isSingleMode = mode === "single";
  const isRangeMode = mode === "range";

  const customInput = React.useRef<any>(null);

  // Custom header component
  const CustomHeader = ({
    monthDate,
    decreaseMonth,
    increaseMonth,
  }: {
    monthDate: Date;
    decreaseMonth: () => void;
    increaseMonth: () => void;
  }) => {
    return (
      <div className="flex justify-center pt-1 relative items-center">
        <button
          type="button"
          onClick={decreaseMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          )}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {format(monthDate, "MMMM yyyy", { locale })}
        </span>
        <button
          type="button"
          onClick={increaseMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          )}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // Custom day component for styling
  const dayClassName = (date: Date) => {
    const classes = [
      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
    ];

    // Check if date is selected
    if (isSingleMode) {
      const sel = getSelectedDate();
      if (sel && date.toDateString() === sel.toDateString()) {
        classes.push("bg-primary text-primary-foreground hover:bg-primary");
      }
    } else if (isRangeMode) {
      const [from, to] = getSelectedRange();
      if (from && to && date >= from && date <= to) {
        classes.push("bg-primary text-primary-foreground hover:bg-primary");
      } else if (from && !to && date.toDateString() === from.toDateString()) {
        classes.push("bg-primary text-primary-foreground hover:bg-primary");
      }
    }

    // Today
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      classes.push("bg-accent text-accent-foreground");
    }

    // Disabled
    if (typeof disabled === "function" && disabled(date)) {
      classes.push("text-muted-foreground opacity-50");
    }

    return cn(...classes);
  };

  const datePickerProps: any = {
    selected: isSingleMode ? getSelectedDate() : getSelectedRange(),
    onChange: handleChange,
    onMonthChange: setCurrentMonth,
    monthsShown: numberOfMonths,
    disabled,
    locale,
    showMonthYearPicker: false,
    showYearDropdown: toYear !== undefined || fromYear !== undefined,
    showMonthDropdown: true,
    yearDropdownItemNumber: 20,
    scrollableYearDropdown: true,
    minDate: fromMonth,
    maxDate: toYear ? new Date(toYear, 11, 31) : undefined,
    customInput: <div style={{ display: "none" }} />,
    inline: true,
    className: cn("p-3", className),
    dayClassName,
    renderCustomHeader: CustomHeader,
    calendarClassName: "!p-0 !border-none !bg-transparent",
  };

  // For range mode
  if (isRangeMode) {
    datePickerProps.selectsRange = true;
    datePickerProps.startDate = getSelectedRange()[0];
    datePickerProps.endDate = getSelectedRange()[1];
  }

  return (
    <div
      className={cn("react-datepicker-wrapper", classNames?.wrapper, className)}
    >
      <DatePicker {...datePickerProps} />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
