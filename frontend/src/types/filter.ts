// Simple Filter Types - Đơn giản hóa

// Simple operator chỉ gồm những cái cần thiết
export type SimpleOperator =
  | "equals"           // Bằng
  | "not_equals"       // Không bằng
  | "contains"         // Chứa (text)
  | "greater_than"     // Lớn hơn (number/date)
  | "less_than"        // Nhỏ hơn (number/date)
  | "between"          // Giữa (number/date)
  | "is_empty"         // Trống
  | "is_not_empty";    // Không trống

// Field type cơ bản
export type SimpleFieldType = "text" | "number" | "date" | "select";

// Định nghĩa một filter field
export interface SimpleFilterField {
  key: string;
  label: string;
  type: SimpleFieldType;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  icon?: React.ComponentType<{ className?: string }>;
}

// Một điều kiện filter
export interface SimpleFilterCondition {
  id: string;
  field: string;
  operator: SimpleOperator;
  value: string | number | null;
  valueTo?: string | number | null; // Cho between
}

// Filter field type (cho FilterBuilder)
export type FilterFieldType = SimpleFieldType;

// Filter condition (cho FilterBuilder)
export type FilterCondition = SimpleFilterCondition;

// Operators theo từng loại field (chỉ những cái phù hợp)
export const SIMPLE_OPERATORS_BY_TYPE: Record<SimpleFieldType, SimpleOperator[]> = {
  text: ["equals", "not_equals", "contains", "is_empty", "is_not_empty"],
  number: ["equals", "not_equals", "greater_than", "less_than", "between", "is_empty", "is_not_empty"],
  date: ["equals", "greater_than", "less_than", "between", "is_empty", "is_not_empty"],
  select: ["equals", "not_equals", "is_empty", "is_not_empty"],
};

// OPERATORS_BY_TYPE (alias cho FilterBuilder)
export const OPERATORS_BY_TYPE: Record<FilterFieldType, SimpleOperator[]> = SIMPLE_OPERATORS_BY_TYPE;

// Labels cho operators
export const OPERATOR_LABELS: Record<SimpleOperator, string> = {
  equals: "Bằng",
  not_equals: "Không bằng",
  contains: "Chứa",
  greater_than: "Lớn hơn",
  less_than: "Nhỏ hơn",
  between: "Giữa",
  is_empty: "Trống",
  is_not_empty: "Không trống",
};

// Props cho FilterBar component
export interface FilterBarProps {
  fields: SimpleFilterField[];
  filters: SimpleFilterCondition[];
  searchValue: string;
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: SimpleFilterCondition[]) => void;
  onApply: () => void;
}

// Props cho FilterBuilder component
export interface FilterBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  fields: SimpleFilterField[];
  filters: FilterCondition[];
  logic?: 'and' | 'or';
  onFiltersChange: (filters: FilterCondition[]) => void;
  onLogicChange: (logic: 'and' | 'or') => void;
  onApply: () => void;
  title?: string;
}

// Helper function to generate condition ID
export function generateConditionId(): string {
  return `cond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
