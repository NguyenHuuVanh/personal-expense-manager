"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import { Input } from "@/components/shadcn-ui/input";
import { useDashboard } from "./dashboard-layout";
import { useAuth } from "@/contexts/auth-context";

interface TopBarProps {
  className?: string;
  onSearchChange?: (query: string) => void;
}

export function TopBar({ className, onSearchChange }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount] = useState(3);
  const { setIsMobileSidebarOpen } = useDashboard();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
    window.location.href = "/login";
  };

  const handleNavigate = (path: string) => {
    setShowUserMenu(false);
    router.push(path);
  };

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between h-full px-3 lg:px-6 gap-4 sm:gap-4",
        className,
      )}
    >
      {/* Left: Mobile Menu + Search */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-[#F2F4F8] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-[#5A607F]" />
        </button>

        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9EA3B8]" />
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full min-w-0 h-9 sm:h-10 pl-10 pr-4 bg-[#F2F4F8] rounded-lg text-sm text-[#1A1D2E] placeholder:text-[#9EA3B8] focus-visible:bg-white focus-visible:outline-2 focus-visible:outline-[#827BF2] transition-all border-none"
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[#F2F4F8] transition-colors">
          <Bell className="w-5 h-5 text-[#5A607F]" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#E40127] text-white text-xs font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F2F4F8] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#827BF2] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-[#1A1D2E] truncate max-w-[120px]">
              {user?.name || "Người dùng"}
            </span>
            <ChevronDown className="w-4 h-4 text-[#9EA3B8]" />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                <button
                  onClick={() => handleNavigate("/profile")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#5A607F] hover:bg-[#F2F4F8]"
                >
                  <User className="w-4 h-4" />
                  Hồ sơ
                </button>
                <button
                  onClick={() => handleNavigate("/settings")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#5A607F] hover:bg-[#F2F4F8]"
                >
                  <Settings className="w-4 h-4" />
                  Cài đặt
                </button>
                <div className="border-t my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#E40127] hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
