"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { AppSidebar } from "./app-sidebar";
import { TopBar } from "./top-bar";

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DashboardShell({ children, title, subtitle, actions }: DashboardShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsMobileSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-[#F2F4F8] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "h-full shrink-0 transition-all duration-300 ease-in-out flex flex-col",
          isSidebarCollapsed ? "w-16" : "w-[220px]",
          isMobile
            ? cn("fixed left-0 top-0 z-40 bg-white", isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full")
            : "hidden lg:flex",
        )}
      >
        <AppSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={setIsSidebarCollapsed}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />
      </aside>

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* TopBar */}
        <header className="h-[64px] shrink-0 border-b bg-white overflow-visible relative z-10">
          <TopBar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto hide-scrollbar">
          {/* Page Header */}
          {(title || actions) && (
            <div className="bg-white border-b px-4 lg:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {title && <h1 className="text-xl lg:text-2xl font-bold text-[#1A1D2E]">{title}</h1>}
                  {subtitle && <p className="text-sm text-[#5A607F] mt-1">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            </div>
          )}

          {/* Page Content */}
          <div className="p-4 lg:p-6 overflow-y-auto styled-scrollbar">{children}</div>
        </main>
      </div>
    </div>
  );
}
