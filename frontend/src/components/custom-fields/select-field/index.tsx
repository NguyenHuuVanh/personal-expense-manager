"use client";
import type { IOptionSelect } from "@/types/fields";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@ark-ui/react/popover";
import { ChevronDown } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/shadcn-ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/shadcn-ui/command";
import { useSelectValues } from "@/hooks/use-select-values";
import { cn } from "@/utils/cn";
import WapperField from "../wapper-field";

export type SelectFieldProps = {
  placeholder?: string;
  options: readonly IOptionSelect[];
  selected?: string | string[] | null;
  onChangeSelected?: (value: string) => void;
  classNameContent?: string;
  hiddenArrow?: boolean;
  hiddenClear?: boolean;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  msgError?: string;
  classWapper?: string;
  searchable?: boolean;
  buttonClassName?: string;
  itemClassName?: string;
  inputClassName?: string;
  /**
   * Custom render cho mỗi option trong dropdown.
   * Fallback về `option.label` nếu không truyền.
   */
  renderOption?: (option: IOptionSelect) => ReactNode;
  /**
   * Custom render cho phần label hiển thị ở trigger button (khi đã chọn 1 option).
   * Fallback về `selectedOption.label` nếu không truyền.
   */
  renderTrigger?: (option: IOptionSelect) => ReactNode;
};

export const SelectField = ({
  label,
  required,
  msgError,
  classWapper,
  placeholder = "Chọn...",
  options,
  selected: selectedProp,
  onChangeSelected,
  hiddenArrow,
  hiddenClear = false,
  disabled,
  searchable = true,
  classNameContent,
  buttonClassName,
  itemClassName,
  inputClassName,
  renderOption,
  renderTrigger,
}: SelectFieldProps) => {
  const selectId = useId();
  const [internalSelected, setInternalSelected] = useState<string>("");
  const selected =
    selectedProp !== undefined ? String(selectedProp ?? "") : internalSelected;

  const { open, filterOptions, handleChangeValue, setOpen, setSearch } =
    useSelectValues({
      options,
      selected,
    });

  const selectedOption = options.find((opt) => opt.value === selected);

  const handleSelect = (value: string) => {
    if (selectedProp !== undefined) {
      onChangeSelected?.(value);
    } else {
      setInternalSelected(value);
      onChangeSelected?.(value);
    }
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProp !== undefined) {
      onChangeSelected?.("" as any);
    } else {
      setInternalSelected("");
      onChangeSelected?.("" as any);
    }
    setOpen(false);
  };

  // Helper render — ưu tiên custom render, fallback label string
  const renderTriggerContent = () => {
    if (!selectedOption) return placeholder;
    if (renderTrigger) return renderTrigger(selectedOption);
    return selectedOption.label;
  };

  const renderOptionContent = (opt: IOptionSelect): ReactNode => {
    if (renderOption) return renderOption(opt);
    return opt.label;
  };

  return (
    <WapperField
      label={label}
      required={required}
      msgError={msgError}
      classWapper={classWapper}
    >
      <PopoverRoot
        open={open}
        onOpenChange={({ open }) => {
          if (!open) setSearch("");
          setOpen(open);
        }}
        lazyMount
        unmountOnExit
        positioning={{
          strategy: "fixed",
          gutter: 4,
        }}
      >
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            data-container={selectId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between shadow-sm font-normal",
              !selectedOption && "text-muted-foreground",
              buttonClassName,
            )}
          >
            <span className="truncate flex-1 text-left">
              {renderTriggerContent()}
            </span>
            {!hiddenArrow && <ChevronDown className="opacity-50 h-4 w-4" />}
          </Button>
        </PopoverTrigger>
        <PopoverPositioner>
          <PopoverContent
            data-state={open ? "open" : "closed"}
            className={cn(
              "z-[10001] w-[var(--reference-width)] rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
              "min-w-[200px] p-0",
              classNameContent,
            )}
            onWheel={(e) => e.stopPropagation()}
          >
            <Command shouldFilter={false}>
              {searchable && (
                <CommandInput
                  placeholder="Tìm kiếm..."
                  value=""
                  onValueChange={handleChangeValue}
                  className={cn( inputClassName)}
                />
              )}
              <CommandList className="max-h-[250px]">
                <CommandEmpty className="text-xs py-3 text-center text-muted-foreground">Không tìm thấy</CommandEmpty>
                <CommandGroup>
                  {filterOptions.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={() => handleSelect(opt.value)}
                      className={cn(
                        "cursor-pointer",
                        opt.value === selected && "bg-accent",
                        itemClassName,
                      )}
                    >
                      {renderOptionContent(opt)}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {selectedOption && (
                  <>
                    <CommandSeparator />
                    {!hiddenClear && (
                      <CommandGroup>
                      <CommandItem
                        value="clear-selection"
                        onSelect={() =>
                          handleClear({ stopPropagation: () => {} } as any)
                        }
                        className={cn(
                          "cursor-pointer text-center justify-center text-muted-foreground",
                          itemClassName,
                        )}
                      >
                        Bỏ chọn
                      </CommandItem>
                    </CommandGroup>
                    )}
                  </> 
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverRoot>
    </WapperField>
  );
};
