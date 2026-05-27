export interface CategoryOption {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CategoryFormData {
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
}

export interface CategoryWithTotal extends CategoryOption {
  type: 'income' | 'expense' | 'both';
  isDefault?: boolean;
  total?: number;
}
