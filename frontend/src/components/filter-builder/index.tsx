"use client";

import { useState, useCallback } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { cn } from "@/utils/cn";
import {
  type FilterBuilderProps,
  type FilterCondition,
  type FilterFieldType,
  OPERATORS_BY_TYPE,
  OPERATOR_LABELS,
  generateConditionId,
} from "@/types/filter";

export function FilterBuilder({
  isOpen,
  onClose,
  fields,
  filters,
  logic,
  onFiltersChange,
  onLogicChange,
  onApply,
  title = "Bộ lọc nâng cao",
}: FilterBuilderProps) {
  const [localFilters, setLocalFilters] = useState<FilterCondition[]>(filters);
  const [localLogic, setLocalLogic] = useState<'and' | 'or'>(logic || 'and');

  const handleClose = useCallback(() => {
    setLocalFilters(filters);
    setLocalLogic(logic || 'and');
    onClose();
  }, [filters, logic, onClose]);

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

          // Reset value khi thay đổi field hoặc operator
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECEEF5]">
          <h2 className="text-lg font-semibold text-[#1A1D21]">{title}</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-[#F4F5F7] transition-colors"
          >
            <X className="w-5 h-5 text-[#5A607F]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Logic Toggle */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-[#5A607F]">Kết hợp điều kiện:</span>
            <div className="flex rounded-lg border border-[#E0E3EC] overflow-hidden">
              <button
                onClick={() => setLocalLogic("and")}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  localLogic === "and"
                    ? "bg-[#827BF2] text-white"
                    : "bg-white text-[#5A607F] hover:bg-[#FAFBFC]"
                )}
              >
                VÀ (AND)
              </button>
              <button
                onClick={() => setLocalLogic("or")}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  localLogic === "or"
                    ? "bg-[#827BF2] text-white"
                    : "bg-white text-[#5A607F] hover:bg-[#FAFBFC]"
                )}
              >
                HOẶC (OR)
              </button>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            {localFilters.length === 0 ? (
              <div className="text-center py-8 text-[#5A607F]">
                <p className="text-sm">Chưa có điều kiện lọc nào.</p>
                <p className="text-xs mt-1">Nhấn &quot;Thêm điều kiện&quot; để bắt đầu</p>
              </div>
            ) : (
              localFilters.map((condition, index) => (
                <ConditionRow
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

          {/* Add Condition Button */}
          <Button
            variant="outline"
            onClick={handleAddCondition}
            className="mt-4 w-full h-10 border-dashed border-[#E0E3EC] text-[#5A607F] hover:bg-[#FAFBFC] hover:text-[#1A1D21]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm điều kiện
          </Button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#ECEEF5]">
          <Button
            variant="ghost"
            onClick={handleClearAll}
            className="text-[#E40127] hover:text-[#E40127] hover:bg-[#FEE2E2]"
          >
            Xóa tất cả
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="h-10 px-4"
            >
              Hủy
            </Button>
            <Button
              onClick={handleApply}
              className="h-10 px-4 bg-[#827BF2] hover:bg-[#6B5FE2]"
            >
              Áp dụng ({localFilters.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Condition Row Component
interface ConditionRowProps {
  condition: FilterCondition;
  fields: FilterBuilderProps["fields"];
  logic: "and" | "or";
  showLogic: boolean;
  onChange: (updates: Partial<FilterCondition>) => void;
  onRemove: () => void;
}

function ConditionRow({
  condition,
  fields,
  logic,
  showLogic,
  onChange,
  onRemove,
}: ConditionRowProps) {
  const selectedField = fields.find((f) => f.key === condition.field);
  const fieldType: FilterFieldType = selectedField?.type || "text";
  const operators = OPERATORS_BY_TYPE[fieldType];
  const selectedOperator = operators.find((o) => o === condition.operator);
  const requiresValue = selectedOperator !== undefined && !['is_empty', 'is_not_empty'].includes(selectedOperator);

  return (
    <div className="flex items-start gap-3">
      {/* Logic Badge */}
      {showLogic && (
        <div className="flex items-center h-10">
          <span className="px-3 py-1 text-xs font-medium bg-[#F4F5F7] text-[#5A607F] rounded-full">
            {logic === "and" ? "VÀ" : "HOẶC"}
          </span>
        </div>
      )}

      {/* Field Select */}
      <select
        value={condition.field}
        onChange={(e) => onChange({ field: e.target.value })}
        className="h-10 px-3 pr-8 rounded-lg border border-[#E0E3EC] bg-white text-sm text-[#1A1D21] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20 focus:border-[#827BF2] appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235A607F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
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
        className="h-10 px-3 pr-8 rounded-lg border border-[#E0E3EC] bg-white text-sm text-[#1A1D21] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20 focus:border-[#827BF2] appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235A607F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
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
        <div className="flex-1 flex items-center gap-2">
          {fieldType === "select" && selectedField?.options ? (
            <select
              value={String(condition.value || "")}
              onChange={(e) => onChange({ value: e.target.value })}
              className="h-10 px-3 rounded-lg border border-[#E0E3EC] bg-white text-sm text-[#1A1D21] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20 focus:border-[#827BF2] appearance-none cursor-pointer flex-1"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235A607F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
            >
              <option value="">Chọn...</option>
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
              className="h-10 px-3 rounded-lg border border-[#E0E3EC] bg-white text-sm text-[#1A1D21] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20 focus:border-[#827BF2] flex-1"
            />
          ) : fieldType === "number" ? (
            <>
              <input
                type="number"
                value={String(condition.value || "")}
                onChange={(e) => onChange({ value: e.target.value })}
                placeholder="Giá trị"
                className="h-10 px-3 rounded-lg border border-[#E0E3EC] bg-white text-sm text-[#1A1D21] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20 focus:border-[#827BF2] flex-1 min-w-[80px]"
              />
              {condition.operator === "between" && (
                <>
                  <span className="text-[#5A607F] text-sm">và</span>
                  <input
                    type="number"
                    value={String(condition.valueTo || "")}
                    onChange={(e) => onChange({ valueTo: e.target.value })}
                    placeholder="Đến"
                    className="h-10 px-3 rounded-lg border border-[#E0E3EC] bg-white text-sm text-[#1A1D21] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20 focus:border-[#827BF2] w-24"
                  />
                </>
              )}
            </>
          ) : (
            <input
              type="text"
              value={String(condition.value || "")}
              onChange={(e) => onChange({ value: e.target.value })}
              placeholder={selectedField?.placeholder || "Nhập giá trị..."}
              className="h-10 px-3 rounded-lg border border-[#E0E3EC] bg-white text-sm text-[#1A1D21] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20 focus:border-[#827BF2] flex-1"
            />
          )}
        </div>
      )}

      {!requiresValue && (
        <span className="h-10 flex items-center text-sm text-[#5A607F] italic">
          (không cần giá trị)
        </span>
      )}

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="h-10 px-3 rounded-lg hover:bg-[#FEE2E2] text-[#5A607F] hover:text-[#E40127] transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default FilterBuilder;
