import type { KPICardColor, KPICardColorConfig } from '@/types/kpi-card';

export const COLOR_MAP: Record<KPICardColor, KPICardColorConfig> = {
  blue: {
    bg: 'bg-blue-50/80',
    border: 'border-blue-200/50',
    icon: 'text-blue-600',
    value: 'text-blue-700',
  },
  green: {
    bg: 'bg-green-50/80',
    border: 'border-green-200/50',
    icon: 'text-green-600',
    value: 'text-green-700',
  },
  red: {
    bg: 'bg-red-50/80',
    border: 'border-red-200/50',
    icon: 'text-red-600',
    value: 'text-red-700',
  },
  purple: {
    bg: 'bg-purple-50/80',
    border: 'border-purple-200/50',
    icon: 'text-purple-600',
    value: 'text-purple-700',
  },
  orange: {
    bg: 'bg-orange-50/80',
    border: 'border-orange-200/50',
    icon: 'text-orange-600',
    value: 'text-orange-700',
  },
} as const;
