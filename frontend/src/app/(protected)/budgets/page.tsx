'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { BudgetOverview } from '@/components/budgets/budget-overview';
import { BudgetsTable } from '@/components/budgets/budgets-table';
import { BudgetFormDialog } from '@/components/budgets/budget-form-dialog';
import { Button } from '@/components/shadcn-ui/button';
import { Plus } from 'lucide-react';

export default function BudgetsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <DashboardShell
      title="Ngân sách"
      subtitle="Quản lý và theo dõi ngân sách của bạn"
      actions={
        <BudgetFormDialog
          trigger={
            <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]">
              <Plus className="w-4 h-4 mr-2" />
              Tạo ngân sách
            </Button>
          }
          onSuccess={handleRefresh}
        />
      }
    >
      <div className="space-y-6">
        <BudgetOverview key={`overview-${refreshKey}`} />
        <BudgetsTable refreshKey={refreshKey} />
      </div>
    </DashboardShell>
  );
}
