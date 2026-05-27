"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { cn } from "@/utils/cn";
import {
  type FilterCondition,
  type FilterFieldType,
  type SimpleFilterField as FilterFieldDefinition,
  OPERATORS_BY_TYPE,
  OPERATOR_LABELS,
  generateConditionId,
} from "@/types/filter";

interface FilterPanelProps {
  fields: FilterFieldDefinition[];
  filters: FilterCondition[];
  logic: "and" | "or";
  onFiltersChange: (filters: FilterCondition[]) => void;
  onLogicChange: (logic: "and" | "or") => void;
  onClose: () => void;
  onApply: () => void;
  isOpen: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export function FilterPanel({
  fields,
  filters,
  logic,
  onFiltersChange,
  onLogicChange,
  onClose,
  onApply,
  isOpen,
  anchorRef,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterCondition[]>(filters);
  const [localLogic, setLocalLogic] = useState(logic);
  const panelRef = useRef<HTMLDivElement>(null);

  // Sync local state khi props thay đổi
  useEffect(() => {
    setLocalFilters(filters);
    setLocalLogic(logic);
  }, [filters, logic]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleApply = useCallback(() => {
    onFiltersChange(localFilters);
    onLogicChange(localLogic);
    onApply();
    onClose();
  }, [localFilters, localLogic, onFiltersChange, onLogicChange, onApply, onClose]);

  const handleAddCondition = useCallback(() => {
    const fieldType = fields[0]?.type || "text";
    const operators = OPERATORS_BY_TYPE[fieldType];
    const newCondition: FilterCondition = {
      id: generateConditionId(),
      field: fields[0]?.key || "",
      operator: operators[0],
      value: null,
      valueTo: null,
    };
    setLocalFilters((prev) => [...prev, newCondition]);
  }, [fields]);

  const handleRemoveCondition = useCallback((id: string) => {
    setLocalFilters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleUpdateCondition = useCallback(
    (id: string, updates: Partial<FilterCondition>) => {
      setLocalFilters((prev) =>
        prev.map((f) => {
          if (f.id !== id) return f;
          const updated = { ...f, ...updates };
          if (updates.field || updates.operator) {
            updated.value = null;
            updated.valueTo = null;
          }
          return updated;
        })
      );
    },
    []
  );

  const handleClearAll = useCallback(() => {
    setLocalFilters([]);
  }, []);

  if (!isOpen) return null;

  // Calculate position
  const anchorRect = anchorRef.current?.getBoundingClientRect();
  const top = anchorRect ? anchorRect.bottom + 8 : 0;
  const left = anchorRect ? anchorRect.left : 0;
  const width = anchorRect ? Math.max(anchorRect.width, 400) : 400;

  return (
    <div
      ref={panelRef}
      className="fixed z-50 bg-white rounded-xl shadow-xl border border-[#ECEEF5] overflow-hidden"
      style={{ top, left, width }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#ECEEF5] flex items-center justify-between bg-[#FAFBFC]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#1A1D21]">Bộ lọc</span>
          {localFilters.length > 0 && (
            <span className="px-2 py-0.5 text-xs bg-[#827BF2]/10 text-[#827BF2] rounded-full">
              {localFilters.length} điều kiện
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[#F4F5F7] transition-colors"
        >
          <X className="w-4 h-4 text-[#5A607F]" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {/* Logic Toggle */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-[#5A607F]">Kết hợp:</span>
          <div className="flex rounded-lg border border-[#E0E3EC] overflow-hidden">
            <button
              onClick={() => setLocalLogic("and")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                localLogic === "and"
                  ? "bg-[#827BF2] text-white"
                  : "bg-white text-[#5A607F] hover:bg-[#FAFBFC]"
              )}
            >
              VÀ
            </button>
            <button
              onClick={() => setLocalLogic("or")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                localLogic === "or"
                  ? "bg-[#827BF2] text-white"
                  : "bg-white text-[#5A607F] hover:bg-[#FAFBFC]"
              )}
            >
              HOẶC
            </button>
          </div>
        </div>

        {/* Conditions */}
        <div className="space-y-3">
          {localFilters.length === 0 ? (
            <div className="text-center py-6 text-[#5A607F]">
              <p className="text-sm">Chưa có điều kiện lọc nào.</p>
              <p className="text-xs mt-1">Nhấn &quot;Thêm điều kiện&quot; để bắt đầu</p>
            </div>
          ) : (
            localFilters.map((condition, index) => (
              <FilterConditionRow
                key={condition.id}
                condition={condition}
                fields={fields}
                logic={localLogic}
                showLogic={index > 0}
                onChange={(updates) => handleUpdateCondition(condition.id, updates)}
                onRemove={() => handleRemoveCondition(condition.id)}
              />
            ))
          )}
        </div>

        {/* Add Condition */}
        <Button
          variant="outline"
          onClick={handleAddCondition}
          className="mt-3 w-full h-8 text-xs border-dashed border-[#E0E3EC] text-[#5A607F] hover:bg-[#FAFBFC]"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          Thêm điều kiện
        </Button>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#ECEEF5] flex items-center justify-between bg-[#FAFBFC]">
        <Button
          variant="ghost"
          onClick={handleClearAll}
          className="h-8 px-2 text-xs text-[#E40127] hover:text-[#E40127] hover:bg-[#FEE2E2]"
        >
          Xóa tất cả
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-8 px-3 text-xs"
          >
            Hủy
          </Button>
          <Button
            onClick={handleApply}
            className="h-8 px-3 text-xs bg-[#827BF2] hover:bg-[#6B5FE2]"
          >
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
}

// Condition Row Component
interface FilterConditionRowProps {
  condition: FilterCondition;
  fields: FilterFieldDefinition[];
  logic: "and" | "or";
  showLogic: boolean;
  onChange: (updates: Partial<FilterCondition>) => void;
  onRemove: () => void;
}

function FilterConditionRow({
  condition,
  fields,
  logic,
  showLogic,
  onChange,
  onRemove,
}: FilterConditionRowProps) {
  const selectedField = fields.find((f) => f.key === condition.field);
  const fieldType: FilterFieldType = selectedField?.type || "text";
  const operators = OPERATORS_BY_TYPE[fieldType];
  const selectedOperator = operators.find((o) => o === condition.operator);
  const requiresValue = selectedOperator !== undefined && !['is_empty', 'is_not_empty'].includes(selectedOperator);

  return (
    <div className="flex items-start gap-2">
      {/* Logic Badge */}
      {showLogic && (
        <div className="flex items-center h-8 pt-5">
          <span className="px-2 py-0.5 text-[10px] font-medium bg-[#F4F5F7] text-[#5A607F] rounded-full">
            {logic === "and" ? "VÀ" : "HOẶC"}
          </span>
        </div>
      )}

      {/* Field Select */}
      <select
        value={condition.field}
        onChange={(e) => onChange({ field: e.target.value })}
        className="h-8 px-2 pr-6 text-xs rounded-lg border border-[#E0E3EC] bg-white text-[#1A1D21] focus:outline-none focus:ring-1 focus:ring-[#827BF2]/20 focus:border-[#827BF2] appearance-none cursor-pointer flex-1 min-w-[100px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235A607F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 6px center",
        }}
      >
        {fields.map((field) => (
          <option key={field.key} value={field.key}>
            {field.label}
          </option>
        ))}
      </select>

      {/* Operator Select */}
      <select
        value={condition.operator}
        onChange={(e) => onChange({ operator: e.target.value as any })}
        className="h-8 px-2 pr-6 text-xs rounded-lg border border-[#E0E3EC] bg-white text-[#1A1D21] focus:outline-none focus:ring-1 focus:ring-[#827BF2]/20 focus:border-[#827BF2] appearance-none cursor-pointer flex-1 min-w-[100px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235A607F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 6px center",
        }}
      >
        {operators.map((op) => (
          <option key={op} value={op}>
            {OPERATOR_LABELS[op]}
          </option>
        ))}
      </select>

      {/* Value Input */}
      {requiresValue && (
        <div className="flex-1 flex items-center gap-1.5 min-w-[120px]">
          {fieldType === "select" && selectedField?.options ? (
            <select
              value={String(condition.value || "")}
              onChange={(e) => onChange({ value: e.target.value })}
              className="h-8 px-2 pr-6 text-xs rounded-lg border border-[#E0E3EC] bg-white text-[#1A1D21] focus:outline-none focus:ring-1 focus:ring-[#827BF2]/20 focus:border-[#827BF2] appearance-none cursor-pointer flex-1"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235A607F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 6px center",
              }}
            >
              <option value="">...</option>
              {selectedField.options.map((opt) => (
                <option key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : fieldType === "date" ? (
            <input
              type="date"
              value={String(condition.value || "")}
              onChange={(e) => onChange({ value: e.target.value })}
              className="h-8 px-2 text-xs rounded-lg border border-[#E0E3EC] bg-white text-[#1A1D21] focus:outline-none focus:ring-1 focus:ring-[#827BF2]/20 focus:border-[#827BF2] flex-1"
            />
          ) : fieldType === "number" ? (
            <>
              <input
                type="number"
                value={String(condition.value || "")}
                onChange={(e) => onChange({ value: e.target.value })}
                placeholder="Từ"
                className="h-8 px-2 text-xs rounded-lg border border-[#E0E3EC] bg-white text-[#1A1D21] focus:outline-none focus:ring-1 focus:ring-[#827BF2]/20 focus:border-[#827BF2] w-20"
              />
              {condition.operator === "between" && (
                <>
                  <span className="text-[#5A607F] text-xs">-</span>
                  <input
                    type="number"
                    value={String(condition.valueTo || "")}
                    onChange={(e) => onChange({ valueTo: e.target.value })}
                    placeholder="Đến"
                    className="h-8 px-2 text-xs rounded-lg border border-[#E0E3EC] bg-white text-[#1A1D21] focus:outline-none focus:ring-1 focus:ring-[#827BF2]/20 focus:border-[#827BF2] w-20"
                  />
                </>
              )}
            </>
          ) : (
            <input
              type="text"
              value={String(condition.value || "")}
              onChange={(e) => onChange({ value: e.target.value })}
              placeholder={selectedField?.placeholder || "Nhập..."}
              className="h-8 px-2 text-xs rounded-lg border border-[#E0E3EC] bg-white text-[#1A1D21] focus:outline-none focus:ring-1 focus:ring-[#827BF2]/20 focus:border-[#827BF2] flex-1"
            />
          )}
        </div>
      )}

      {!requiresValue && (
        <span className="h-8 flex items-center text-[10px] text-[#5A607F] italic">
          (tự động)
        </span>
      )}

      {/* Remove */}
      <button
        onClick={onRemove}
        className="h-8 px-2 rounded-lg hover:bg-[#FEE2E2] text-[#5A607F] hover:text-[#E40127] transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default FilterPanel;
