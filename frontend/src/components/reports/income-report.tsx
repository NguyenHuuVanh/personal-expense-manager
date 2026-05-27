'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format-number';
import { getIconById } from '@/data/icons';
import { CategoryBreakdownChart } from './category-breakdown-chart';
import { ReportSummaryCards } from './report-summary-cards';
import type { ReportCategory, ReportTransaction } from '@/types/report';

const INCOME_API_ENDPOINT = '/api/reports?type=income';

interface IncomeReportData {
  categories: ReportCategory[];
  transactions: ReportTransaction[];
  totalIncome: number;
}

export function IncomeReport() {
  const [categories, setCategories] = useState<ReportCategory[]>([]);
  const [transactions, setTransactions] = useState<ReportTransaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncomeReport = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(INCOME_API_ENDPOINT);
      const data: Partial<IncomeReportData> = await response.json();

      setCategories(data.categories ?? []);
      setTransactions(data.transactions ?? []);
      setTotalIncome(data.totalIncome ?? 0);
    } catch (error) {
      console.error('Error fetching income report:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchIncomeReport();
  }, [fetchIncomeReport]);

  const formatTransactionDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  }, []);

  const renderTransactionRow = useCallback(
    (transaction: ReportTransaction) => {
      const category = transaction.categoryId;
      const iconColor = category?.color || '#21AE5A';
      const IconComp = getIconById(category?.icon || 'wallet');
      const displayName =
        transaction.description || category?.name || 'Thu nhập';

      return (
        <div
          key={transaction._id}
          className="flex items-center justify-between p-3 bg-[#21AE5A]/5 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${iconColor}20` }}
            >
              <IconComp className="w-5 h-5" style={{ color: iconColor }} />
            </div>
            <div>
              <p className="font-medium text-[#1A1D2E]">{displayName}</p>
              <p className="text-sm text-[#5A607F]">
                {formatTransactionDate(transaction.date)}
              </p>
            </div>
          </div>
          <p className="font-semibold text-[#21AE5A] whitespace-nowrap">
            +{formatCurrency(transaction.amount)}
          </p>
        </div>
      );
    },
    [formatTransactionDate]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#827BF2]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards — tái sử dụng component dùng chung */}
      <ReportSummaryCards
        variant="income"
        totalAmount={totalIncome}
        transactionCount={transactions.length}
      />

      {/* Pie chart + danh sách category — tái sử dụng component dùng chung */}
      <CategoryBreakdownChart
        variant="income"
        categories={categories}
        total={totalIncome}
        chartTitle="Thu nhập theo danh mục"
        detailTitle="Chi tiết thu nhập"
      />

      {/* Income transaction list */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thu nhập</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-3">{transactions.map(renderTransactionRow)}</div>
          ) : (
            <div className="py-8 text-center text-[#5A607F]">
              Không có giao dịch thu nhập
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
