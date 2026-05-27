import { DashboardShell } from '@/components/layout/dashboard-shell';
import { ProfileLayout } from '@/components/profile/profile-layout';

export default function ProfilePage() {
  return (
    <DashboardShell title="Hồ sơ" subtitle="Quản lý thông tin cá nhân của bạn">
      <ProfileLayout />
    </DashboardShell>
  );
}
