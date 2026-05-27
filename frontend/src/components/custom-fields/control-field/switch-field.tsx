'use client';
import type { FC } from 'react';
import { Switch } from '@/components/shadcn-ui/switch';
import { cn } from '@/utils/cn';
import { Label } from '@/components/shadcn-ui/label';

export type SwitchFieldProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  label?: string;
  className?: string;
};

const SwitchField: FC<SwitchFieldProps> = ({
  name,
  label,
  checked,
  onCheckedChange,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Switch
        id={name}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      {label && (
        <Label htmlFor={name} className="cursor-pointer">
          {label}
        </Label>
      )}
    </div>
  );
};

export { SwitchField };
