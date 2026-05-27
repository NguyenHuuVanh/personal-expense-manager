'use client';

import type { FilterFieldConfig, FilterModuleConfig, FilterOperator, FilterRule } from '@/types/advanced-filter';
import { GripVertical, Trash2 } from 'lucide-react';
import { FieldSelect } from './field-select';
import { OperatorSelect } from './operator-select';
import { ValueInput } from './value-input';

type FilterRuleRowProps = {
  rule: FilterRule;
  moduleConfig: FilterModuleConfig;
  onUpdate: (updates: Partial<FilterRule>) => void;
  onRemove: () => void;
  index: number;
  logic: 'AND' | 'OR';
  disabledFields?: string[];
};

const EMPTY_ARRAY: string[] = [];

export function FilterRuleRow({
  rule,
  moduleConfig,
  onUpdate,
  onRemove,
  index,
  logic,
  disabledFields = EMPTY_ARRAY,
}: FilterRuleRowProps) {
  const fieldConfig: FilterFieldConfig | undefined = moduleConfig?.fields?.find(
    f => f.key === rule.field,
  );

  return (
    <div className="relative">
      {/* And/Or divider — show between rows (not before first) */}
      {index > 0 && (
        <div className="flex items-center gap-3 py-2 px-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {logic === 'AND' ? 'Và' : 'Hoặc'}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
      )}

      {/* Rule row */}
      <div className="group flex items-center gap-3 px-4 py-3">
        {/* Where label */}
        <span className="text-sm text-muted-foreground shrink-0 w-[42px]">Khi</span>

        {/* Field select — with drag handle */}
        <div className="flex items-center gap-1">
          <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0 cursor-grab" />
          <FieldSelect
            moduleConfig={moduleConfig}
            selectedField={rule.field}
            onSelect={fieldKey => onUpdate({ field: fieldKey })}
            disabledFields={disabledFields}
          />
        </div>

        {/* Operator select */}
        {rule.field && (
          <OperatorSelect
            fieldConfig={fieldConfig}
            selectedOperator={rule.operator}
            onSelect={(op: FilterOperator) => onUpdate({ operator: op })}
          />
        )}

        {/* Value input */}
        {rule.field && (
          <div className="flex-1 min-w-0">
            <ValueInput
              fieldConfig={fieldConfig}
              operator={rule.operator}
              value={rule.value}
              value2={rule.value2}
              onChange={(val, val2) => onUpdate({ value: val, value2: val2 })}
            />
          </div>
        )}

        {/* Remove button */}
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 shrink-0 opacity-0 group-hover:opacity-100"
          title="Xóa điều kiện"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
