'use client';

import { cn } from '@/utils/cn';
import {
  Wallet,
  ArrowUpDown,
  Plus,
} from 'lucide-react';
import { formatCurrency } from '@/utils/format-number';

import { QUICK_LINKS } from '@/constants/balance-card';
import type { BalanceCardProps } from '@/types/balance-card';

export function BalanceCard({
  className,
  totalIncome = 0,
  totalExpense = 0,
  netBalance = 0,
  incomeTrend = 0,
  expenseTrend = 0,
  balanceTrend = 0,
}: BalanceCardProps) {
  return (
    <div className={cn('bg-white rounded-xl p-4 sm:p-6 shadow-sm', className)}>
      {/* Balance Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-[#5A607F] mb-1">Số dư hiện tại</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1D2E] truncate">
            {formatCurrency(netBalance)}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#21AE5A]/10 text-[#21AE5A] text-xs font-medium rounded-full">
              <span>▲</span>
              <span>+{balanceTrend}%</span>
            </span>
            <span className="text-xs text-[#9EA3B8] hidden sm:inline">so với tháng trước</span>
          </div>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#827BF2]/10 flex items-center justify-center shrink-0 ml-2">
          <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-[#827BF2]" />
        </div>
      </div>

      {/* Income / Expense Summary */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 rounded-lg bg-[#21AE5A]/5">
          <p className="text-xs text-[#5A607F] mb-1">Thu nhập tháng</p>
          <p className="text-sm sm:text-lg font-semibold text-[#21AE5A] truncate">
            +{formatCurrency(totalIncome)}
          </p>
          <p className="text-xs text-[#21AE5A] mt-1 hidden sm:block">▲ +{incomeTrend}%</p>
        </div>
        <div className="p-2 sm:p-3 rounded-lg bg-[#F66PAC]/5">
          <p className="text-xs text-[#5A607F] mb-1">Chi tiêu tháng</p>
          <p className="text-sm sm:text-lg font-semibold text-[#F66PAC] truncate">
            -{formatCurrency(totalExpense)}
          </p>
          <p className="text-xs text-[#F66PAC] mt-1 hidden sm:block">▼ -{expenseTrend}%</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#827BF2] text-white rounded-lg font-medium text-xs sm:text-sm hover:bg-[#827BF2]/90 transition-colors">
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Nạp tiền</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#F2F4F8] text-[#1A1D2E] rounded-lg font-medium text-xs sm:text-sm hover:bg-[#EAE8FD] transition-colors">
          <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Chuyển</span>
        </button>
      </div>
    </div>
  );
}

interface QuickLinksProps {
  className?: string;
}

export function QuickLinks({ className }: QuickLinksProps) {
  return (
    <div className={cn('bg-white rounded-xl p-4 sm:p-6 shadow-sm', className)}>
      <h3 className="text-sm font-semibold text-[#1A1D2E] mb-3 sm:mb-4">Thao tác nhanh</h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {QUICK_LINKS.map((link, index) => (
          <button
            key={index}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border border-transparent',
              'hover:border-[#ECEEF5] hover:bg-[#F2F4F8] transition-all',
              'text-left'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                link.bgColor
              )}
              style={{ color: link.color }}
            >
              {link.icon}
            </div>
            <span className="text-sm font-medium text-[#1A1D2E]">{link.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
