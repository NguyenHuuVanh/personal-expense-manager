export const PERIOD_OPTIONS = [
  { value: 'daily', label: 'Hàng ngày' },
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' },
] as const;

export type PeriodValue = (typeof PERIOD_OPTIONS)[number]['value'];
