"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import { Input } from "../shadcn-ui/input";
import { useAuth } from "@/contexts/auth-context";

interface TopBarProps {
  className?: string;
  onSearchChange?: (query: string) => void;
  onMenuClick?: () => void;
}

export function TopBar({ className, onSearchChange, onMenuClick }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount] = useState(3);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  const handleLogout = useCallback(async () => {
    setShowUserMenu(false);
    await logout();
    window.location.href = "/login";
  }, [logout]);

  const handleNavigate = useCallback((path: string) => {
    setShowUserMenu(false);
    window.location.href = path;
  }, []);

  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, right: 16 };
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right - 12,
    };
  };

  const userMenuDropdown = mounted ? (
    <div
      ref={userMenuRef}
      className={cn(
        "fixed min-w-[240px] bg-white rounded-xl shadow-2xl border border-[#E0E3EC] py-2 z-[9998] transition-all duration-200",
        showUserMenu
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      )}
      style={showUserMenu ? getDropdownPosition() : {}}
    >
      <div className="px-4 py-3 border-b border-[#E0E3EC]">
        <p className="text-sm font-semibold text-[#1A1D2E] truncate">
          {user?.name || "Người dùng"}
        </p>
        <p className="text-xs text-[#9EA3B8] truncate mt-0.5">
          {user?.email || "email@example.com"}
        </p>
      </div>

      <div className="py-1">
        <button
          onClick={() => handleNavigate("/profile")}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A607F] hover:bg-[#F2F4F8] transition-colors"
        >
          <User className="w-4 h-4" />
          Hồ sơ
        </button>
        <button
          onClick={() => handleNavigate("/settings")}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A607F] hover:bg-[#F2F4F8] transition-colors"
        >
          <Settings className="w-4 h-4" />
          Cài đặt
        </button>
      </div>

      <div className="border-t border-[#E0E3EC] py-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E40127] hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-between h-full px-3 lg:px-6 gap-4 sm:gap-4",
          className,
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-[#F2F4F8] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-[#5A607F]" />
          </button>

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

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <button className="relative p-2 rounded-lg hover:bg-[#F2F4F8] transition-colors">
            <Bell className="w-5 h-5 text-[#5A607F]" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#E40127] text-white text-xs font-bold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          <button
            ref={buttonRef}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pr-2 rounded-lg hover:bg-[#F2F4F8] transition-colors"
            aria-expanded={showUserMenu}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-[#827BF2] flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="hidden md:block text-sm font-medium text-[#1A1D2E] truncate max-w-[120px]">
              {user?.name || "Người dùng"}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-[#9EA3B8] transition-transform duration-200",
                showUserMenu && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {mounted && createPortal(userMenuDropdown, document.body)}
    </>
  );
}
