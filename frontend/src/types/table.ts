/**
 * Custom Table Types
 * Định nghĩa types cho CustomTable component
 */

import type { ReactNode, CSSProperties } from "react";

// =====================
// Column Definitions
// =====================

export type ColumnAlign = "left" | "center" | "right";
export type ColumnSortable = boolean;

export interface ColumnFilter {
  key: string;
  label: string;
  type?: "text" | "select" | "date" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface Column<T = unknown> {
  /** Key để map data - dùng cho accessorKey hoặc custom render */
  key: string;
  /** Header text hiển thị ở cột */
  header: string;
  /** Độ rộng cột (px hoặc %) */
  width?: number | string;
  /** Alignment của content trong cột */
  align?: ColumnAlign;
  /** Có sortable không */
  sortable?: ColumnSortable;
  /** Fixed column (left | right) */
  fixed?: "left" | "right";
  /** Thuộc tính của data (dùng cho sort tự động) */
  accessorKey?: keyof T;
  /** Custom render cell - nhận row data và row index */
  render?: (row: T, rowIndex: number) => ReactNode;
  /** Custom class cho header cell */
  headerClassName?: string;
  /** Custom class cho body cell */
  cellClassName?: string;
  /** Custom style cho header cell */
  headerStyle?: CSSProperties;
  /** Custom style cho body cell */
  cellStyle?: CSSProperties;
  /** Ẩn cột này trên mobile */
  hideOnMobile?: boolean;
}

// =====================
// Table Data & Row
// =====================

export type RowId<T = unknown> = T extends { _id: infer U } ? U : string | number;

export interface TableRow<T = unknown> {
  _id: string | number;
  [key: string]: unknown;
}

// =====================
// Sort & Filter
// =====================

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig<T = unknown> {
  key: keyof T;
  direction: SortDirection;
}

export interface FilterConfig {
  key: string;
  value: string | string[] | { from?: string; to?: string } | null;
}

export interface FilterOption {
  value: string;
  label: string;
}

// =====================
// Pagination
// =====================

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationPosition {
  top: boolean;
  bottom: boolean;
}

// =====================
// Selection
// =====================

export interface SelectionConfig<T = unknown> {
  selectedIds: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  isSelectable?: boolean;
}

// =====================
// Table Props
// =====================

export interface TableActions<T = unknown> {
  icon?: ReactNode;
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "primary" | "danger" | "success";
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

export interface CustomTableProps<T = unknown> {
  /** Dữ liệu hiển thị */
  data: T[];
  /** Định nghĩa các cột */
  columns: Column<T>[];
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Hiển thị checkbox chọn nhiều dòng */
  isSelectable?: boolean;
  /** Các dòng đã chọn */
  selectedIds?: (string | number)[];
  /** Callback khi selection thay đổi */
  onSelectionChange?: (ids: (string | number)[]) => void;
  /** Row click handler */
  onRowClick?: (row: T, rowIndex: number) => void;
  /** Action buttons cho mỗi dòng */
  rowActions?: TableActions<T>[];
  /** Vị trí action buttons */
  rowActionsPosition?: "start" | "end";
  /** Hiển thị filter header */
  showFilters?: boolean;
  /** Các filter có sẵn */
  filterOptions?: FilterConfig[];
  /** Callback khi filter thay đổi */
  onFilterChange?: (filters: FilterConfig[]) => void;
  /** Hiển thị sort controls */
  showSort?: boolean;
  /** Sort hiện tại */
  sortConfig?: SortConfig<T>;
  /** Callback khi sort thay đổi */
  onSortChange?: (sort: SortConfig<T> | null) => void;
  /** Hiển thị pagination */
  showPagination?: boolean;
  /** Pagination config */
  pagination?: PaginationConfig;
  /** Callback khi page thay đổi */
  onPageChange?: (page: number) => void;
  /** Vị trí pagination */
  paginationPosition?: PaginationPosition;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Callback khi page size thay đổi */
  onPageSizeChange?: (size: number) => void;
  /** Chiều cao cố định của table body (px) - để scroll nội bộ */
  bodyHeight?: number;
  /** Custom class cho container */
  className?: string;
  /** Custom class cho table */
  tableClassName?: string;
  /** Custom class cho scroll container (div bọc table, nơi overflow-x/y-auto được áp dụng) */
  scrollClassName?: string;
  /** Ẩn tiêu đề cột */
  hideHeader?: boolean;
  /** Hiệu ứng loading skeleton */
  showSkeleton?: boolean;
  /** Số dòng skeleton */
  skeletonRows?: number;
  /** Dòng có thể hover */
  rowHover?: boolean;
  /** Border giữa các dòng */
  rowBordered?: boolean;
  /** Border giữa các cột */
  cellBordered?: boolean;
  /** Zebra striping cho rows */
  zebraStriped?: boolean;
  /** Compact mode - giảm padding */
  compact?: boolean;
  /** Responsive - cho phép scroll ngang trên mobile */
  responsive?: boolean;
  /** Sticky header khi scroll */
  stickyHeader?: boolean;
  /** Custom footer */
  footer?: ReactNode;
  /** Title hiển thị trên table */
  title?: string;
  /** Badge hiển thị cạnh title */
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "success" | "warning" | "destructive";
  };
  /** Badge hiển thị số filter đang active */
  badgeActiveFilter?: {
    count: number;
  };
  /** Supporting text bên dưới title */
  supportingText?: string;
  /** Search input value */
  searchValue?: string;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Callback khi search thay đổi */
  onSearchChange?: (value: string) => void;
  /** Hiển thị search input trong header */
  showSearch?: boolean;
  /** Actions header (button, dropdown...) */
  headerActions?: ReactNode;
  /** Callback khi click nút Xóa */
  onDelete?: () => void;
  /** Loading state khi đang xóa */
  isDeleting?: boolean;
  /** Số lượng đã chọn để hiển thị trên nút xóa */
  selectedCount?: number;
  /** Callback khi click nút Lọc */
  onFilter?: () => void;
  /** Callback khi click nút Xóa filter (trong button) */
  onFilterClear?: () => void;
  /** Ref cho filter button (để position panel) */
  filterButtonRef?: React.RefObject<HTMLButtonElement | null>;
  /** Callback khi click nút Xuất */
  onExport?: () => void;
  /** Hiển thị Card Header */
  showCardHeader?: boolean;
  /** Tùy chọn sort dropdown */
  sortOptions?: {
    value: string;
    label: string;
  }[];
  /** Giá trị sort hiện tại */
  sortValue?: string;
  /** Callback khi sort value thay đổi */
  onSortValueChange?: (value: string) => void;
  /** Render custom filter panel bên dưới header */
  filterPanel?: ReactNode;
  /** Filter panel đang mở */
  isFilterOpen?: boolean;
  /** Bật scroll ngang khi độ rộng cột vượt container */
  enableHorizontalScroll?: boolean;
  /** Chiều rộng tối thiểu của table (khi enableHorizontalScroll=true) */
  tableMinWidth?: string;
}

// =====================
// Filter Component Types
// =====================

export interface FilterBarProps<T = unknown> {
  columns: Column<T>[];
  filters: FilterConfig[];
  onFilterChange: (filters: FilterConfig[]) => void;
  onClearAll?: () => void;
}

// =====================
// Sort Component Types
// =====================

export interface SortIconProps {
  sorted: SortDirection;
  sortable?: boolean;
}

// =====================
// Pagination Component Types
// =====================

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  className?: string;
}

// =====================
// Empty State
// =====================

export interface TableEmptyStateProps {
  message?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}
