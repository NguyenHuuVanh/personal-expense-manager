export type KPICardColor = 'blue' | 'green' | 'red' | 'purple' | 'orange';

export interface KPICardColorConfig {
  bg: string;
  border: string;
  icon: string;
  value: string;
}

export type KPICardFormat = 'currency' | 'percent' | 'compact' | 'number';

export interface KPICardProps {
  label: string;
  value?: number;
  icon: React.ReactNode;
  trend?: number | undefined;
  format?: KPICardFormat;
  color?: KPICardColor;
  isLoading?: boolean;
  sparklineData?: number[];
}

export interface MiniSparklineProps {
  data: number[];
  color: KPICardColor;
}
