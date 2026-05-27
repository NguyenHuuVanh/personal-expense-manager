"use client";

import { SelectField } from "@/components/custom-fields/select-field";
import { ChevronLeft, ChevronRight, Dot, Ellipsis } from "lucide-react";
import { cn } from "@/utils/cn";

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  position?: "top" | "bottom";
}

function TablePagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  position = "bottom",
}: TablePaginationProps) {
  type PageItem = number | "...";

  const getPageNumbers = (): PageItem[] => {
    const pages: PageItem[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (page <= 4) {
        // Near start: 1, 2, 3, 4, 5, ..., totalPages
        for (let i = 2; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        // Near end: 1, ..., totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // Middle: 1, ..., page-1, page, page+1, ..., totalPages
        pages.push("...");
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-3 border-t border-[#ECEEF5] bg-white",
        position === "top" && "border-t-0 border-b",
      )}
    >
      {/* Left: Page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#5A607F]">Hiển thị</span>
        <SelectField
          options={pageSizeOptions.map((size) => ({
            value: String(size),
            label: String(size),
          }))}
          selected={String(pageSize)}
          onChangeSelected={(value) => onPageSizeChange?.(Number(value))}
          placeholder="Chọn..."
          hiddenClear={true}
          searchable={false}
          classWapper="w-fit"
          classNameContent="min-w-[80px]"
        />
        <span className="text-xs text-[#5A607F]">bản ghi</span>
      </div>

      {/* Right: Pagination */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => page > 1 && onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded hover:bg-[#F2F4F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#5A607F]" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="flex items-center gap-0.5 text-[#9EA3B8] select-none">
              <Ellipsis />{" "}
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "min-w-[32px] h-8 px-2 text-sm rounded-md transition-colors",
                p === page ? "bg-[#827BF2] text-white font-medium" : "text-[#5A607F] hover:bg-[#F2F4F8]",
              )}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => page < totalPages && onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded hover:bg-[#F2F4F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-[#5A607F]" />
        </button>
      </div>
    </div>
  );
}

export { TablePagination };
export type { TablePaginationProps };
