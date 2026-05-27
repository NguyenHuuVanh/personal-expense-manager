import { DashboardShell } from '@/components/layout/dashboard-shell';
import { ReportOverview } from '@/components/reports/report-overview';
import { ExpenseReport } from '@/components/reports/expense-report';
import { IncomeReport } from '@/components/reports/income-report';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn-ui/tabs';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/shadcn-ui/button';

export default function ReportsPage() {
  return (
    <DashboardShell
      title="Báo cáo"
      subtitle="Phân tích chi tiêu và thu nhập của bạn"
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]">
            Tạo báo cáo
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="expense">Chi tiêu</TabsTrigger>
          <TabsTrigger value="income">Thu nhập</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ReportOverview />
        </TabsContent>
        <TabsContent value="expense">
          <ExpenseReport />
        </TabsContent>
        <TabsContent value="income">
          <IncomeReport />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
