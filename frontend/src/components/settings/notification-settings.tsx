'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { Switch } from '@/components/shadcn-ui/switch';
import { Separator } from '@/components/shadcn-ui/separator';

interface NotificationItemProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function NotificationItem({ title, description, checked, onChange }: NotificationItemProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-[#1A1D2E]">{title}</p>
        <p className="text-sm text-[#5A607F]">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    budgetAlerts: true,
    lowBalance: true,
    weeklyReport: true,
    monthlyReport: true,
    promotions: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông báo</CardTitle>
          <CardDescription>
            Quản lý cách bạn nhận thông báo từ ứng dụng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationItem
            title="Thông báo đẩy"
            description="Nhận thông báo trên thiết bị"
            checked={settings.pushEnabled}
            onChange={(checked) => setSettings({ ...settings, pushEnabled: checked })}
          />
          <Separator />
          <NotificationItem
            title="Thông báo qua Email"
            description="Nhận thông báo qua email"
            checked={settings.emailNotifications}
            onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
          />
          <Separator />
          <NotificationItem
            title="Thông báo SMS"
            description="Nhận thông báo qua tin nhắn SMS"
            checked={settings.smsNotifications}
            onChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cảnh báo</CardTitle>
          <CardDescription>Các cảnh báo quan trọng</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationItem
            title="Cảnh báo ngân sách"
            description="Nhận thông báo khi chi tiêu vượt ngân sách"
            checked={settings.budgetAlerts}
            onChange={(checked) => setSettings({ ...settings, budgetAlerts: checked })}
          />
          <Separator />
          <NotificationItem
            title="Cảnh báo số dư thấp"
            description="Nhận thông báo khi số dư ví thấp"
            checked={settings.lowBalance}
            onChange={(checked) => setSettings({ ...settings, lowBalance: checked })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Báo cáo</CardTitle>
          <CardDescription>Nhận báo cáo định kỳ</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationItem
            title="Báo cáo hàng tuần"
            description="Nhận tổng kết chi tiêu hàng tuần"
            checked={settings.weeklyReport}
            onChange={(checked) => setSettings({ ...settings, weeklyReport: checked })}
          />
          <Separator />
          <NotificationItem
            title="Báo cáo hàng tháng"
            description="Nhận tổng kết chi tiêu hàng tháng"
            checked={settings.monthlyReport}
            onChange={(checked) => setSettings({ ...settings, monthlyReport: checked })}
          />
          <Separator />
          <NotificationItem
            title="Khuyến mãi & Ưu đãi"
            description="Nhận thông tin về khuyến mãi mới"
            checked={settings.promotions}
            onChange={(checked) => setSettings({ ...settings, promotions: checked })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
