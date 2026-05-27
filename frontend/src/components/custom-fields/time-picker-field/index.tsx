'use client';

import { Label } from '@/components/shadcn-ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn-ui/select';

type TimePickerFieldProps = {
  label?: string;
  value: Date | undefined;
  onChange: (date: Date) => void;
};

export function TimePickerField({ label, value, onChange }: TimePickerFieldProps) {
  const getRaw = (d: Date | undefined) => {
    if (!d) {
      return { h: 0, m: 0 };
    }
    const hh = d.getHours();
    const mm = d.getMinutes();
    return { h: hh, m: mm };
  };

  const raw = getRaw(value);

  const applyChange = (h: number, m: number) => {
    const base = value ? new Date(value) : new Date();
    base.setHours(h, m, 0, 0);
    onChange(new Date(base));
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label className="font-bold">{label}</Label>
      )}
      <div className="inline-flex items-center gap-1.5 h-9">
        <Select
          value={String(raw.h)}
          onValueChange={val => applyChange(Number.parseInt(val), raw.m)}
        >
          <SelectTrigger className="h-9 w-[60px] rounded-md border border-input bg-background shadow-sm text-sm font-normal px-2">
            <SelectValue>{String(raw.h).padStart(2, '0')}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-56 min-w-[64px] z-[9999]" position="popper" sideOffset={4}>
            {hours.map(h => (
              <SelectItem key={h} value={String(h)} className="cursor-pointer">
                {String(h).padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground font-medium select-none">:</span>

        <Select
          value={String(raw.m)}
          onValueChange={val => applyChange(raw.h, Number.parseInt(val))}
        >
          <SelectTrigger className="h-9 w-[60px] rounded-md border border-input bg-background shadow-sm text-sm font-normal px-2">
            <SelectValue>{String(raw.m).padStart(2, '0')}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-56 min-w-[64px] z-[9999]" position="popper" sideOffset={4}>
            {minutes.map(m => (
              <SelectItem key={m} value={String(m)} className="cursor-pointer">
                {String(m).padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
