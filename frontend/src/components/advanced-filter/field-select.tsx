"use client";

import type {
  FilterFieldConfig,
  FilterModuleConfig,
} from "@/types/advanced-filter";
import { Check, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@ark-ui/react/popover";
import { Button } from "@/components/shadcn-ui/button";
import { cn } from "@/utils/cn";

type FieldSelectProps = {
  moduleConfig: FilterModuleConfig;
  selectedField: string;
  onSelect: (fieldKey: string) => void;
  disabledFields?: string[];
};

const EMPTY_ARRAY: string[] = [];

export function FieldSelect({
  moduleConfig,
  selectedField,
  onSelect,
  disabledFields = EMPTY_ARRAY,
}: FieldSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedFieldConfig = moduleConfig?.fields?.find(
    (f) => f.key === selectedField,
  );

  // Group fields by group name
  const grouped = useMemo(() => {
    const groups: Record<string, FilterFieldConfig[]> = {};
    for (const field of moduleConfig?.fields || []) {
      if (search && !field.label.toLowerCase().includes(search.toLowerCase())) {
        continue;
      }
      if (!groups[field.group]) {
        groups[field.group] = [];
      }
      groups[field.group]!.push(field);
    }
    return groups;
  }, [moduleConfig?.fields, search]);

  return (
    <PopoverRoot
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      positioning={{ strategy: "fixed" }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm transition-all min-w-[140px]",
            "hover:border-primary/50 hover:bg-primary/5",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            selectedField
              ? "border-primary/30 bg-primary/5 text-foreground font-medium"
              : "border-input text-muted-foreground",
          )}
        >
          <span className="truncate max-w-[140px]">
            {selectedFieldConfig?.label || "Chọn trường"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent
          className="z-[9999] w-[260px] p-0 shadow-lg border rounded-lg bg-popover text-popover-foreground"
        >
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Tìm trường..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Grouped fields */}
          <div className="max-h-[280px] overflow-y-auto py-1">
            {Object.entries(grouped).map(([groupName, fields]) => (
              <div key={groupName}>
                <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {groupName}
                </div>
                {fields.map((field) => {
                  const isDisabled = disabledFields.includes(field.key);
                  const isSelected = field.key === selectedField;
                  return (
                    <button
                      key={field.key}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        onSelect(field.key);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer",
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-muted",
                        isDisabled && "opacity-40 cursor-not-allowed",
                      )}
                    >
                      <span className="flex-1">{field.label}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {Object.keys(grouped).length === 0 && (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy trường nào
              </div>
            )}
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
}
