export const PERIOD_OPTIONS = [
  { value: 'thisWeek', label: 'Tuần này' },
  { value: 'thisMonth', label: 'Tháng này' },
  { value: 'thisQuarter', label: 'Quý này' },
  { value: 'thisYear', label: 'Năm nay' },
] as const;

export type PeriodValue = typeof PERIOD_OPTIONS[number]['value'];

export const FILTER_TAG_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'income', label: 'Thu nhập' },
  { value: 'expense', label: 'Chi tiêu' },
  { value: 'transfer', label: 'Chuyển khoản' },
] as const;

export type FilterTagValue = typeof FILTER_TAG_OPTIONS[number]['value'];

export const DEFAULT_PERIOD = 'thisMonth';
export const DEFAULT_FILTER_TAG = 'all';
