import { Calendar, DollarSign, Tag, FileText } from "lucide-react";
import type { SimpleFilterField, SimpleFilterCondition } from "@/types/filter";

// Default categories for filter options (will be used as fallback)
const DEFAULT_CATEGORIES = [
  { _id: "cat-1", name: "Ăn uống" },
  { _id: "cat-2", name: "Di chuyển" },
  { _id: "cat-3", name: "Mua sắm" },
  { _id: "cat-4", name: "Sức khỏe" },
  { _id: "cat-5", name: "Giải trí" },
  { _id: "cat-6", name: "Khác" },
];

// Filter fields cho Transactions Table
export const TRANSACTION_FILTER_FIELDS: SimpleFilterField[] = [
  {
    key: "description",
    label: "Mô tả",
    type: "text",
    placeholder: "Tìm theo mô tả...",
    icon: FileText,
  },
  {
    key: "categoryId.name",
    label: "Danh mục",
    type: "select",
    options: DEFAULT_CATEGORIES.map((cat) => ({
      value: cat._id,
      label: cat.name,
    })),
    icon: Tag,
  },
  {
    key: "amount",
    label: "Số tiền",
    type: "number",
    placeholder: "Nhập số tiền...",
    icon: DollarSign,
  },
  {
    key: "date",
    label: "Ngày",
    type: "date",
    icon: Calendar,
  },
  {
    key: "type",
    label: "Loại giao dịch",
    type: "select",
    options: [
      { value: "income", label: "Thu nhập" },
      { value: "expense", label: "Chi tiêu" },
    ],
  },
];

// Apply filter lên data
export function applyTransactionFilters<T extends Record<string, any>>(
  data: T[],
  filters: SimpleFilterCondition[],
  searchValue: string = ""
): T[] {
  let result = data;

  // Apply search
  if (searchValue.trim()) {
    const search = searchValue.toLowerCase();
    result = result.filter((item) =>
      String(item.description || "").toLowerCase().includes(search)
    );
  }

  // Apply filters (AND logic)
  for (const filter of filters) {
    result = result.filter((item) => {
      const fieldValue = getNestedValue(item, filter.field);

      switch (filter.operator) {
        case "equals":
          return String(fieldValue ?? "") === String(filter.value);
        case "not_equals":
          return String(fieldValue ?? "") !== String(filter.value);
        case "contains":
          return String(fieldValue ?? "").toLowerCase().includes(String(filter.value ?? "").toLowerCase());
        case "greater_than":
          return Number(fieldValue) > Number(filter.value);
        case "less_than":
          return Number(fieldValue) < Number(filter.value);
        case "between":
          const num = Number(fieldValue);
          return num >= Number(filter.value) && num <= Number(filter.valueTo);
        case "is_empty":
          return fieldValue === null || fieldValue === undefined || fieldValue === "";
        case "is_not_empty":
          return fieldValue !== null && fieldValue !== undefined && fieldValue !== "";
        default:
          return true;
      }
    });
  }

  return result;
}

// Helper lấy nested value
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}
