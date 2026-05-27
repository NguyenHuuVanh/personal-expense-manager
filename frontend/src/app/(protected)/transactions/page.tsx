'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { TransactionsList } from '@/components/transactions/transactions-list';
import { Button } from '@/components/shadcn-ui/button';
import { Plus } from 'lucide-react';
import { AddTransactionModal } from '@/components/transactions/add-transaction-modal';

export default function TransactionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <DashboardShell
        title="Giao dịch"
        subtitle="Quản lý và theo dõi các giao dịch của bạn"
        actions={
          <Button
            className="bg-[#827BF2] hover:bg-[#6B5FD4]"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm giao dịch
          </Button>
        }
      >
        <TransactionsList />
      </DashboardShell>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
