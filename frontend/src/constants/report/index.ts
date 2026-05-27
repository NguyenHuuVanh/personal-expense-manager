import type { CategoryBreakdownVariant } from '@/types/report';

interface VariantConfig {
  totalLabel: string;
  totalColor: string;
  emptyMessage: string;
  defaultColor: string;
}

export const CATEGORY_BREAKDOWN_CONFIG: Record<CategoryBreakdownVariant, VariantConfig> = {
  expense: {
    totalLabel: 'Tổng cộng',
    totalColor: '#E40127',
    emptyMessage: 'Không có dữ liệu chi tiêu',
    defaultColor: '#9EA3B8',
  },
  income: {
    totalLabel: 'Tổng cộng',
    totalColor: '#21AE5A',
    emptyMessage: 'Không có dữ liệu thu nhập',
    defaultColor: '#21AE5A',
  },
};

interface SummaryCardConfig {
  totalLabel: string;
  countLabel: string;
  totalColor: string;
  iconBgColor: string;
  totalCardBg: string;
}

export const REPORT_SUMMARY_CONFIG: Record<CategoryBreakdownVariant, SummaryCardConfig> = {
  expense: {
    totalLabel: 'Tổng chi tiêu tháng này',
    countLabel: 'Số giao dịch chi tiêu',
    totalColor: '#E40127',
    iconBgColor: '#E40127',
    totalCardBg: 'bg-gradient-to-br from-[#E40127]/10 to-[#E40127]/5',
  },
  income: {
    totalLabel: 'Tổng thu nhập tháng này',
    countLabel: 'Số giao dịch thu nhập',
    totalColor: '#21AE5A',
    iconBgColor: '#21AE5A',
    totalCardBg: 'bg-gradient-to-br from-[#21AE5A]/10 to-[#21AE5A]/5',
  },
};

// Config cho pie chart
export const PIE_CHART_CONFIG = {
  innerRadius: 60,
  outerRadius: 100,
  paddingAngle: 2,
  height: 300,
} as const;
