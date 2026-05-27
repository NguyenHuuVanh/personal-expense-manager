'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { CategoriesTable } from '@/components/categories/categories-table';
import { CategoryFormDialog } from '@/components/categories/category-form-dialog';
import { Button } from '@/components/shadcn-ui/button';
import { Plus } from 'lucide-react';

export default function CategoriesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <DashboardShell
      title="Danh mục"
      subtitle="Quản lý các danh mục chi tiêu của bạn"
      actions={
        <CategoryFormDialog
          trigger={
            <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]">
              <Plus className="w-4 h-4 mr-2" />
              Thêm danh mục
            </Button>
          }
          onSuccess={handleRefresh}
        />
      }
    >
      <div className="space-y-6">
        <CategoriesTable refreshKey={refreshKey} />
      </div>
    </DashboardShell>
  );
}
