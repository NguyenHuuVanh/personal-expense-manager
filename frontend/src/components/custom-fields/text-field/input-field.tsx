'use client';
import type { ComponentProps, ReactNode } from 'react';
import type { IFormDefault } from '@/types/fields';
import { Input } from '@/components/shadcn-ui/input';
import { cn } from '@/utils/cn';
import WapperField from '../wapper-field';

export type InputFieldProps = {
  label?: string;
  required?: boolean;
  name?: string;
  msgError?: string;
  classWapper?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
} & IFormDefault
& Omit<ComponentProps<'input'>, 'label' | 'ref'>;

const InputField = ({
  label,
  required,
  name,
  msgError,
  classWapper,
  startContent,
  endContent,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <WapperField
      label={label}
      required={required}
      name={name}
      msgError={msgError}
      classWapper={classWapper}
    >
      <div className="relative">
        {startContent}
        <Input
          id={name}
          name={name}
          className={cn(className)}
          {...props}
        />
        {endContent}
      </div>
    </WapperField>
  );
};

InputField.displayName = 'InputField';

export { InputField };
