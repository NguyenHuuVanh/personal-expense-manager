'use client';

import { useDashboard } from './dashboard-layout';
import { useRouter } from 'next/navigation';
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

import { NAVIGATION_SECTIONS, BOTTOM_NAV_ITEMS, SIDEBAR_COPYRIGHT } from '@/constants/sidebar';
import type { SidebarViewId } from '@/types/sidebar';

export function Sidebar() {
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    activeView,
    setActiveView,
    isMobile,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useDashboard();

  const router = useRouter();

  const handleNavClick = (itemId: string) => {
    // Wallets uses external route
    if (itemId === 'wallets') {
      router.push('/wallets');
      return;
    }
    setActiveView(itemId);
    if (isMobile) setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Logo */}
      <div className={cn(
        'flex items-center h-[64px] px-3 lg:px-4 border-b',
        isSidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {/* Mobile Close Button */}
        {isMobile && isMobileSidebarOpen && (
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-[#EAE8FD] text-[#9EA3B8] hover:text-[#827BF2] transition-colors mr-2"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Logo + Brand Name */}
        <div className={cn(
          'flex items-center gap-2 min-w-0 overflow-hidden',
          isSidebarCollapsed ? 'w-0 opacity-0' : 'flex-1 opacity-100'
        )}>
          <div className="w-8 h-8 rounded-lg bg-[#827BF2] flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base lg:text-lg text-[#1A1D2E] whitespace-nowrap">Expense Manager</span>
        </div>

        {/* Collapse Toggle - only on lg+ */}
        {!isMobile && (
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={cn(
              'p-1.5 rounded-lg hover:bg-[#EAE8FD] text-[#9EA3B8] hover:text-[#827BF2] transition-colors shrink-0',
            )}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto hide-scrollbar py-4 px-2">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            {/* Section Label */}
            <div
              className={cn(
                'px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[#9EA3B8] overflow-hidden whitespace-nowrap',
                isSidebarCollapsed ? 'w-0 opacity-0 h-0' : 'opacity-100 h-auto'
              )}
            >
              {section.label}
            </div>

            {/* Nav Items */}
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors',
                  activeView === item.id
                    ? 'bg-[#827BF2] text-white'
                    : 'text-[#5A607F] hover:bg-[#EAE8FD] hover:text-[#827BF2]',
                  isSidebarCollapsed && 'justify-center px-2'
                )}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                <span
                  className={cn(
                    'text-sm font-medium overflow-hidden whitespace-nowrap',
                    isSidebarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'
                  )}
                >
                  {item.label}
                </span>
                {item.badge && !isSidebarCollapsed && (
                  <span className={cn(
                    'ml-auto px-1.5 py-0.5 text-xs font-semibold rounded-full shrink-0',
                    activeView === item.id
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E40127] text-white'
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="border-t px-2 py-4">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-[#5A607F] hover:bg-[#EAE8FD] hover:text-[#827BF2] transition-colors',
              isSidebarCollapsed && 'justify-center px-2'
            )}
            title={isSidebarCollapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            <span
              className={cn(
                'text-sm font-medium overflow-hidden whitespace-nowrap',
                isSidebarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'
              )}
            >
              {item.label}
            </span>
          </button>
        ))}

        {/* Copyright */}
        <div
          className={cn(
            'px-3 pt-2 text-xs text-[#9EA3B8] overflow-hidden whitespace-nowrap',
            isSidebarCollapsed ? 'w-0 opacity-0' : 'opacity-100'
          )}
        >
          {SIDEBAR_COPYRIGHT}
        </div>
      </div>
    </div>
  );
}
