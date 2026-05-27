import type { FC, PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';

type ErrorMessageFieldProps = PropsWithChildren<{ className?: string }>;

const ErrorMessageField: FC<ErrorMessageFieldProps> = ({ children, className }) => {
  return <span className={cn('text-sm text-red-500', className)}>{children}</span>;
};

export default ErrorMessageField;
