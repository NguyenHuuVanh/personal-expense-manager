'use client';
import type { FC, PropsWithChildren } from 'react';
import type { IFormDefault } from '@/types/fields';
import { Label } from '@/components/shadcn-ui/label';
import ErrorMessageField from './error-messeage-field';
import { cn } from '@/utils/cn';

export type WapperFieldProps = {
  label?: string;
  required?: boolean;
  name?: string;
  msgError?: string;
  classWapper?: string;
} & PropsWithChildren & Pick<IFormDefault, 'formik'>;

const WapperField: FC<WapperFieldProps> = ({
  label,
  required,
  name,
  children,
  msgError,
  classWapper,
}) => {
  const isInvalid = !!msgError;

  return (
    <div className={cn('flex flex-col gap-2', classWapper)}>
      {label && (
        <Label className={cn('font-bold')} htmlFor={name}>
          {label}
          {' '}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {children}
      {isInvalid && <ErrorMessageField>{msgError}</ErrorMessageField>}
    </div>
  );
};

export default WapperField;
