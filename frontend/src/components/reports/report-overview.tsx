'use client';

import { apiFetch } from '@/lib/api-client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { formatCurrency } from '@/utils/format-number';
import { Loader2, TrendingUp, TrendingDown, PiggyBank, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { ExpenseDashboardData } from '@/types/expense-dashboard';
import { MonthlySnapshotCard } from './monthly-snapshot-card';
import { DonutChartSection } from '@/components/expense-dashboard/panels/sections/donut-chart-section';
import { useMonthlySnapshot } from '@/hooks/useMonthlySnapshot';

export function ReportOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ExpenseDashboardData | null>(null);
  const { data: snapshotData, isLoading: isSnapshotLoading } = useMonthlySnapshot();

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch('/api/reports?type=overview');
      const result = await response.json();
      if (result.summary) {
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#827BF2]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-[#5A607F]">
        KhÃ´ng cÃ³ dá»¯ liá»‡u bÃ¡o cÃ¡o
      </div>
    );
  }

  const { summary, categoryBreakdown, topExpenses, quickStats, budgetSummary } = data;

  // Tá»•ng chi tiÃªu â€” dÃ¹ng cho thanh pháº§n trÄƒm á»Ÿ "Top chi tiÃªu theo danh má»¥c"
  const totalExpense = categoryBreakdown.reduce((sum, cat) => sum + cat.total, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards - 6 cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Tá»•ng sá»‘ dÆ° */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-[#827BF2]" />
              <span className="text-xs text-[#5A607F]">Tá»•ng sá»‘ dÆ°</span>
            </div>
            <p className="text-lg font-bold text-[#1A1D2E] whitespace-nowrap">
              {formatCurrency(summary.totalBalance ?? 0)}
            </p>
          </CardContent>
        </Card>

        {/* Tá»•ng thu */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-[#21AE5A]" />
                  <span className="text-xs text-[#5A607F]">Tá»•ng thu</span>
                </div>
                <p className="text-lg font-bold text-[#21AE5A] whitespace-nowrap">
                  {formatCurrency(summary.totalIncome ?? 0)}
                </p>
                <div className={`flex items-center gap-0.5 mt-1 ${(summary.incomeTrend ?? 0) >= 0 ? 'text-[#21AE5A]' : 'text-[#E40127]'}`}>
                  {(summary.incomeTrend ?? 0) >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  <span className="text-xs font-medium">{Math.abs(summary.incomeTrend ?? 0)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tá»•ng chi */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingDown className="w-3 h-3 text-[#E40127]" />
                  <span className="text-xs text-[#5A607F]">Tá»•ng chi</span>
                </div>
                <p className="text-lg font-bold text-[#E40127] whitespace-nowrap">
                  {formatCurrency(summary.totalExpense ?? 0)}
                </p>
                <div className={`flex items-center gap-0.5 mt-1 ${(summary.expenseTrend ?? 0) <= 0 ? 'text-[#21AE5A]' : 'text-[#E40127]'}`}>
                  {(summary.expenseTrend ?? 0) <= 0 ? (
                    <ArrowDownRight className="w-3 h-3" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3" />
                  )}
                  <span className="text-xs font-medium">{Math.abs(summary.expenseTrend ?? 0)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sá»‘ dÆ° thÃ¡ng */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#827BF2]" />
              <span className="text-xs text-[#5A607F]">Sá»‘ dÆ° thÃ¡ng</span>
            </div>
            <p className={`text-lg font-bold whitespace-nowrap ${(summary.netBalance ?? 0) >= 0 ? 'text-[#21AE5A]' : 'text-[#E40127]'}`}>
              {formatCurrency(summary.netBalance ?? 0)}
            </p>
            <div className={`flex items-center gap-0.5 mt-1 ${(summary.balanceTrend ?? 0) >= 0 ? 'text-[#21AE5A]' : 'text-[#E40127]'}`}>
              {(summary.balanceTrend ?? 0) >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span className="text-xs font-medium">{Math.abs(summary.balanceTrend ?? 0)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Tá»· lá»‡ tiáº¿t kiá»‡m */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="w-4 h-4 text-[#F89C34]" />
              <span className="text-xs text-[#5A607F]">Tiáº¿t kiá»‡m</span>
            </div>
            <p className="text-lg font-bold text-[#F89C34] whitespace-nowrap">
              {summary.savingsRate}%
            </p>
          </CardContent>
        </Card>

        {/* Sá»‘ giao dá»‹ch */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-[#F66PAC]" />
              <span className="text-xs text-[#5A607F]">Giao dá»‹ch</span>
            </div>
            <p className="text-lg font-bold text-[#1A1D2E]">
              {quickStats.transactionCount}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#21AE5A]">+{quickStats.incomeCount}</span>
              <span className="text-xs text-[#E40127]">-{quickStats.expenseCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly snapshot â€” sá»‘ dÆ° Ä‘áº§u/cuá»‘i thÃ¡ng tá»«ng vÃ­ */}
      <MonthlySnapshotCard data={snapshotData} isLoading={isSnapshotLoading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Expenses Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Top chi tiÃªu theo danh má»¥c</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topExpenses && topExpenses.length > 0 ? topExpenses.map((expense) => {
                const percent = totalExpense > 0 ? (expense.total / totalExpense) * 100 : 0;
                return (
                  <div key={expense._id} className="flex items-center gap-4">
                    <div className="w-24 shrink-0">
                      <span className="text-xs font-medium text-[#1A1D2E]">{expense.name}</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-[#F2F4F8] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: expense.color,
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-32 shrink-0 text-right">
                      <span className="text-xs font-semibold text-[#1A1D2E]">
                        {formatCurrency(expense.total)}
                      </span>
                      <span className="text-[10px] text-[#5A607F] ml-1">
                        ({Math.round(percent)}%)
                      </span>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-sm text-[#5A607F] text-center py-4">ChÆ°a cÃ³ chi tiÃªu</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart â€” dÃ¹ng component dÃ¹ng chung tá»« expense dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">CÆ¡ cáº¥u chi tiÃªu</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChartSection categories={categoryBreakdown} isLoading={false} />
          </CardContent>
        </Card>
      </div>

      {/* Budget Summary */}
      {budgetSummary && budgetSummary.totalBudgetAmount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tá»•ng quan ngÃ¢n sÃ¡ch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1A1D2E]">{formatCurrency(budgetSummary.totalBudgetAmount)}</p>
                <p className="text-xs text-[#5A607F]">Tá»•ng ngÃ¢n sÃ¡ch</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#E40127]">{formatCurrency(budgetSummary.totalBudgetSpent)}</p>
                <p className="text-xs text-[#5A607F]">ÄÃ£ chi</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#21AE5A]">{formatCurrency(budgetSummary.totalBudgetRemaining)}</p>
                <p className="text-xs text-[#5A607F]">CÃ²n láº¡i</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${budgetSummary.percentUsed > 100 ? 'text-[#E40127]' : 'text-[#827BF2]'}`}>
                  {budgetSummary.percentUsed}%
                </p>
                <p className="text-xs text-[#5A607F]">Sá»­ dá»¥ng</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-3 bg-[#F2F4F8] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${budgetSummary.percentUsed > 100 ? 'bg-[#E40127]' : 'bg-[#827BF2]'}`}
                  style={{ width: `${Math.min(budgetSummary.percentUsed, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Wallet className="w-6 h-6 text-[#827BF2] mx-auto mb-2" />
            <p className="text-3xl font-bold text-[#1A1D2E]">{quickStats.transactionCount}</p>
            <p className="text-sm text-[#5A607F]">Giao dá»‹ch</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <PiggyBank className="w-6 h-6 text-[#21AE5A] mx-auto mb-2" />
            <p className="text-3xl font-bold text-[#1A1D2E]">{quickStats.categoryCount}</p>
            <p className="text-sm text-[#5A607F]">Danh má»¥c</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Wallet className="w-6 h-6 text-[#F89C34] mx-auto mb-2" />
            <p className="text-3xl font-bold text-[#1A1D2E]">{quickStats.walletCount}</p>
            <p className="text-sm text-[#5A607F]">VÃ­ tiá»n</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <TrendingUp className="w-6 h-6 text-[#F66PAC] mx-auto mb-2" />
            <p className="text-3xl font-bold text-[#1A1D2E]">{quickStats.budgetCount}</p>
            <p className="text-sm text-[#5A607F]">NgÃ¢n sÃ¡ch</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
