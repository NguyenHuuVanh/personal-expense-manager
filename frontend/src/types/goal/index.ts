export interface GoalFormData {
  name: string;
  targetAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

export interface SavingGoal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface GoalFormDialogProps {
  trigger: React.ReactNode;
  initialData?: {
    _id?: string;
    name: string;
    targetAmount: number;
    deadline: string;
    icon: string;
    color: string;
  };
  onSuccess?: () => void;
}

export interface GoalItem {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface GoalCardProps {
  goal: GoalItem;
  onDelete?: () => void;
  onAddAmount?: (amount: number) => void;
}
