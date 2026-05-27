'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import { Label } from '../shadcn-ui/label';
import ErrorMessageField from '../custom-fields/error-messeage-field';

export type FormFieldProps = {
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  classNameLabel?: string;
  classNameError?: string;
  children: React.ReactNode;
};

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      required,
      error,
      className,
      classNameLabel,
      classNameError,
      children,
    },
    ref,
  ) => {
    const isInvalid = !!error;

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <Label className={cn('font-medium text-sm', classNameLabel)}>
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
        )}
        {children}
        {isInvalid && (
          <ErrorMessageField className={cn(classNameError)}>
            {error}
          </ErrorMessageField>
        )}
      </div>
    );
  },
);
FormField.displayName = 'FormField';
