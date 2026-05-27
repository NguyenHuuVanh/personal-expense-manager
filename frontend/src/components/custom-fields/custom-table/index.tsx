"use client";

import { useState, useMemo, useCallback } from "react";
import type { Column, CustomTableProps, SortConfig, FilterConfig, PaginationConfig, TableActions } from "@/types/table";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  SlidersHorizontal,
  Settings,
  MoreHorizontal,
  Plus,
  Trash2,
  Download,
} from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/shadcn-ui/popover";
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/shadcn-ui/pagination";

// =====================
// Types
// =====================
interface TableHeaderAction {
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive";
  onClick?: () => void;
  disabled?: boolean;
}

interface TableBadge {
  label: string;
  variant?: "default" | "secondary" | "success" | "warning" | "destructive";
}

// =====================
// Sort Icon Component
// =====================
interface SortIconProps {
  sorted: "asc" | "desc" | null;
  className?: string;
}

function SortIcon({ sorted, className }: SortIconProps) {
  if (sorted === "asc") {
    return <ChevronUp className={cn("w-4 h-4", className)} />;
  }
  if (sorted === "desc") {
    return <ChevronDown className={cn("w-4 h-4", className)} />;
  }
  return <ChevronsUpDown className={cn("w-3.5 h-3.5 opacity-40", className)} />;
}

// =====================
// Badge Component
// =====================
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "destructive";
  className?: string;
}

