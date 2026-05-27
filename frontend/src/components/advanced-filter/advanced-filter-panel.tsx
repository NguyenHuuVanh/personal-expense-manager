'use client';

import type { FilterModuleConfig } from '@/types/advanced-filter';
import type { UseAdvancedFilterReturn } from '@/hooks/use-advanced-filter';
import { ChevronDown, Plus } from 'lucide-react';
import { FilterRuleRow } from './filter-rule-row';
import { FilterLogicToggle } from './filter-logic-toggle';

type AdvancedFilterPanelProps<T extends FilterModuleConfig> = {
  filter: UseAdvancedFilterReturn<T>;
  onApply?: () => void;
  onClearAll?: () => void;
};

export function AdvancedFilterPanel<T extends FilterModuleConfig>({
  filter,
  onApply,
  onClearAll,
}: AdvancedFilterPanelProps<T>) {
  const {
    filterGroup,
    activeRulesCount,
    addRule,
    removeRule,
    updateRule,
    clearAll,
    setLogic,
    moduleConfig,
  } = filter;

  return (
    <div className="w-full space-y-4">
      {/* Logic toggle */}
      <FilterLogicToggle logic={filterGroup.logic} onChange={setLogic} />

      {/* Filter rules container — rounded border card */}
      <div className="border border-border rounded-xl bg-background overflow-hidden">
        {filterGroup.rules.map((rule, index) => (
          <FilterRuleRow
            key={rule.id}
            rule={rule}
            moduleConfig={moduleConfig}
            onUpdate={updates => updateRule(rule.id, updates)}
            onRemove={() => removeRule(rule.id)}
            index={index}
            logic={filterGroup.logic}
          />
        ))}
      </div>

      {/* Bottom actions bar */}
      <div className="flex items-center justify-between">
        {/* Add condition button */}
        <button
          type="button"
          onClick={addRule}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-muted-foreground bg-background border border-border hover:bg-muted hover:text-foreground hover:border-foreground/20 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm điều kiện
          <ChevronDown className="w-3.5 h-3.5 opacity-50 ml-1" />
        </button>

        <div className="flex items-center gap-3">
          {/* Clear all */}
          {activeRulesCount > 0 && (
            <button
              type="button"
              onClick={() => {
                clearAll();
                onClearAll?.();
              }}
              className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
            >
              Xóa tất cả
            </button>
          )}

          {/* Apply filter button */}
          {onApply && (
            <button
              type="button"
              onClick={onApply}
              className="h-9 px-5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-200 cursor-pointer"
            >
              Áp dụng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}