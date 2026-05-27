'use client';
import { useMemo } from 'react';
import type { IUseInvalidField, IUseInvalidFieldReturn } from '@/types/hooks/use-invalid-field';

export const useInvalidField = ({
  msgError,
}: IUseInvalidField): IUseInvalidFieldReturn => {
  const invalid = useMemo((): IUseInvalidFieldReturn => {
    if (msgError) {
      return {
        errorMessage: msgError,
        isInvalid: !!msgError,
      };
    }

    return {
      errorMessage: '',
      isInvalid: false,
    };
  }, [msgError]);

  return invalid;
};
