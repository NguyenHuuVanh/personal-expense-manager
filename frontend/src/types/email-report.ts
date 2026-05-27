// Email Marketing Report Filter Types

export type ReportFilter = {
  period: "today" | "week" | "month" | "quarter" | "custom";
  start_date: string | null;
  end_date: string | null;
};

export const PERIOD_OPTIONS = [
  { value: "today", label: "Hôm nay" },
  { value: "week", label: "Tuần này" },
  { value: "month", label: "Tháng này" },
  { value: "quarter", label: "Quý này" },
  { value: "custom", label: "Tùy chỉnh" },
];
