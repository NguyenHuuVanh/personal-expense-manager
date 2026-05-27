import { Receipt, PiggyBank, BarChart3, Wallet } from 'lucide-react';
import type { QuickLink } from '@/types/balance-card';

export const QUICK_LINKS: readonly QuickLink[] = [
  {
    icon: <Receipt className="w-5 h-5" />,
    label: 'Thêm Giao Dịch',
    color: '#827BF2',
    bgColor: 'bg-[#827BF2]/10',
  },
  {
    icon: <PiggyBank className="w-5 h-5" />,
    label: 'Đặt Ngân Sách',
    color: '#21AE5A',
    bgColor: 'bg-[#21AE5A]/10',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: 'Xem Báo Cáo',
    color: '#F66PAC',
    bgColor: 'bg-[#F66PAC]/10',
  },
  {
    icon: <Wallet className="w-5 h-5" />,
    label: 'Quản Lý Ví',
    color: '#F89C34',
    bgColor: 'bg-[#F89C34]/10',
  },
];
