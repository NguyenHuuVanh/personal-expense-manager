import type { CategoryOption } from '@/types/category';

export type { CategoryOption } from '@/types/category';

export type PeriodValue = 'daily' | 'weekly' | 'monthly';

export interface BudgetFormData {
  categoryId: string;
  budgetAmount: number;
  period: string;
}

export interface BudgetFormDialogProps {
  trigger: React.ReactNode;
  initialData?: {
    _id?: string;
    categoryId: string;
    budgetAmount: number;
    period: string;
  };
  onSuccess?: () => void;
}

export interface BudgetItem {
  _id: string;
  categoryId: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
  budgetAmount: number;
  spentAmount: number;
  period: 'daily' | 'weekly' | 'monthly';
  isOverBudget?: boolean;
}

export interface BudgetCardItem {
  _id: string;
  categoryId: CategoryOption;
  budgetAmount: number;
  spentAmount: number;
  period: string;
  isOverBudget?: boolean;
}

export interface BudgetCardProps {
  item: BudgetCardItem;
  onUpdate?: () => void;
}

export interface BudgetEditData {
  budgetAmount: number;
  period: string;
}
