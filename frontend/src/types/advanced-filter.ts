// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Advanced Filter Types — Config-driven filter system
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Các loại trường có thể lọc */
export type FieldType = 'text' | 'number' | 'date' | 'select' | 'relation' | 'boolean';

/** Tất cả operators có thể dùng */
export type FilterOperator
  // Text
  = 'eq' // bằng
    | 'neq' // khác
    | 'contains' // chứa
    | 'not_contains' // không chứa
    | 'starts_with' // bắt đầu bằng
    | 'ends_with' // kết thúc bằng
  // Number
    | 'gt' // lớn hơn
    | 'gte' // lớn hơn hoặc bằng
    | 'lt' // nhỏ hơn
    | 'lte' // nhỏ hơn hoặc bằng
    | 'between' // trong khoảng
  // Date
    | 'before' // trước ngày
    | 'after' // sau ngày
    | 'date_between' // trong khoảng thời gian
    | 'today' // hôm nay
    | 'this_week' // tuần này
    | 'this_month' // tháng này
    | 'last_7_days' // 7 ngày qua
    | 'last_30_days' // 30 ngày qua
  // Common
    | 'is_empty' // trống
    | 'is_not_empty' // không trống
  // Multi-select
    | 'in' // thuộc
    | 'not_in'; // không thuộc

/** Operator labels cho UI display */
export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  eq: 'bằng',
  neq: 'khác',
  contains: 'chứa',
  not_contains: 'không chứa',
  starts_with: 'bắt đầu bằng',
  ends_with: 'kết thúc bằng',
  gt: 'lớn hơn',
  gte: 'lớn hơn hoặc bằng',
  lt: 'nhỏ hơn',
  lte: 'nhỏ hơn hoặc bằng',
  between: 'trong khoảng',
  before: 'trước',
  after: 'sau',
  date_between: 'trong khoảng',
  today: 'hôm nay',
  this_week: 'tuần này',
  this_month: 'tháng này',
  last_7_days: '7 ngày qua',
  last_30_days: '30 ngày qua',
  is_empty: 'trống',
  is_not_empty: 'không trống',
  in: 'thuộc',
  not_in: 'không thuộc',
};

/** Operator icons / symbols cho UI */
export const OPERATOR_SYMBOLS: Partial<Record<FilterOperator, string>> = {
  eq: '=',
  neq: '≠',
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
  between: '↔',
  contains: '∋',
};

/** Operators mà không cần nhập value */
export const NO_VALUE_OPERATORS: FilterOperator[] = [
  'is_empty',
  'is_not_empty',
  'today',
  'this_week',
  'this_month',
  'last_7_days',
  'last_30_days',
];

/** Operators cần 2 giá trị (range) */
export const RANGE_OPERATORS: FilterOperator[] = ['between', 'date_between'];

/** Config cho 1 trường có thể lọc */
export type FilterFieldConfig = {
  key: string; // Field key gửi lên API (e.g. "status", "type")
  label: string; // Tên hiển thị (e.g. "Trạng thái")
  type: FieldType; // Loại trường
  group: string; // Nhóm (e.g. "Thông tin cơ bản", "Thời gian")
  icon?: string; // Icon cho field (optional)
  operators: FilterOperator[]; // Danh sách operators hỗ trợ
  options?: { value: string; label: string; avatarUrl?: string }[]; // Cho select type
  placeholder?: string; // Placeholder cho value input
  defaultOperator?: FilterOperator; // Operator mặc định
};

/** Config đầy đủ cho 1 module */
export type FilterModuleConfig = {
  moduleKey: string; // "kpi" | "leads" | "tasks" | ...
  label: string; // "KPI" | "Leads" | ...
  fields: FilterFieldConfig[];
};

/** 1 rule filter */
export type FilterRule = {
  id: string; // Unique ID
  field: string; // key từ FilterFieldConfig
  operator: FilterOperator;
  value: any; // string | number | Date | string[] | null
  value2?: any; // Cho range operators (between)
};

/** Grouping AND/OR */
export type FilterGroup = {
  logic: 'AND' | 'OR';
  rules: FilterRule[];
};

/** Preset đã lưu */
export type FilterPreset = {
  id: string;
  name: string;
  moduleKey: string;
  group: FilterGroup;
  createdAt: string;
  updatedAt: string;
};

/** Option cho select */
export interface IOptionSelect {
  value: string;
  label: string;
  disabled?: boolean;
  [key: string]: any;
}
