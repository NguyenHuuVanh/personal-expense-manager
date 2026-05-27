'use client';

import { TrendingUp, TrendingDown, Wallet, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/shadcn-ui/card';
import { Button } from '@/components/shadcn-ui/button';
import { formatCurrency } from '@/utils/format-number';
import { useBudgets } from '@/hooks/use-budgets';

export function BudgetOverview() {
  const { budgets, isLoading, error, fetchBudgets, totalBudget, totalSpent } = useBudgets('month');
  
  const overBudgetCount = budgets.filter((item) => item.isOverBudget || item.spentAmount > item.budgetAmount).length;
  const remaining = totalBudget - totalSpent;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#827BF2]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => fetchBudgets()}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#827BF2]/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-[#827BF2]" />
            </div>
            <div>
              <p className="text-sm text-[#5A607F]">Tổng ngân sách</p>
              <p className="text-lg font-bold text-[#1A1D2E]">{formatCurrency(totalBudget)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F66PAC]/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-[#F66PAC]" />
            </div>
            <div>
              <p className="text-sm text-[#5A607F]">Đã chi</p>
              <p className="text-lg font-bold text-[#E40127]">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#21AE5A]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#21AE5A]" />
            </div>
            <div>
              <p className="text-sm text-[#5A607F]">Còn lại</p>
              <p className="text-lg font-bold text-[#21AE5A]">{formatCurrency(remaining)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E40127]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#E40127]" />
            </div>
            <div>
              <p className="text-sm text-[#5A607F]">Vượt ngân sách</p>
              <p className="text-lg font-bold text-[#E40127]">{overBudgetCount} danh mục</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
