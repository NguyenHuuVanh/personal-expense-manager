import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdvancedFilter } from '@/hooks/use-advanced-filter';
import type { FilterGroup, FilterModuleConfig } from '@/types/advanced-filter';

const mockModuleConfig: FilterModuleConfig = {
  moduleName: 'transactions',
  fields: [
    {
      key: 'amount',
      label: 'Số tiền',
      type: 'number',
      operators: [
        { value: 'eq', label: 'Bằng' },
        { value: 'gt', label: 'Lớn hơn' },
        { value: 'lt', label: 'Nhỏ hơn' },
      ],
    },
    {
      key: 'category',
      label: 'Danh mục',
      type: 'select',
      options: [
        { value: 'food', label: 'Ăn uống' },
        { value: 'transport', label: 'Di chuyển' },
      ],
      operators: [{ value: 'eq', label: 'Bằng' }],
    },
    {
      key: 'date',
      label: 'Ngày',
      type: 'date',
      operators: [
        { value: 'eq', label: 'Bằng' },
        { value: 'gte', label: 'Từ ngày' },
        { value: 'lte', label: 'Đến ngày' },
      ],
    },
  ],
};

describe('useAdvancedFilter hook', () => {
  describe('initial state', () => {
    it('should initialize with empty filter group', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      expect(result.current.filterGroup.logic).toBe('AND');
      expect(result.current.filterGroup.rules).toHaveLength(1);
      expect(result.current.filterGroup.rules[0].field).toBe('');
      expect(result.current.filterGroup.rules[0].value).toBeNull();
    });

    it('should initialize with custom initial group', () => {
      const initialGroup: FilterGroup = {
        logic: 'OR',
        rules: [
          { id: 'rule-1', field: 'amount', operator: 'gt', value: 1000 },
          { id: 'rule-2', field: 'category', operator: 'eq', value: 'food' },
        ],
      };

      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig, initialGroup));

      expect(result.current.filterGroup.logic).toBe('OR');
      expect(result.current.filterGroup.rules).toHaveLength(2);
      expect(result.current.filterGroup.rules[0].field).toBe('amount');
    });

    it('should have isActive false with empty rules', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      expect(result.current.isActive).toBe(false);
      expect(result.current.activeRulesCount).toBe(0);
    });

    it('should have isActive true when rules have fields', () => {
      const initialGroup: FilterGroup = {
        logic: 'AND',
        rules: [
          { id: 'rule-1', field: 'amount', operator: 'gt', value: 1000 },
        ],
      };

      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig, initialGroup));

      expect(result.current.isActive).toBe(true);
      expect(result.current.activeRulesCount).toBe(1);
    });
  });

  describe('addRule', () => {
    it('should add new rule to filter group', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      act(() => {
        result.current.addRule();
      });

      expect(result.current.filterGroup.rules).toHaveLength(2);
    });

    it('should add rule with default values', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      act(() => {
        result.current.addRule();
      });

      const newRule = result.current.filterGroup.rules[1];
      expect(newRule.field).toBe('');
      expect(newRule.operator).toBe('eq');
      expect(newRule.value).toBeNull();
    });

    it('should maintain existing rules when adding new one', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      act(() => {
        result.current.updateRule(result.current.filterGroup.rules[0].id, {
          field: 'amount',
          operator: 'gt',
          value: 1000,
        });
        result.current.addRule();
      });

      expect(result.current.filterGroup.rules[0].field).toBe('amount');
    });
  });

  describe('removeRule', () => {
    it('should remove rule by id', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      act(() => {
        result.current.addRule();
        result.current.addRule();
      });

      expect(result.current.filterGroup.rules).toHaveLength(3);

      const ruleToRemove = result.current.filterGroup.rules[1];

      act(() => {
        result.current.removeRule(ruleToRemove.id);
      });

      expect(result.current.filterGroup.rules).toHaveLength(2);
    });

    it('should not crash when removing non-existent rule', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      act(() => {
        result.current.removeRule('non-existent-id');
      });

      expect(result.current.filterGroup.rules).toHaveLength(1);
    });
  });

  describe('updateRule', () => {
    it('should update rule field', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));
      const ruleId = result.current.filterGroup.rules[0].id;

      act(() => {
        result.current.updateRule(ruleId, { field: 'amount' });
      });

      expect(result.current.filterGroup.rules[0].field).toBe('amount');
    });

    it('should update rule operator', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));
      const ruleId = result.current.filterGroup.rules[0].id;

      act(() => {
        result.current.updateRule(ruleId, { operator: 'gt' });
      });

      expect(result.current.filterGroup.rules[0].operator).toBe('gt');
    });

    it('should update rule value', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));
      const ruleId = result.current.filterGroup.rules[0].id;

      act(() => {
        result.current.updateRule(ruleId, { value: 5000 });
      });

      expect(result.current.filterGroup.rules[0].value).toBe(5000);
    });

    it('should update multiple fields at once', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));
      const ruleId = result.current.filterGroup.rules[0].id;

      act(() => {
        result.current.updateRule(ruleId, {
          field: 'category',
          operator: 'eq',
          value: 'food',
        });
      });

      expect(result.current.filterGroup.rules[0].field).toBe('category');
      expect(result.current.filterGroup.rules[0].operator).toBe('eq');
      expect(result.current.filterGroup.rules[0].value).toBe('food');
    });

    it('should recalculate activeRulesCount on field change', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));
      const ruleId = result.current.filterGroup.rules[0].id;

      expect(result.current.activeRulesCount).toBe(0);

      act(() => {
        result.current.updateRule(ruleId, { field: 'amount' });
      });

      expect(result.current.activeRulesCount).toBe(1);
      expect(result.current.isActive).toBe(true);
    });
  });

  describe('clearAll', () => {
    it('should reset filter group to default state', () => {
      const initialGroup: FilterGroup = {
        logic: 'OR',
        rules: [
          { id: 'rule-1', field: 'amount', operator: 'gt', value: 1000 },
          { id: 'rule-2', field: 'category', operator: 'eq', value: 'food' },
        ],
      };

      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig, initialGroup));

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.filterGroup.logic).toBe('AND');
      expect(result.current.filterGroup.rules).toHaveLength(1);
      expect(result.current.filterGroup.rules[0].field).toBe('');
      expect(result.current.isActive).toBe(false);
    });
  });

  describe('setLogic', () => {
    it('should set logic to AND', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      act(() => {
        result.current.setLogic('AND');
      });

      expect(result.current.filterGroup.logic).toBe('AND');
    });

    it('should set logic to OR', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      act(() => {
        result.current.setLogic('OR');
      });

      expect(result.current.filterGroup.logic).toBe('OR');
    });
  });

  describe('getFieldConfig', () => {
    it('should return field config by key', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      const fieldConfig = result.current.getFieldConfig('amount');

      expect(fieldConfig).toBeDefined();
      expect(fieldConfig?.label).toBe('Số tiền');
      expect(fieldConfig?.type).toBe('number');
    });

    it('should return undefined for non-existent field', () => {
      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      const fieldConfig = result.current.getFieldConfig('non-existent');

      expect(fieldConfig).toBeUndefined();
    });
  });

  describe('applyPreset', () => {
    it('should apply preset filter group', () => {
      const preset: FilterGroup = {
        logic: 'OR',
        rules: [
          { id: 'preset-1', field: 'amount', operator: 'gt', value: 5000 },
        ],
      };

      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig));

      act(() => {
        result.current.applyPreset(preset);
      });

      expect(result.current.filterGroup.logic).toBe('OR');
      expect(result.current.filterGroup.rules[0].field).toBe('amount');
      expect(result.current.filterGroup.rules[0].value).toBe(5000);
    });
  });

  describe('getPresetData', () => {
    it('should return current filter group', () => {
      const initialGroup: FilterGroup = {
        logic: 'OR',
        rules: [
          { id: 'rule-1', field: 'amount', operator: 'gt', value: 1000 },
        ],
      };

      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig, initialGroup));

      const presetData = result.current.getPresetData();

      expect(presetData.logic).toBe('OR');
      expect(presetData.rules).toHaveLength(1);
      expect(presetData.rules[0].field).toBe('amount');
    });
  });

  describe('activeRulesCount', () => {
    it('should count rules with non-empty fields', () => {
      const initialGroup: FilterGroup = {
        logic: 'AND',
        rules: [
          { id: 'rule-1', field: 'amount', operator: 'gt', value: 1000 },
          { id: 'rule-2', field: '', operator: 'eq', value: null },
          { id: 'rule-3', field: 'category', operator: 'eq', value: 'food' },
          { id: 'rule-4', field: '', operator: 'eq', value: null },
        ],
      };

      const { result } = renderHook(() => useAdvancedFilter(mockModuleConfig, initialGroup));

      expect(result.current.activeRulesCount).toBe(2);
    });
  });
});
