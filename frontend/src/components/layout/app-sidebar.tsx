'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart3,
  Trophy,
  FolderOpen,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Wallet,
  X,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    label: 'Tổng Quan',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { href: '/transactions', label: 'Giao Dịch', icon: <Receipt className="w-5 h-5" /> },
      { href: '/budgets', label: 'Ngân Sách', icon: <Target className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Phân Tích',
    items: [
      { href: '/reports', label: 'Báo Cáo', icon: <BarChart3 className="w-5 h-5" /> },
      { href: '/goals', label: 'Mục Tiêu', icon: <Trophy className="w-5 h-5" /> },
      { href: '/categories', label: 'Danh Mục', icon: <FolderOpen className="w-5 h-5" /> },
      { href: '/wallets', label: 'Ví Của Tôi', icon: <Wallet className="w-5 h-5" /> },
    ],
  },
];

const bottomNavItems: NavItem[] = [
  { href: '/settings', label: 'Cài Đặt', icon: <Settings className="w-5 h-5" /> },
  { href: '/help', label: 'Trợ Giúp', icon: <HelpCircle className="w-5 h-5" /> },
];

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: (value: boolean) => void;
  isMobileSidebarOpen?: boolean;
  onCloseMobileSidebar?: () => void;
}

export function AppSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
}: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-[64px] px-3 lg:px-4 border-b',
          isCollapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {/* Mobile Close Button */}
        {isMobile && isMobileSidebarOpen && (
          <button
            onClick={onCloseMobileSidebar}
            className="p-1.5 rounded-lg hover:bg-[#EAE8FD] text-[#9EA3B8] hover:text-[#827BF2] transition-colors mr-2"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Logo + Brand Name */}
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-2 min-w-0 overflow-hidden',
            isCollapsed ? 'w-0 opacity-0' : 'flex-1 opacity-100',
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-[#827BF2] flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base lg:text-lg text-[#1A1D2E] whitespace-nowrap">
            Expense Manager
          </span>
        </Link>

        {/* Collapse Toggle - only on lg+ */}
        {!isMobile && (
          <button
            onClick={() => onToggleCollapse(!isCollapsed)}
            className={cn(
              'p-1.5 rounded-lg hover:bg-[#EAE8FD] text-[#9EA3B8] hover:text-[#827BF2] transition-colors shrink-0',
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navigationSections.map((section) => (
          <div key={section.label} className="mb-4">
            {/* Section Label */}
            <div
              className={cn(
                'px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[#9EA3B8] overflow-hidden whitespace-nowrap',
                isCollapsed ? 'w-0 opacity-0 h-0' : 'opacity-100 h-auto',
              )}
            >
              {section.label}
            </div>

            {/* Nav Items */}
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile) onCloseMobileSidebar?.();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors',
                  isActive(item.href)
                    ? 'bg-[#827BF2] text-white'
                    : 'text-[#5A607F] hover:bg-[#EAE8FD] hover:text-[#827BF2]',
                  isCollapsed && 'justify-center px-2',
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                <span
                  className={cn(
                    'text-sm font-medium overflow-hidden whitespace-nowrap',
                    isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100',
                  )}
                >
                  {item.label}
                </span>
                {item.badge && !isCollapsed && (
                  <span
                    className={cn(
                      'ml-auto px-1.5 py-0.5 text-xs font-semibold rounded-full shrink-0',
                      isActive(item.href) ? 'bg-white/20 text-white' : 'bg-[#E40127] text-white',
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="border-t px-2 py-4">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              if (isMobile) onCloseMobileSidebar?.();
            }}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-[#5A607F] hover:bg-[#EAE8FD] hover:text-[#827BF2] transition-colors',
              isCollapsed && 'justify-center px-2',
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            <span
              className={cn(
                'text-sm font-medium overflow-hidden whitespace-nowrap',
                isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100',
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}

        {/* Copyright */}
        <div
          className={cn(
            'px-3 pt-2 text-xs text-[#9EA3B8] overflow-hidden whitespace-nowrap',
            isCollapsed ? 'w-0 opacity-0' : 'opacity-100',
          )}
        >
          © 2026 Expense Manager
        </div>
      </div>
    </div>
  );
}
