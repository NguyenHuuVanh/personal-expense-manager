"use client";
import type { FC, ReactNode } from "react";
import type { CalendarProps } from "@/components/shadcn-ui/calendar";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getYear,
  getMonth,
} from "date-fns";
import { vi } from "date-fns/locale";
import { useId, useMemo, useState, useEffect, useRef } from "react";
import { PiCalendarDots } from "react-icons/pi";
import { useDisclosure } from "@/hooks/use-disclosure";
import { cn } from "@/utils/cn";
import WapperField from "../wapper-field";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";

export type DateRange = { from?: Date; to?: Date };

export type DatePickerFieldProps = {
  name?: string;
  selected?: Date;
  selectedForm?: Date;
  selectedTo?: Date;
  mode?: "single" | "range";
  numberOfMonths?: number;
  placeholder?: string;
  onSelect?: (date: Date | undefined | DateRange) => void;
  formatStr?: string;
  calendarProps?: Pick<
    CalendarProps,
    | "toYear"
    | "fromYear"
    | "captionLayout"
    | "components"
    | "classNames"
    | "disabled"
    | "locale"
    | "fromMonth"
  >;
  defaultMonth?: Date;
  contentFooter?: ReactNode;
  classContent?: string;
  buttonClassName?: string;
  label?: string;
  required?: boolean;
  msgError?: string;
  classWapper?: string;
  variant?: "default" | "simple";
  position?: "bottom" | "top" | "auto";
  positionClassName?: string;
  size?: "sm" | "md" | "lg";
};

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTHS_VI = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export const DatePickerField: FC<DatePickerFieldProps> = ({
  name,
  selected,
  label,
  required,
  msgError,
  mode = "single",
  numberOfMonths = 1,
  placeholder = "Chọn ngày",
  selectedForm,
  selectedTo,
  onSelect,
  formatStr = "dd/MM/yyyy",
  calendarProps,
  defaultMonth,
  contentFooter,
  classContent,
  classWapper,
  buttonClassName,
  variant = "default",
  positionClassName,
  position = "auto",
  size = "md",
}) => {
  const selectId = useId();
  const { isOpen, onOpenChange, onClose } = useDisclosure();
  const isPlaceholder = !(selected || selectedForm || selectedTo);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number; width: number; placement: "bottom" | "top" } | null>(null);

  const [viewDate, setViewDate] = useState<Date>(selected || new Date());

  // Calculate popup position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const calendarHeight = 280;
      const gap = 8;

      let placement: "bottom" | "top";
      if (position === "auto") {
        placement = spaceBelow < calendarHeight ? "top" : "bottom";
      } else {
        placement = position;
      }

      const top = placement === "bottom"
        ? rect.bottom + window.scrollY + gap
        : rect.top + window.scrollY - calendarHeight - gap;

      setPopupPosition({
        top,
        left: rect.left + window.scrollX,
        width: 280,
        placement,
      });
    }
  }, [isOpen, position]);

  // Khi click outside dropdown calendar thì đóng lại
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const valueDate = useMemo(() => {
    if (mode === "single") {
      return { mode, selected, onSelect };
    } else if (mode === "range") {
      return {
        mode,
        selected: { to: selectedTo, from: selectedForm },
        onSelect,
      };
    }
    return {};
  }, [mode, selected, selectedTo, selectedForm, onSelect]);

  const valueButton = useMemo((): ReactNode => {
    if (isPlaceholder) {
      return <span>{placeholder}</span>;
    }
    if (mode === "single" && selected) {
      return format(selected, formatStr, { locale: vi });
    } else if (mode === "range" && selectedForm) {
      return `${format(selectedForm, formatStr, { locale: vi })}${selectedTo ? ` - ${format(selectedTo, formatStr, { locale: vi })}` : ""}`.trim();
    }
  }, [
    selected,
    formatStr,
    placeholder,
    isPlaceholder,
    mode,
    selectedForm,
    selectedTo,
  ]);

  const handleSingleChange = (date: Date | null) => {
    onSelect?.(date || undefined);
    onClose();
  };

  const handleRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    if (mode === 'range') {
      const rangeValue: DateRange = { from: start || undefined, to: end || undefined };
      onSelect?.(rangeValue);
    }
    if (start && end) {
      onClose();
    }
  };

  const calendarDays = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    const days = eachDayOfInterval({ start, end });

    // Thêm ngày từ tháng trước để fill đầy hàng
    let startDay = start.getDay();
    if (startDay === 0) startDay = 7;
    const prevDays: Date[] = [];
    for (let i = startDay - 1; i > 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i);
      prevDays.push(d);
    }

    return [...prevDays, ...days];
  }, [viewDate]);

  const currentMonth = getMonth(viewDate);
  const currentYear = getYear(viewDate);

  // Size-based styles
  const sizeStyles = {
    sm: {
      button: "h-7 px-2 text-[10px]",
      icon: "h-3 w-3 mr-1.5",
      calendar: "p-2 w-[260px]",
      header: "mb-2",
      headerText: "text-[10px]",
      navIcon: "w-3 h-3",
      weekday: "text-[9px] py-0.5",
      weekdayGrid: "gap-0 mb-1",
      dayGrid: "gap-0",
      day: "w-7 h-7 text-[10px]",
    },
    md: {
      button: "h-8 px-2.5 text-xs",
      icon: "h-3.5 w-3.5 mr-1.5",
      calendar: "p-3 w-[280px]",
      header: "mb-2.5",
      headerText: "text-xs",
      navIcon: "w-3.5 h-3.5",
      weekday: "text-[10px] py-1",
      weekdayGrid: "gap-0.5 mb-1.5",
      dayGrid: "gap-0.5",
      day: "w-8 h-8 text-xs",
    },
    lg: {
      button: "h-9 px-3 text-sm",
      icon: "h-4 w-4 mr-2",
      calendar: "p-4 w-[300px]",
      header: "mb-3",
      headerText: "text-sm",
      navIcon: "w-4 h-4",
      weekday: "text-xs py-1",
      weekdayGrid: "gap-1 mb-2",
      dayGrid: "gap-1",
      day: "w-9 h-9 text-sm",
    },
  };

  const styles = sizeStyles[size];

  const triggerButton = (
    <button
      id={selectId}
      type="button"
      ref={buttonRef}
      className={cn(
        "flex items-center w-full rounded-md border border-input bg-background transition-colors hover:border-[#827BF2] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20",
        styles.button,
        isPlaceholder && "text-muted-foreground",
        buttonClassName,
      )}
      onClick={() => onOpenChange(!isOpen)}
    >
      <PiCalendarDots className={cn("text-[#5A607F]", styles.icon)} />
      <span
        className={cn("truncate", isPlaceholder && "text-muted-foreground")}
      >
        {valueButton}
      </span>
    </button>
  );

  const calendarPopup = (
    <div className={cn("absolute z-50 bg-white rounded-lg border shadow-lg overflow-hidden mt-1", styles.calendar, positionClassName)}>
      {/* Header: Month/Year với navigation */}
      <div className={cn("flex items-center justify-between", styles.header)}>
        <button
          type="button"
          onClick={() => setViewDate(subMonths(viewDate, 1))}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronUp className={cn("text-[#5A607F]", styles.navIcon)} />
        </button>

        <div className="flex items-center gap-1">
          <span className={cn("font-medium text-[#1A1D2E]", styles.headerText)}>
            {MONTHS_VI[currentMonth]}
          </span>
          <span className={cn("font-medium text-[#1A1D2E]", styles.headerText)}>
            {currentYear}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setViewDate(addMonths(viewDate, 1))}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronDown className={cn("text-[#5A607F]", styles.navIcon)} />
        </button>
      </div>

      {/* Weekdays header */}
      <div className={cn("grid grid-cols-7", styles.weekdayGrid)}>
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className={cn("text-center font-medium text-[#5A607F]", styles.weekday)}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className={cn("grid grid-cols-7", styles.dayGrid)}>
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = getMonth(day) === currentMonth;
          const isSelected = selected && isSameDay(day, selected);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (mode === "single") {
                  handleSingleChange(day);
                } else {
                  handleRangeChange([day, null]);
                }
              }}
              className={cn(
                "rounded-md transition-colors",
                styles.day,
                isCurrentMonth
                  ? "text-[#1A1D2E] hover:bg-[#827BF2]/10"
                  : "text-[#C4C4C4]",
                isSelected && "bg-[#827BF2] text-white hover:bg-[#827BF2]",
                isToday && !isSelected && "border border-[#827BF2]",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {contentFooter}
    </div>
  );

  // Simple variant: không có wrapper
  if (variant === "simple") {
    return (
      <>
        <input
          type="hidden"
          name={name || ""}
          value={selected ? selected.toISOString() : ""}
        />
        <div className={cn("relative", positionClassName)} ref={containerRef}>
          {triggerButton}
          {isOpen && calendarPopup}
        </div>
      </>
    );
  }

  // Default variant: có wrapper
  return (
    <>
      <input
        type="hidden"
        name={name || ""}
        value={selected ? selected.toISOString() : ""}
      />
      <WapperField
        label={label}
        required={required}
        msgError={msgError}
        classWapper={classWapper}
      >
        <div className={cn("grid gap-2 w-full")}>
          <div className="relative" ref={containerRef}>
            {triggerButton}
            {isOpen && calendarPopup}
          </div>
        </div>
      </WapperField>
    </>
  );
};