function Badge({ children, variant = "default", className }: BadgeProps) {
  const variantStyles = {
    default: "bg-[#827BF2]/10 text-[#827BF2]",
    secondary: "bg-[#F8F9FB] text-[#5A607F]",
    success: "bg-[#21AE5A]/10 text-[#21AE5A]",
    warning: "bg-[#F5A623]/10 text-[#F5A623]",
    destructive: "bg-[#E40127]/10 text-[#E40127]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

// =====================
// Card Header Component
// =====================
interface BadgeActiveFilter {
  count: number;
}

interface CardHeaderProps {
  title?: string;
  badge?: TableBadge;
  badgeActiveFilter?: BadgeActiveFilter;
  supportingText?: string;
  actions?: TableHeaderAction[];
  customActions?: React.ReactNode;
  onDelete?: () => void;
  isDeleting?: boolean;
  selectedCount?: number;
  onFilter?: () => void;
  onFilterClear?: () => void;
  filterButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onExport?: () => void;
  showActions?: boolean;
  sortOptions?: { value: string; label: string }[];
  sortValue?: string;
  onSortValueChange?: (value: string) => void;
  // Search props
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
  // Filter popover state
  filterPanel?: React.ReactNode;
}

function CardHeader({
  title,
  badge,
  badgeActiveFilter,
  supportingText,
  actions,
  customActions,
  onDelete,
  isDeleting = false,
  selectedCount = 0,
  onFilter,
  onFilterClear,
  filterButtonRef,
  onExport,
  showActions = true,
  sortOptions,
  sortValue,
  onSortValueChange,
  searchValue,
  searchPlaceholder = "Tìm kiếm...",
  onSearchChange,
  showSearch = false,
  filterPanel,
}: CardHeaderProps) {
  return (
    <div className="px-6 py-4 border-b rounded-none border-[#ECEEF5]">
      {/* Top row: Title + Actions + Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Title and supporting text */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {title && <h2 className="text-base font-semibold text-[#1A1D2E]">{title}</h2>}
            {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
            {badgeActiveFilter && (
              <Badge variant="default" className="bg-[#827BF2] text-white">
                {badgeActiveFilter.count} filter
              </Badge>
            )}
          </div>
          {supportingText && <p className="text-sm text-[#9EA3B8]">{supportingText}</p>}
        </div>

        {/* Right: Search + Action buttons (cùng hàng) */}
        {showActions && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Search Input */}
            {showSearch && (
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A607F]" />
                <input
                  type="text"
                  value={searchValue || ""}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearchChange?.(searchValue || "")}
                  placeholder={searchPlaceholder}
                  className="w-full h-9 pl-10 pr-4 rounded-lg border border-[#E0E3EC] bg-white text-sm text-[#1A1D21] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20 focus:border-[#827BF2] transition-all"
                />
                {searchValue && (
                  <button
                    onClick={() => onSearchChange?.("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#F4F5F7] rounded"
                  >
                    <X className="w-3.5 h-3.5 text-[#5A607F]" />
                  </button>
                )}
              </div>
            )}

            {/* Custom actions */}
            {customActions}

            {/* Built-in actions */}
            {onDelete && selectedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                disabled={isDeleting}
                className="gap-1.5 h-9 px-3 border-[#ECEEF5] text-[#E40127] hover:bg-red-50"
              >
                {isDeleting ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Xóa{selectedCount > 0 ? ` (${selectedCount})` : ""}</span>
              </Button>
            )}

            {/* Filter Button with Popover */}
            {onFilter && (
              <Popover
                onOpenChange={(open) => {
                  if (!open) onFilter?.();
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    ref={filterButtonRef}
                    variant={badgeActiveFilter ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilter()}
                    className={cn(
                      "gap-1.5 h-9 px-3 transition-all",
                      badgeActiveFilter
                        ? "bg-[#827BF2] hover:bg-[#6B5FE2] text-white border-[#827BF2]"
                        : "border-[#ECEEF5] text-[#5A607F] hover:bg-[#F8F9FB] hover:text-[#1A1D2E]",
                    )}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">{badgeActiveFilter ? "Lọc" : "Lọc"}</span>
                    {badgeActiveFilter && onFilterClear && (
                      <X
                        className="w-3.5 h-3.5 ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFilterClear();
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[700px] max-h-[80vh] overflow-y-auto p-0" sideOffset={8}>
                  {filterPanel}
                </PopoverContent>
              </Popover>
            )}

            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="gap-1.5 h-9 px-3 border-[#ECEEF5] text-[#5A607F] hover:bg-[#F8F9FB] hover:text-[#1A1D2E]"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Xuất</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =====================
import { TablePagination } from "@/components/ui/table-pagination";

// =====================
// Row Actions Dropdown
// =====================
interface RowActionsProps<T> {
  row: T;
  actions: TableActions<T>[];
}

function RowActions<T>({ row, actions }: RowActionsProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleActions = actions.filter((a) => !a.hidden?.(row));

  if (visibleActions.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-md hover:bg-[#F2F4F8] transition-colors"
      >
        <Settings className="w-4 h-4 text-[#5A607F]" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div className="absolute right-0 top-full mt-1 z-[9999] bg-white border border-[#E0E3EC] rounded-lg shadow-lg py-1 min-w-[140px]">
            {visibleActions.map((action, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(row);
                  setIsOpen(false);
                }}
                disabled={action.disabled?.(row)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                  action.disabled?.(row) ? "opacity-50 cursor-not-allowed" : "hover:bg-[#F8F9FB]",
                  action.variant === "danger" && "text-[#E40127]",
                  action.variant === "success" && "text-[#21AE5A]",
                  action.variant === "primary" && "text-[#827BF2] font-medium",
                  !action.variant && "text-[#5A607F]",
                )}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// =====================
// Empty State Component
// =====================
interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

function EmptyState({ message = "Không có dữ liệu", icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-[#F2F4F8] flex items-center justify-center mb-3">
        {icon || <Search className="w-5 h-5 text-[#9EA3B8]" />}
      </div>
      <p className="text-sm text-[#5A607F]">{message}</p>
    </div>
  );
}

// =====================
// Skeleton Loader
// =====================
interface SkeletonProps {
  rows?: number;
  columns?: number;
}

function Skeleton({ rows = 5, columns = 4 }: SkeletonProps) {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex gap-4 px-6 py-3 border-b border-[#ECEEF5] bg-[#FAFBFC]">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`header-${i}`} className="h-3.5 bg-[#E0E3EC] rounded" style={{ width: `${100 / columns}%` }} />
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`row-${rowIdx}`} className="flex gap-4 px-6 py-4 border-b border-[#F2F4F8]">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={`cell-${rowIdx}-${colIdx}`}
              className="h-3.5 bg-[#E0E3EC] rounded"
              style={{ width: `${100 / columns}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// =====================
// Main CustomTable Component
// =====================
export function CustomTable<T extends { _id?: string | number }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "Không có dữ liệu",
  isSelectable = false,
  selectedIds = [],
  onSelectionChange,
  onRowClick,
  rowActions,
  rowActionsPosition = "end",
  showFilters = false,
  filterOptions = [],
  onFilterChange,
  showSort = false,
  sortConfig,
  onSortChange,
  showPagination = false,
  pagination,
  onPageChange,
  paginationPosition = { top: false, bottom: true },
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  bodyHeight,
  className,
  tableClassName,
  scrollClassName,
  hideHeader = false,
  showSkeleton = false,
  skeletonRows = 5,
  rowHover = true,
  rowBordered = true,
  cellBordered = false,
  zebraStriped = false,
  compact = false,
  responsive = true,
  stickyHeader = false,
  footer,
  title,
  badge,
  badgeActiveFilter,
  supportingText,
  headerActions,
  onDelete,
  isDeleting = false,
  selectedCount = 0,
  onFilter,
  onFilterClear,
  filterButtonRef,
  onExport,
  showCardHeader = true,
  sortOptions,
  sortValue,
  onSortValueChange,
  // Search props
  searchValue,
  searchPlaceholder = "Tìm kiếm...",
  onSearchChange,
  showSearch = false,
  filterPanel,
  enableHorizontalScroll = false,
  tableMinWidth,
}: CustomTableProps<T>) {
  // Local state for filters and selection
  const [localFilters, setLocalFilters] = useState<FilterConfig[]>(filterOptions);
  const [localSelectedIds, setLocalSelectedIds] = useState<(string | number)[]>(selectedIds);
  const [localSort, setLocalSort] = useState<SortConfig<T> | null>(sortConfig || null);

  // Internal pagination state
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(pageSizeOptions[0] || 10);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return localFilters.some((f) => f.value && String(f.value).length > 0);
  }, [localFilters]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (filters: FilterConfig[]) => {
      setLocalFilters(filters);
      onFilterChange?.(filters);
    },
    [onFilterChange],
  );

  // Handle clear all filters
  const handleClearFilters = useCallback(() => {
    const clearedFilters = localFilters.map((f) => ({ ...f, value: null }));
    setLocalFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  }, [localFilters, onFilterChange]);

  // Handle sort
  const handleSort = useCallback(
    (column: Column<T>) => {
      if (!column.sortable) return;

      const key = column.accessorKey || (column.key as keyof T);
      let newDirection: "asc" | "desc" | null = "asc";

      if (localSort && localSort.key === key) {
        if (localSort.direction === "asc") newDirection = "desc";
        else if (localSort.direction === "desc") newDirection = null;
      }

      const newSort = newDirection ? { key, direction: newDirection } : null;
      setLocalSort(newSort as SortConfig<T> | null);
      onSortChange?.(newSort as SortConfig<T> | null);
    },
    [localSort, onSortChange],
  );

  // Handle row click
  const handleRowClick = useCallback(
    (row: T, rowIndex: number, e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-row-action]")) return;
      onRowClick?.(row, rowIndex);
    },
    [onRowClick],
  );

  // Handle select row
  const handleSelectRow = useCallback(
    (id: string | number) => {
      const newSelected = localSelectedIds.includes(id)
        ? localSelectedIds.filter((i) => i !== id)
        : [...localSelectedIds, id];
      setLocalSelectedIds(newSelected);
      onSelectionChange?.(newSelected);
    },
    [localSelectedIds, onSelectionChange],
  );

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!localSort || !showSort) return data;

    return [...data].sort((a, b) => {
      const aVal = a[localSort.key as keyof T];
      const bVal = b[localSort.key as keyof T];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return localSort.direction === "asc" ? comparison : -comparison;
    });
  }, [data, localSort, showSort]);

  // Apply filtering
  const filteredData = useMemo(() => {
    if (!hasActiveFilters) return sortedData;

    return sortedData.filter((row) => {
      return localFilters.every((filter) => {
        if (!filter.value) return true;
        const cellValue = String(row[filter.key as keyof T] || "").toLowerCase();
        const filterValue = String(filter.value).toLowerCase();
        return cellValue.includes(filterValue);
      });
    });
  }, [sortedData, localFilters, hasActiveFilters]);

  // Computed pagination
  const computedPagination: PaginationConfig | undefined = useMemo(() => {
    if (pagination) {
      // Use external pagination if provided
      const total = filteredData.length;
      return {
        page: pagination.page || 1,
        pageSize: pagination.pageSize || internalPageSize,
        total,
        totalPages: Math.ceil(total / (pagination.pageSize || internalPageSize)),
      };
    }
    if (showPagination) {
      // Use internal pagination
      const total = filteredData.length;
      return {
        page: internalPage,
        pageSize: internalPageSize,
        total,
        totalPages: Math.ceil(total / internalPageSize),
      };
    }
    return undefined;
  }, [showPagination, pagination, filteredData.length, internalPage, internalPageSize]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!computedPagination) return filteredData;
    const start = (computedPagination.page - 1) * computedPagination.pageSize;
    const end = start + computedPagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, computedPagination]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    const allIds = paginatedData.map((row) => row._id!);
    const newSelected = localSelectedIds.length === paginatedData.length ? [] : allIds;
    setLocalSelectedIds(newSelected);
    onSelectionChange?.(newSelected);
  }, [paginatedData, localSelectedIds, onSelectionChange]);

  // Pagination handlers
  const handlePageChange = useCallback(
    (page: number) => {
      if (pagination) {
        // External pagination
        onPageChange?.(page);
      } else {
        // Internal pagination
        setInternalPage(page);
      }
    },
    [onPageChange, pagination],
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      if (pagination) {
        // External pagination
        onPageSizeChange?.(size);
      } else {
        // Internal pagination
        setInternalPageSize(size);
        setInternalPage(1);
      }
    },
    [onPageSizeChange, pagination],
  );

  // Get align class
  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  // Compact styles
  const paddingClass = compact ? "px-4 py-2" : "px-6 py-4";
  const headerPaddingClass = compact ? "px-4 py-2.5" : "px-6 py-3";

  // Cell and row borders
  const borderClass = rowBordered ? "border-b border-[#F2F4F8]" : "";

  // Selection state for "select all" checkbox
  const currentPageIds = paginatedData.map((row) => row._id!);
  const selectedOnCurrentPage = currentPageIds.filter((id) => localSelectedIds.includes(id));
  const isAllSelected = paginatedData.length > 0 && selectedOnCurrentPage.length === paginatedData.length;
  const isIndeterminate = selectedOnCurrentPage.length > 0 && selectedOnCurrentPage.length < paginatedData.length;

  // Loading state
  if (isLoading || showSkeleton) {
    return (
      <div className={cn("bg-white rounded-xl border border-[#E0E3EC] shadow-sm overflow-hidden", className)}>
        {showCardHeader && (title || badge || onDelete || onFilter || onExport) && (
          <CardHeader title={title} badge={badge} supportingText={supportingText} showActions={false} />
        )}
        <Skeleton rows={skeletonRows} columns={columns.length} />
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl border border-[#E0E3EC] shadow-sm w-full relative", className)}>
      {/* Card Header */}
      {showCardHeader &&
        (title || badge || onDelete || onFilter || onExport || headerActions || showSearch || filterPanel) && (
          <div className="border-b border-[#ECEEF5]">
            <CardHeader
              title={title}
              badge={badge}
              badgeActiveFilter={badgeActiveFilter}
              supportingText={supportingText}
              customActions={headerActions}
              onDelete={onDelete}
              isDeleting={isDeleting}
              selectedCount={selectedCount}
              onFilter={onFilter}
              onFilterClear={onFilterClear}
              filterButtonRef={filterButtonRef}
              onExport={onExport}
              sortOptions={sortOptions}
              sortValue={sortValue}
              onSortValueChange={onSortValueChange}
              // Search props
              searchValue={searchValue}
              searchPlaceholder={searchPlaceholder}
              onSearchChange={onSearchChange}
              showSearch={showSearch}
              // Filter panel
              filterPanel={filterPanel}
            />
          </div>
        )}

      {/* Top Pagination */}
      {showPagination && paginationPosition.top && computedPagination && (
        <div className="border-b border-[#ECEEF5]">
          <TablePagination
            {...computedPagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={pageSizeOptions}
            position="top"
          />
        </div>
      )}

      {/* Table Header - Fixed outside scroll */}
      {!hideHeader && (
        <div className={cn("overflow-hidden", bodyHeight && enableHorizontalScroll ? "overflow-x-auto" : "")}>
          <table
            className={cn("border-collapse w-full", tableClassName)}
            style={{
              tableLayout: "auto",
              minWidth: enableHorizontalScroll ? (tableMinWidth ?? "800px") : undefined,
            }}
          >
            <colgroup>
              {isSelectable && <col className="w-14 shrink-0" />}
              {columns.map((col) => (
                <col key={col.key} style={{ width: col.width }} />
              ))}
            </colgroup>
            <thead className="bg-[#FAFBFC] border-b border-[#ECEEF5] shadow-sm sticky top-0 z-10">
              <tr>
                {isSelectable && (
                  <th className={cn("w-14 shrink-0", headerPaddingClass)}>
                    <Checkbox
                      checked={isAllSelected}
                      isIndeterminate={isIndeterminate}
                      onCheckedChange={handleSelectAll}
                      aria-label="Chọn tất cả"
                    />
                  </th>
                )}
                {columns.map((column, colIdx) => (
                  <th
                    key={column.key}
                    className={cn(
                      "text-xs font-semibold text-[#5A607F] uppercase tracking-wide whitespace-nowrap",
                      headerPaddingClass,
                      getAlignClass(column.align),
                      column.sortable && showSort && "cursor-pointer select-none hover:bg-[#F2F4F8]",
                      column.headerClassName,
                    )}
                    style={{ width: column.width, ...column.headerStyle }}
                    onClick={() => handleSort(column)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-1.5",
                        column.align === "right" && "justify-end",
                        column.align === "center" && "justify-center",
                      )}
                    >
                      {column.header}
                      {column.sortable && showSort && (
                        <SortIcon
                          sorted={localSort?.key === (column.accessorKey || column.key) ? localSort.direction : null}
                          className={cn(
                            column.align === "right" && "order-2",
                            column.align === "center" && "order-1",
                          )}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
      )}

      {/* Table Body Container - With Scroll */}
      <div
        className={cn(
          enableHorizontalScroll && "overflow-x-auto",
          bodyHeight ? "overflow-y-auto" : "",
          scrollClassName
        )}
        style={bodyHeight ? { maxHeight: bodyHeight } : undefined}
      >
        <table
          className={cn("border-collapse w-full", tableClassName)}
          style={{
            tableLayout: "auto",
            minWidth: enableHorizontalScroll ? (tableMinWidth ?? "800px") : undefined,
          }}
        >
          <colgroup>
            {isSelectable && <col className="w-14 shrink-0" />}
            {columns.map((col) => (
              <col key={col.key} style={{ width: col.width }} />
            ))}
          </colgroup>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (isSelectable ? 1 : 0)} className="text-center py-12">
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const isSelected = localSelectedIds.includes(row._id!);
                const isEven = zebraStriped && rowIndex % 2 === 0;

                return (
                  <tr
                    key={row._id}
                    data-row-id={row._id}
                    onClick={(e) => handleRowClick(row, rowIndex, e)}
                    className={cn(
                      borderClass,
                      isSelected && "bg-[#EAE8FD]/30",
                      isEven && !isSelected && "bg-[#FAFBFC]",
                      rowHover && !isSelected && "hover:bg-[#FAFBFC]",
                      onRowClick && "cursor-pointer",
                      "transition-colors",
                    )}
                  >
                    {isSelectable && (
                      <td className={cn(paddingClass, "flex items-center justify-center")}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectRow(row._id!)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Chọn hàng ${rowIndex + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn("text-sm text-[#1A1D2E]", paddingClass, "align-middle", getAlignClass(column.align), column.cellClassName)}
                        style={{ width: column.width, boxSizing: "border-box", ...column.cellStyle }}
                      >
                        {column.render ? column.render(row, rowIndex) : String(row[column.key as keyof T] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination */}
      {showPagination && paginationPosition.bottom && computedPagination && (
        <div className="border-t border-[#ECEEF5]">
          <TablePagination
            {...computedPagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={pageSizeOptions}
            position="bottom"
          />
        </div>
      )}
    </div>
  );
}

export * from "@/types/table";
