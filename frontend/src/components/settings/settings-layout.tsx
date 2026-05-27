'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { Switch } from '@/components/shadcn-ui/switch';
import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';
import { SelectField } from '@/components/custom-fields/select-field';
import { Separator } from '@/components/shadcn-ui/separator';
import { AccountSettings } from './account-settings';
import { WalletSettings } from './wallet-settings';
import { NotificationSettings } from './notification-settings';
import { AppearanceSettings } from './appearance-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn-ui/tabs';

export function SettingsLayout() {
  return (
    <Tabs defaultValue="account" className="space-y-6">
      <div className="bg-white rounded-xl border p-1">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
          <TabsTrigger value="wallets">Ví tiền</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="appearance">Giao diện</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="account">
        <AccountSettings />
      </TabsContent>

      <TabsContent value="wallets">
        <WalletSettings />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="appearance">
        <AppearanceSettings />
      </TabsContent>
    </Tabs>
  );
}
