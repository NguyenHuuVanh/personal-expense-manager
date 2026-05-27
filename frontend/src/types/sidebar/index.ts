import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export type SidebarViewId = 'dashboard' | 'transactions' | 'budgets' | 'reports' | 'goals' | 'categories' | 'settings' | 'help';
