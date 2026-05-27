export const CHART_PERIOD_OPTIONS = {
  bar: [
    { value: "thisMonth", label: "Tháng này" },
    { value: "lastMonth", label: "Tháng trước" },
  ] as const,
  sub: {
    thisWeek: [
      { value: "day", label: "Ngày" },
    ],
    thisMonth: [
      { value: "day", label: "Ngày" },
      { value: "week", label: "Tuần" },
    ],
    thisQuarter: [
      { value: "day", label: "Ngày" },
      { value: "week", label: "Tuần" },
      { value: "month", label: "Tháng" },
    ],
    thisYear: [
      { value: "day", label: "Ngày" },
      { value: "week", label: "Tuần" },
      { value: "month", label: "Tháng" },
      { value: "quarter", label: "Quý" },
    ],
    custom: [
      { value: "day", label: "Ngày" },
    ],
  } as const,
} as const;

export type MainPeriod = keyof typeof CHART_PERIOD_OPTIONS.sub;
export type SubPeriod = "day" | "week" | "month" | "quarter" | "thisWeek";
