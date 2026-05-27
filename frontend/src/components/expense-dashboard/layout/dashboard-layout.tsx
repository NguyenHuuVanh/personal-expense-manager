"use client";

import { useState, createContext, useContext, type ReactNode, useEffect, useCallback } from "react";
import { cn } from "@/utils/cn";
import { TopBar } from "@/components/expense-dashboard/layout/topbar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DateRangeProvider } from "@/contexts/date-range-context";

interface DashboardContextType {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
  isRightPanelVisible: boolean;
  setIsRightPanelVisible: (value: boolean) => void;
  isMobile: boolean;
  setIsMobile: (value: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (value: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardLayout");
  }
  return context;
}

interface DashboardLayoutProps {
  sidebar?: ReactNode;
  topbar?: ReactNode;
  main: ReactNode;
  rightPanel?: ReactNode;
  className?: string;
}

export function DashboardLayout({
  sidebar,
  topbar,
  main,
  rightPanel,
  className,
}: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
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

  const handleMobileMenuClick = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  // Render sidebar inside context - either custom sidebar or default AppSidebar
  const renderSidebar = () => {
    if (sidebar) {
      return sidebar;
    }
    return (
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={setIsSidebarCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
      />
    );
  };

  // Render topbar inside context - either custom topbar or default with mobile menu
  const renderTopbar = () => {
    if (topbar) {
      return topbar;
    }
    return (
      <TopBar />
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isRightPanelVisible,
        setIsRightPanelVisible,
        isMobile,
        setIsMobile,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        activeView,
        setActiveView,
      }}
    >
      <DateRangeProvider>
      <div
        className={cn("flex h-screen bg-[#F2F4F8]", className)}
      >
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "h-full shrink-0 transition-all duration-300 ease-in-out flex flex-col",
            isSidebarCollapsed ? "w-16" : "w-[220px]",
            isMobile
              ? cn(
                  "fixed left-0 top-0 z-40 bg-white",
                  isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
                )
              : "hidden lg:flex",
          )}
        >
          {renderSidebar()}
        </aside>

        {/* Main Area (TopBar + Content + Right Panel) */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* TopBar */}
          <header className="h-[64px] shrink-0 border-b bg-white">
            {renderTopbar()}
          </header>

          {/* Content Area (Main + Right Panel) */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main Content - Scrollable */}
            <main className="flex-1 overflow-y-auto hide-scrollbar p-3 sm:p-4 lg:p-4">
              {main}
            </main>

            {/* Right Panel */}
            {rightPanel && isRightPanelVisible && (
              <aside
                className={cn(
                  "h-full shrink-0 overflow-y-auto hide-scrollbar bg-white transition-all duration-300",
                  "hidden xl:block",
                  "w-[350px]",
                )}
              >
                {rightPanel}
              </aside>
            )}
          </div>
        </div>
      </div>
      </DateRangeProvider>
    </DashboardContext.Provider>
  );
}
