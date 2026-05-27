'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { GoalsList } from '@/components/goals/goals-list';
import { GoalFormDialog } from '@/components/goals/goal-form-dialog';
import { Button } from '@/components/shadcn-ui/button';
import { Plus } from 'lucide-react';

export default function GoalsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <DashboardShell
      title="Mục tiêu"
      subtitle="Theo dõi tiến độ tiết kiệm của bạn"
      actions={
        <GoalFormDialog
          trigger={
            <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]">
              <Plus className="w-4 h-4 mr-2" />
              Tạo mục tiêu
            </Button>
          }
          onSuccess={handleRefresh}
        />
      }
    >
      <GoalsList refreshKey={refreshKey} onGoalUpdated={handleRefresh} />
    </DashboardShell>
  );
}
