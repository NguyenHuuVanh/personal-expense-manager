export type IFormDefault<Values = any> = {
  formik?: any;
  msgError?: string;
};

export type FieldWapperOmit = Record<string, never>;

export interface IOptionSelect {
  value: string;
  label: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface IGetValueSelect<T extends boolean = false> {
  values: T extends false ? string | undefined : string[];
}
