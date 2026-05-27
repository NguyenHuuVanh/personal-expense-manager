'use client';
import type { FC } from 'react';
import { Checkbox } from '@/components/shadcn-ui/checkbox';
import { cn } from '@/utils/cn';
import { Label } from '@/components/shadcn-ui/label';

export type CheckboxFieldProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  isIndeterminate?: boolean;
  name?: string;
  label?: string;
  className?: string;
};

const CheckboxField: FC<CheckboxFieldProps> = ({
  name,
  label,
  checked,
  onCheckedChange,
  isIndeterminate,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Checkbox
        id={name}
        checked={checked}
        isIndeterminate={isIndeterminate}
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

export { CheckboxField };
