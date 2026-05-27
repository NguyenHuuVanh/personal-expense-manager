"use client";

import { useState, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { SelectField } from "@/components/custom-fields/select-field";
import type {
  SimpleFilterCondition,
  SimpleFieldType,
} from "@/types/filter";
import {
  SIMPLE_OPERATORS_BY_TYPE,
  OPERATOR_LABELS,
} from "@/types/filter";

interface FilterPanelProps {
  fields: Array<{
    key: string;
    label: string;
    type: SimpleFieldType;
    options?: Array<{ value: string | number; label: string }>;
  }>;
  filters: SimpleFilterCondition[];
  onFiltersChange: (filters: SimpleFilterCondition[]) => void;
  onApply: () => void;
  onClose?: () => void;
  showAddButton?: boolean;
}

export function FilterPanel({
  fields,
  filters,
  onFiltersChange,
  onApply,
  onClose,
  showAddButton = true,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<SimpleFilterCondition[]>(filters);

  const handleAddFilter = useCallback(() => {
    const defaultField = fields[0];
    const newFilter: SimpleFilterCondition = {
      id: `filter_${Date.now()}`,
      field: defaultField?.key || "",
      operator: "equals",
      value: null,
    };
    const updated = [...localFilters, newFilter];
    setLocalFilters(updated);
    onFiltersChange(updated);
  }, [fields, localFilters, onFiltersChange]);

  const handleRemoveFilter = useCallback((id: string) => {
    const updated = localFilters.filter((f) => f.id !== id);
    setLocalFilters(updated);
    onFiltersChange(updated);
  }, [localFilters, onFiltersChange]);

  const handleUpdateFilter = useCallback((id: string, updates: Partial<SimpleFilterCondition>) => {
    const updated = localFilters.map((f) => {
      if (f.id !== id) return f;
      const next = { ...f, ...updates };
      if (updates.field || updates.operator) {
        next.value = null;
        next.valueTo = null;
      }
      return next;
    });
    setLocalFilters(updated);
    onFiltersChange(updated);
  }, [localFilters, onFiltersChange]);

  const handleClearAll = () => {
    setLocalFilters([]);
    onFiltersChange([]);
  };

  return (
    <div className="space-y-3">
      {/* Filter Rows */}
      <div className="space-y-3">
        {localFilters.length === 0 ? (
          <div className="text-center py-4 text-sm text-[#5A607F]">
            Chưa có bộ lọc nào.
          </div>
        ) : (
          localFilters.map((filter) => (
            <FilterRow
              key={filter.id}
              filter={filter}
              fields={fields}
              onChange={(updates) => handleUpdateFilter(filter.id, updates)}
              onRemove={() => handleRemoveFilter(filter.id)}
            />
          ))
        )}
      </div>

      {/* Add Filter + Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E0E3EC]">
        {showAddButton && (
          <Button
            variant="ghost"
            onClick={handleAddFilter}
            className="h-8 text-sm text-[#827BF2] hover:bg-[#827BF2]/10 px-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm bộ lọc
          </Button>
        )}
        {!showAddButton && <div />}

        <div className="flex gap-2">
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              className="h-9 px-4"
            >
              Hủy
            </Button>
          )}
          <Button
            onClick={onApply}
            className="h-9 px-4 bg-[#827BF2] hover:bg-[#6B5FE2]"
          >
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
}

// Filter Row Component
interface FilterRowProps {
  filter: SimpleFilterCondition;
  fields: FilterPanelProps["fields"];
  onChange: (updates: Partial<SimpleFilterCondition>) => void;
  onRemove: () => void;
}

function FilterRow({ filter, fields, onChange, onRemove }: FilterRowProps) {
  const selectedField = fields.find((f) => f.key === filter.field);
  const fieldType: SimpleFieldType = selectedField?.type || "text";
  const operators = SIMPLE_OPERATORS_BY_TYPE[fieldType] || [];
  const requiresValue = !["is_empty", "is_not_empty"].includes(filter.operator);

  // Convert fields to IOptionSelect format
  const fieldOptions = fields.map((f) => ({ value: f.key, label: f.label }));
  const operatorOptions = operators.map((op) => ({
    value: op,
    label: OPERATOR_LABELS[op],
  }));

  return (
    <div className="flex items-start gap-2 flex-wrap">
      {/* Field Select */}
      <div className="w-36">
        <SelectField
          placeholder="Trường..."
          options={fieldOptions}
          selected={filter.field}
          onChangeSelected={(value) => onChange({ field: value })}
          searchable={false}
          hiddenClear
        />
      </div>

      {/* Operator Select */}
      <div className="w-32">
        <SelectField
          placeholder="Toán tử..."
          options={operatorOptions}
          selected={filter.operator}
          onChangeSelected={(value) => onChange({ operator: value as any })}
          searchable={false}
          hiddenClear
        />
      </div>

      {/* Value Input */}
      {requiresValue && (
        <div className="flex-1 flex items-center gap-2 min-w-[200px]">
          {fieldType === "select" && selectedField?.options ? (
            <div className="flex-1">
              <SelectField
                placeholder="Chọn..."
                options={selectedField.options.map((opt) => ({
                  value: String(opt.value),
                  label: opt.label,
                }))}
                selected={String(filter.value || "")}
                onChangeSelected={(value) => onChange({ value })}
                searchable={false}
              />
            </div>
          ) : fieldType === "date" ? (
            <>
              <input
                type="date"
                value={String(filter.value || "")}
                onChange={(e) => onChange({ value: e.target.value })}
                className="h-10 px-3 rounded-lg border border-[#E0E3EC] bg-white text-sm text-[#1A1D21] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20 focus:border-[#827BF2] flex-1"
              />
              {filter.operator === "between" && (
                <>
                  <span className="text-[#5A607F] text-sm">-</span>
                  <input
                    type="date"
                    value={String(filter.valueTo || "")}
                    onChange={(e) => onChange({ valueTo: e.target.value })}
                    className="h-10 px-3 rounded-lg border border-[#E0E3EC] bg-white text-sm text-[#1A1D21] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20 focus:border-[#827BF2] flex-1"
                  />
                </>
              )}
            </>
          ) : fieldType === "number" ? (
            <>
              <input
                type="number"
                value={String(filter.value || "")}
                onChange={(e) => onChange({ value: e.target.value })}
                placeholder="Giá trị"
                className="h-10 px-3 rounded-lg border border-[#E0E3EC] bg-white text-sm text-[#1A1D21] focus:outline-none focus:ring-2 focus:ring-[#827BF2]/20 focus:border-[#827BF2] flex-1 min-w-[80px]"
              />
              {filter.operator === "between" && (
                <>
                  <span className="text-[#5A607F] text-sm">-</span>
                  <input
                    type="number"
                    value={String(filter.valueTo || "")}
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
              value={String(filter.value || "")}
              onChange={(e) => onChange({ value: e.target.value })}
              placeholder={selectedField?.type === "text" ? "Nhập giá trị..." : ""}
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
        className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] text-[#5A607F] hover:text-[#E40127] transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Backward compatible
export function FilterBar(props: FilterPanelProps) {
  return <FilterPanel {...props} />;
}

export default FilterBar;
