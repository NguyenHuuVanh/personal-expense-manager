"use client";

import { DashboardLayout, MainContent, RightPanel } from "@/components/expense-dashboard";

export default function DashboardPage() {
  return (
    <DashboardLayout
      main={<MainContent />}
      rightPanel={<RightPanel />}
    />
  );
}
