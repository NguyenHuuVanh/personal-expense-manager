'use client';

import type { FilterFieldConfig, FilterRule } from '@/types/advanced-filter';
import { NO_VALUE_OPERATORS, OPERATOR_LABELS } from '@/types/advanced-filter';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

type FilterActiveTagsProps = {
  rules: FilterRule[];
  getFieldConfig: (fieldKey: string) => FilterFieldConfig | undefined;
  onRemoveRule: (ruleId: string) => void;
  onClearAll: () => void;
  className?: string;
};

export function FilterActiveTags({
  rules,
  getFieldConfig,
  onRemoveRule,
  onClearAll,
  className,
}: FilterActiveTagsProps) {
  const activeRules = rules.filter(r => r.field);

  if (activeRules.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-1.5 flex-wrap', className)}>
      {activeRules.map((rule) => {
        const fieldConfig = getFieldConfig(rule.field);
        const operatorLabel = OPERATOR_LABELS[rule.operator];
        const isNoValue = NO_VALUE_OPERATORS.includes(rule.operator);

        // Build display value
        let displayValue = '';
        if (!isNoValue) {
          if (fieldConfig?.type === 'select' && fieldConfig.options) {
            if (Array.isArray(rule.value)) {
              displayValue = rule.value
                .map((v: string) => fieldConfig.options?.find(o => o.value === v)?.label || v)
                .join(', ');
            } else {
              displayValue = fieldConfig.options.find(o => o.value === rule.value)?.label || rule.value;
            }
          } else {
            displayValue = rule.value2
              ? `${rule.value} - ${rule.value2}`
              : String(rule.value ?? '');
          }
        }

        return (
          <span
            key={rule.id}
            className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary shadow-sm transition-all hover:shadow-md"
          >
            <span className="text-primary/70">{fieldConfig?.label || rule.field}</span>
            <span className="text-primary/50">{operatorLabel}</span>
            {displayValue && (
              <span className="font-semibold text-foreground max-w-[100px] truncate">{displayValue}</span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveRule(rule.id);
              }}
              className="ml-0.5 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
              title="Xóa điều kiện"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        );
      })}

      {activeRules.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-1 cursor-pointer"
        >
          Xóa tất cả
        </button>
      )}
    </div>
  );
}