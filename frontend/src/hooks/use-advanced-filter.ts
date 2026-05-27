'use client';

import type { FilterGroup, FilterModuleConfig, FilterOperator, FilterRule } from '@/types/advanced-filter';
import { useCallback, useMemo, useState } from 'react';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

export type UseAdvancedFilterReturn<T extends FilterModuleConfig = FilterModuleConfig> = {
  filterGroup: FilterGroup;
  activeRulesCount: number;
  isActive: boolean;
  addRule: () => void;
  removeRule: (id: string) => void;
  updateRule: (id: string, updates: Partial<FilterRule>) => void;
  clearAll: () => void;
  setLogic: (logic: 'AND' | 'OR') => void;
  moduleConfig: T;
  getFieldConfig: (fieldKey: string) => T['fields'][number] | undefined;
  applyPreset: (preset: FilterGroup) => void;
  getPresetData: () => FilterGroup;
};

export function useAdvancedFilter<T extends FilterModuleConfig>(
  moduleConfig: T,
  initialGroup?: FilterGroup,
): UseAdvancedFilterReturn<T> {
  const [filterGroup, setFilterGroup] = useState<FilterGroup>(
    initialGroup ?? {
      logic: 'AND',
      rules: [{ id: generateId(), field: '', operator: 'eq' as FilterOperator, value: null }],
    },
  );

  const activeRulesCount = useMemo(
    () => filterGroup.rules.filter(r => r.field).length,
    [filterGroup.rules],
  );

  const isActive = activeRulesCount > 0;

  const addRule = useCallback(() => {
    setFilterGroup(prev => ({
      ...prev,
      rules: [...prev.rules, { id: generateId(), field: '', operator: 'eq' as FilterOperator, value: null }],
    }));
  }, []);

  const removeRule = useCallback((id: string) => {
    setFilterGroup(prev => ({
      ...prev,
      rules: prev.rules.filter(r => r.id !== id),
    }));
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<FilterRule>) => {
    setFilterGroup(prev => ({
      ...prev,
      rules: prev.rules.map(r => (r.id === id ? { ...r, ...updates } : r)),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setFilterGroup({
      logic: 'AND',
      rules: [{ id: generateId(), field: '', operator: 'eq' as FilterOperator, value: null }],
    });
  }, []);

  const setLogic = useCallback((logic: 'AND' | 'OR') => {
    setFilterGroup(prev => ({ ...prev, logic }));
  }, []);

  const getFieldConfig = useCallback(
    (fieldKey: string) => moduleConfig.fields.find(f => f.key === fieldKey),
    [moduleConfig.fields],
  );

  const applyPreset = useCallback((preset: FilterGroup) => {
    setFilterGroup(preset);
  }, []);

  const getPresetData = useCallback(() => filterGroup, [filterGroup]);

  return {
    filterGroup,
    activeRulesCount,
    isActive,
    addRule,
    removeRule,
    updateRule,
    clearAll,
    setLogic,
    moduleConfig,
    getFieldConfig,
    applyPreset,
    getPresetData,
  };
}
