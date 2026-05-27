import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart3,
  Trophy,
  FolderOpen,
  Settings,
  HelpCircle,
  Wallet,
} from 'lucide-react';
import type { NavSection, NavItem } from '@/types/sidebar';

export const NAVIGATION_SECTIONS: readonly NavSection[] = [
  {
    label: 'Tổng Quan',
    items: [
      { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'transactions', label: 'Giao Dịch', icon: <Receipt className="w-5 h-5" /> },
      { id: 'budgets', label: 'Ngân Sách', icon: <Target className="w-5 h-5" />, badge: 2 },
    ],
  },
  {
    label: 'Phân Tích',
    items: [
      { id: 'reports', label: 'Báo Cáo', icon: <BarChart3 className="w-5 h-5" /> },
      { id: 'goals', label: 'Mục Tiêu', icon: <Trophy className="w-5 h-5" /> },
      { id: 'categories', label: 'Danh Mục', icon: <FolderOpen className="w-5 h-5" /> },
      { id: 'wallets', label: 'Ví Của Tôi', icon: <Wallet className="w-5 h-5" /> },
    ],
  },
] as const;

export const BOTTOM_NAV_ITEMS: readonly NavItem[] = [
  { id: 'settings', label: 'Cài Đặt', icon: <Settings className="w-5 h-5" /> },
  { id: 'help', label: 'Trợ Giúp', icon: <HelpCircle className="w-5 h-5" /> },
] as const;

export const SIDEBAR_COPYRIGHT = '© 2026 Expense Manager';
