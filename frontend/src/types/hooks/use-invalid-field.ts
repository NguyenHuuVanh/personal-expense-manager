export type IUseInvalidFieldReturn = {
  errorMessage: string;
  isInvalid: boolean;
};

export type IUseInvalidField<T = any> = {
  formik?: any;
  msgError?: string;
  name?: string;
};
