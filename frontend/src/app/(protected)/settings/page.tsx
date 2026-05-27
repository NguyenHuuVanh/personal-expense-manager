import { DashboardShell } from '@/components/layout/dashboard-shell';
import { SettingsLayout } from '@/components/settings/settings-layout';

export default function SettingsPage() {
  return (
    <DashboardShell title="Cài đặt" subtitle="Quản lý tài khoản và cài đặt ứng dụng">
      <SettingsLayout />
    </DashboardShell>
  );
}
