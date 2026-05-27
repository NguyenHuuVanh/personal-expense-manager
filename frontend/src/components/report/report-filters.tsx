'use client';

import { TIME_PERIOD_LABELS, TimePeriodEnum } from '@/types/filter-report';
import type { FilterReportProps, TagItem } from '@/types/filter-report';
import { vi } from 'date-fns/locale';
import { CalendarDays, RotateCcw, SlidersHorizontal, Tag, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/shadcn-ui/button';
import { DatePickerInline } from '@/components/ui/date-picker-inline';
import { ComboboxMultiSelect } from '@/components/ui/combobox-multi-select';
import { PopoverContent, PopoverPositioner, PopoverRoot, PopoverTrigger } from '@ark-ui/react/popover';
import { cn } from '@/utils/cn';

// Simple select dropdown component
function SimpleSelect({
  value,
  onChange,
  options,
  placeholder = 'Chọn...',
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <PopoverRoot
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
      positioning={{ strategy: 'fixed', offset: { mainAxis: 4 } }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'h-9 px-3 rounded-md text-sm font-medium border transition-all cursor-pointer min-w-[140px] justify-start',
            value
              ? 'border-primary/30 bg-primary/5 text-foreground'
              : 'border-input bg-background text-muted-foreground hover:bg-muted',
            className,
          )}
        >
          <span className="truncate flex-1 text-left">
            {selectedOption?.label || placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent className="z-[9999] w-[200px] p-1 shadow-lg border border-border rounded-lg bg-popover text-popover-foreground">
          <div className="py-1">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2 text-sm text-left rounded-md transition-colors cursor-pointer',
                  opt.value === value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-muted',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
}

// Custom tag input component
function CustomTagsInput({
  tags,
  onChange,
  placeholder = 'Thêm tag...',
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap min-h-[36px] px-3 py-2 rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 h-6 px-2 rounded-full text-xs font-medium bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[80px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
      />
    </div>
  );
}

// Active filter tag display
function ActiveFilterTag({
  label,
  value,
  onRemove,
}: {
  label: string;
  value: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary shadow-sm">
      <span className="text-primary/70">{label}:</span>
      <span className="font-semibold text-foreground">{value}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export function ReportFilters({
  // State
  timePeriod,
  startDate,
  endDate,
  departmentId,
  teamId,
  memberId,
  tags,
  customTags,
  // Callbacks
  onTimePeriodChange,
  onStartDateChange,
  onEndDateChange,
  onDepartmentChange,
  onTeamChange,
  onMemberChange,
  onTagsChange,
  onCustomTagsChange,
  // Options
  showTimePeriod = true,
  showDepartment = true,
  showTeam = true,
  showMember = true,
  showTags = true,
  showCustomTags = true,
  departmentOptions = [],
  teamOptions = [],
  memberOptions = [],
  tagOptions = [],
  // Actions
  showSelectAllTeam = false,
  onReset,
  className,
  classNameFilters,
}: FilterReportProps) {
  const isCustomPeriod = timePeriod === TimePeriodEnum.CUSTOM;

  const timePeriodOptions = Object.values(TimePeriodEnum).map(period => ({
    value: period,
    label: TIME_PERIOD_LABELS[period],
  }));

  // Count active filters
  const activeFilterCount = [
    timePeriod,
    startDate,
    endDate,
    departmentId,
    teamId,
    memberId,
    tags && tags.length > 0,
    customTags && customTags.length > 0,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const handleReset = () => {
    onTimePeriodChange?.(null);
    onStartDateChange?.(undefined);
    onEndDateChange?.(undefined);
    onDepartmentChange?.(null);
    onTeamChange?.(null);
    onMemberChange?.(null);
    onTagsChange?.([]);
    onCustomTagsChange?.([]);
    onReset?.();
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Filter controls */}
      <div className="flex items-center gap-4 flex-wrap p-4 rounded-lg bg-muted/30 border border-border">
        {/* Search / Time Period */}
        {showTimePeriod && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
              <SimpleSelect
                value={timePeriod ?? ''}
                onChange={(val) => onTimePeriodChange?.(val as TimePeriodEnum || null)}
                options={timePeriodOptions}
                placeholder="Chọn khoảng thời gian"
                className="w-48"
              />
            </div>

            {/* Custom date range */}
            {isCustomPeriod && (
              <div className="flex items-center gap-2">
                <DatePickerInline
                  selected={startDate ?? undefined}
                  onSelect={onStartDateChange}
                  placeholder="Từ ngày"
                  classNameTrigger="h-9 w-40 text-sm"
                />
                <span className="text-sm text-muted-foreground">đến</span>
                <DatePickerInline
                  selected={endDate ?? undefined}
                  onSelect={onEndDateChange}
                  placeholder="Đến ngày"
                  classNameTrigger="h-9 w-40 text-sm"
                />
              </div>
            )}
          </div>
        )}

        {/* Department */}
        {showDepartment && onDepartmentChange && departmentOptions.length > 0 && (
          <SimpleSelect
            value={departmentId ?? ''}
            onChange={(val) => {
              onDepartmentChange?.(val || null);
              if (showTeam && onTeamChange) onTeamChange?.(null);
              if (showMember && onMemberChange) onMemberChange?.(null);
            }}
            options={[{ value: '', label: 'Tất cả phòng ban' }, ...departmentOptions]}
            placeholder="Chọn phòng ban"
          />
        )}

        {/* Team */}
        {showTeam && onTeamChange && teamOptions.length > 0 && departmentId && (
          <SimpleSelect
            value={teamId ?? ''}
            onChange={(val) => {
              onTeamChange?.(val || null);
              if (showMember && onMemberChange) onMemberChange?.(null);
            }}
            options={[
              { value: '', label: showSelectAllTeam ? 'Tất cả team' : 'Chọn team' },
              ...teamOptions,
            ]}
            placeholder="Chọn team"
          />
        )}

        {/* Member */}
        {showMember && onMemberChange && memberOptions.length > 0 && teamId && (
          <SimpleSelect
            value={memberId ?? ''}
            onChange={(val) => onMemberChange?.(val || null)}
            options={[{ value: '', label: 'Chọn nhân viên' }, ...memberOptions]}
            placeholder="Chọn nhân viên"
          />
        )}

        {/* Tags */}
        {showTags && onTagsChange && tagOptions.length > 0 && (
          <div className="flex items-center gap-2 min-w-[180px]">
            <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
            <ComboboxMultiSelect
              options={tagOptions}
              selected={tags?.map((t: TagItem | string) => typeof t === 'string' ? t : t.value) || []}
              onChange={(selected) => {
                const selectedTags: TagItem[] = selected.map(value => ({
                  value,
                  label: tagOptions.find(o => o.value === value)?.label || value,
                }));
                onTagsChange?.(selectedTags);
              }}
              placeholder="Chọn tags"
              searchPlaceholder="Tìm tag..."
            />
          </div>
        )}

        {/* Custom Tags */}
        {showCustomTags && onCustomTagsChange && (
          <div className="flex items-center gap-2 min-w-[200px]">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
            <CustomTagsInput
              tags={customTags || []}
              onChange={onCustomTagsChange}
              placeholder="Nhập tag và nhấn Enter..."
            />
          </div>
        )}

        {/* Divider */}
        {hasActiveFilters && (
          <div className="w-px h-8 bg-border mx-2" />
        )}

        {/* Reset Button */}
        {hasActiveFilters && onReset !== undefined && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-3 text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Active filter tags display */}
      {hasActiveFilters && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">Bộ lọc đang áp dụng:</span>

          {timePeriod && (
            <ActiveFilterTag
              label="Thời gian"
              value={TIME_PERIOD_LABELS[timePeriod]}
              onRemove={() => onTimePeriodChange?.(null)}
            />
          )}

          {isCustomPeriod && startDate && (
            <ActiveFilterTag
              label="Từ ngày"
              value={startDate.toLocaleDateString('vi-VN')}
              onRemove={() => onStartDateChange?.(undefined)}
            />
          )}

          {isCustomPeriod && endDate && (
            <ActiveFilterTag
              label="Đến ngày"
              value={endDate.toLocaleDateString('vi-VN')}
              onRemove={() => onEndDateChange?.(undefined)}
            />
          )}

          {departmentId && departmentOptions.length > 0 && (
            <ActiveFilterTag
              label="Phòng ban"
              value={departmentOptions.find(o => o.value === departmentId)?.label || departmentId}
              onRemove={() => onDepartmentChange?.(null)}
            />
          )}

          {teamId && teamOptions.length > 0 && (
            <ActiveFilterTag
              label="Team"
              value={teamOptions.find(o => o.value === teamId)?.label || teamId}
              onRemove={() => onTeamChange?.(null)}
            />
          )}

          {memberId && memberOptions.length > 0 && (
            <ActiveFilterTag
              label="Nhân viên"
              value={memberOptions.find(o => o.value === memberId)?.label || memberId}
              onRemove={() => onMemberChange?.(null)}
            />
          )}

          {tags && tags.length > 0 && (
            <ActiveFilterTag
              label="Tags"
              value={tags.length === 1 ? (typeof tags[0] === 'string' ? tags[0] : (tags[0] as TagItem).label) : `${tags.length} tags`}
              onRemove={() => onTagsChange?.([])}
            />
          )}

          {customTags && customTags.length > 0 && (
            <ActiveFilterTag
              label="Custom"
              value={customTags.length === 1 ? customTags[0] : `${customTags.length} tags`}
              onRemove={() => onCustomTagsChange?.([])}
            />
          )}

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors underline cursor-pointer ml-2"
          >
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  );
}