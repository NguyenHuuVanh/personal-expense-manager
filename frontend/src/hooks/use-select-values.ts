'use client';
import type { IOptionSelect } from '@/types/fields';
import { useCallback, useMemo, useState } from 'react';

export const filterOptionSelect = (
  options: readonly IOptionSelect[],
  search: string,
): readonly IOptionSelect[] => {
  if (!search) return options;
  const lower = search.toLowerCase();
  return options.filter(
    opt =>
      opt.label.toLowerCase().includes(lower) ||
      String(opt.value).toLowerCase().includes(lower),
  );
};

export const getValues = (
  newValue: string | string[] | undefined,
  newOptionMap: Map<string, IOptionSelect>,
  isMulti: boolean | undefined,
) => {
  if (!isMulti) {
    const opt = newValue ? newOptionMap.get(newValue as string) : undefined;
    return { values: newValue as string | undefined, originValue: opt };
  }
  const values = (newValue as string[]) || [];
  const originValue = values.map(v => newOptionMap.get(v)).filter(Boolean) as IOptionSelect[];
  return { values, originValue };
};

type TUseSelectValuesProps<T extends boolean = false> = {
  options: readonly IOptionSelect[];
  valuesForm?: any;
  selected?: any;
  handleFilter?: (value: string) => void;
  isMulti?: T;
  name?: string;
};

export const useSelectValues = <T extends boolean = false>({
  options,
  handleFilter,
  isMulti,
  valuesForm,
  selected,
  name,
}: TUseSelectValuesProps<T>) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filterOptions = useMemo(
    () => {
      if (handleFilter) {
        return options;
      }
      return filterOptionSelect(options, search);
    },
    [options, search, handleFilter],
  );

  const newOptionMap = useMemo(
    () => new Map(options?.map(opt => [opt.value, opt])),
    [options],
  );

  const newValue = useMemo(
    () => (valuesForm && name ? (valuesForm as any)[name] : selected),
    [selected, valuesForm, name],
  );

  const { values, originValue } = useMemo(
    () => getValues(newValue, newOptionMap, isMulti),
    [newValue, newOptionMap, isMulti],
  );

  const isActiveValue = useMemo(() => {
    if (isMulti) {
      return Array.isArray(values) && values.length > 0;
    }
    return !!values || values !== undefined;
  }, [isMulti, values]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSearch('');
    }
    setOpen(open);
  }, []);

  const handleChangeValue = useCallback(
    (value: string) => {
      setSearch(value);
      handleFilter?.(value);
    },
    [handleFilter],
  );

  return {
    values,
    originValue,
    isActiveValue,
    open,
    search,
    filterOptions,
    handleChangeValue,
    handleOpenChange,
    setOpen,
    setSearch,
  };
};
