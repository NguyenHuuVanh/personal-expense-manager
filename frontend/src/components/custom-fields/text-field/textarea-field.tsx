'use client';
import type { ComponentProps } from 'react';
import type { IFormDefault } from '@/types/fields';
import { Textarea } from '@/components/shadcn-ui/textarea';
import WapperField from '../wapper-field';

export type TextAreaFieldProps = {
  label?: string;
  required?: boolean;
  name?: string;
  msgError?: string;
  classWapper?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
} & IFormDefault
& Omit<ComponentProps<'textarea'>, 'label' | 'ref'>;

const TextAreaField = ({
  label,
  required,
  name,
  msgError,
  classWapper,
  ...props
}: TextAreaFieldProps) => {
  return (
    <WapperField
      label={label}
      required={required}
      name={name}
      msgError={msgError}
      classWapper={classWapper}
    >
      <Textarea
        id={name}
        name={name}
        autoComplete="off"
        className="shadow-sm"
        {...props}
      />
    </WapperField>
  );
};

TextAreaField.displayName = 'TextAreaField';

export { TextAreaField };
