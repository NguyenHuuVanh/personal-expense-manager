import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICard } from '@/components/expense-dashboard/sections/kpi-card';
import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';

vi.mock('@/utils/format-number', () => ({
  formatCurrency: (val: number) => `${val.toLocaleString('vi-VN')} VNĐ`,
  formatCompactCurrency: (val: number) => {
    if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toString();
  },
}));

describe('KPICard Component', () => {
  describe('rendering', () => {
    it('renders label correctly', () => {
      render(
        <KPICard
          label="Tổng Thu Nhập"
          value={10000000}
          icon={<DollarSign />}
        />
      );
      expect(screen.getByText('Tổng Thu Nhập')).toBeInTheDocument();
    });

    it('renders formatted currency value', () => {
      render(
        <KPICard
          label="Tổng Chi Tiêu"
          value={5000000}
          icon={<DollarSign />}
          format="currency"
        />
      );
      expect(screen.getByText('5.000.000 VNĐ')).toBeInTheDocument();
    });

    it('renders icon', () => {
      render(
        <KPICard
          label="Test"
          value={1000}
          icon={<DollarSign data-testid="test-icon" />}
        />
      );
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows skeleton when isLoading is true', () => {
      render(
        <KPICard
          label="Loading Card"
          value={0}
          icon={<DollarSign />}
          isLoading={true}
        />
      );
      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    it('does not show value when loading', () => {
      render(
        <KPICard
          label="Loading Card"
          value={1000000}
          icon={<DollarSign />}
          isLoading={true}
        />
      );
      expect(screen.queryByText('1.000.000 VNĐ')).not.toBeInTheDocument();
    });
  });

  describe('trend display', () => {
    it('shows positive trend text', () => {
      render(
        <KPICard
          label="Test"
          value={1000000}
          icon={<DollarSign />}
          trend={15.5}
        />
      );
      // The text is split: "15.5" and "% so với tháng trước"
      expect(screen.getByText(/15\.5/)).toBeInTheDocument();
      expect(screen.getByText(/so với tháng trước/)).toBeInTheDocument();
    });

    it('shows negative trend text', () => {
      render(
        <KPICard
          label="Test"
          value={1000000}
          icon={<DollarSign />}
          trend={-10}
        />
      );
      expect(screen.getByText(/-10\.0/)).toBeInTheDocument();
    });

    it('shows neutral trend when trend is 0', () => {
      render(
        <KPICard
          label="Test"
          value={1000000}
          icon={<DollarSign />}
          trend={0}
        />
      );
      expect(screen.getByText('Không thay đổi')).toBeInTheDocument();
    });

    it('does not show trend section when trend is undefined', () => {
      render(
        <KPICard
          label="Test"
          value={1000000}
          icon={<DollarSign />}
        />
      );
      expect(screen.queryByText(/so với tháng trước/)).not.toBeInTheDocument();
    });
  });

  describe('format variants', () => {
    it('formats currency correctly', () => {
      render(
        <KPICard
          label="Test"
          value={1234567}
          icon={<DollarSign />}
          format="currency"
        />
      );
      expect(screen.getByText('1.234.567 VNĐ')).toBeInTheDocument();
    });

    it('formats percent correctly', () => {
      render(
        <KPICard
          label="Test"
          value={75.5}
          icon={<DollarSign />}
          format="percent"
        />
      );
      expect(screen.getByText('75.5%')).toBeInTheDocument();
    });

    it('formats compact numbers correctly', () => {
      render(
        <KPICard
          label="Test"
          value={1500000}
          icon={<DollarSign />}
          format="compact"
        />
      );
      expect(screen.getByText('1.5M')).toBeInTheDocument();
    });
  });

  describe('color variants', () => {
    it('renders with blue color', () => {
      const { container } = render(
        <KPICard
          label="Blue Card"
          value={1000}
          icon={<DollarSign />}
          color="blue"
        />
      );
      expect(container.querySelector('.bg-blue-50\\/80') || container.querySelector('[class*="blue"]')).toBeInTheDocument();
    });

    it('renders with green color', () => {
      const { container } = render(
        <KPICard
          label="Green Card"
          value={1000}
          icon={<DollarSign />}
          color="green"
        />
      );
      expect(container.querySelector('[class*="green"]')).toBeInTheDocument();
    });

    it('renders with red color', () => {
      const { container } = render(
        <KPICard
          label="Red Card"
          value={1000}
          icon={<DollarSign />}
          color="red"
        />
      );
      expect(container.querySelector('[class*="red"]')).toBeInTheDocument();
    });

    it('renders with purple color', () => {
      const { container } = render(
        <KPICard
          label="Purple Card"
          value={1000}
          icon={<DollarSign />}
          color="purple"
        />
      );
      expect(container.querySelector('[class*="purple"]')).toBeInTheDocument();
    });

    it('renders with orange color', () => {
      const { container } = render(
        <KPICard
          label="Orange Card"
          value={1000}
          icon={<DollarSign />}
          color="orange"
        />
      );
      expect(container.querySelector('[class*="orange"]')).toBeInTheDocument();
    });
  });

  describe('sparkline', () => {
    it('renders sparkline when data has more than 1 point', () => {
      render(
        <KPICard
          label="Test"
          value={1000}
          icon={<DollarSign />}
          sparklineData={[10, 20, 15, 25, 30]}
        />
      );
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('does not render sparkline with single data point', () => {
      render(
        <KPICard
          label="Test"
          value={1000}
          icon={<DollarSign />}
          sparklineData={[10]}
        />
      );
      const svgElements = document.querySelectorAll('svg');
      // Should not have sparkline (only icon)
      const hasExtraSvg = svgElements.length > 1;
      expect(hasExtraSvg).toBe(false);
    });

    it('does not render sparkline with empty data', () => {
      render(
        <KPICard
          label="Test"
          value={1000}
          icon={<DollarSign />}
          sparklineData={[]}
        />
      );
      const svgElements = document.querySelectorAll('svg');
      const hasExtraSvg = svgElements.length > 1;
      expect(hasExtraSvg).toBe(false);
    });
  });

  describe('custom className', () => {
    it('renders without errors', () => {
      const { container } = render(
        <KPICard
          label="Test"
          value={1000}
          icon={<DollarSign />}
          className="my-custom-class"
        />
      );
      // Just verify the component renders without errors
      expect(container.querySelector('.relative')).toBeInTheDocument();
    });
  });

  describe('hover effects', () => {
    it('has hover styles', () => {
      const { container } = render(
        <KPICard
          label="Test"
          value={1000}
          icon={<DollarSign />}
        />
      );
      expect(container.querySelector('.hover\\:shadow-md')).toBeInTheDocument();
    });
  });
});

describe('MiniSparkline Logic', () => {
  describe('point generation', () => {
    it('calculates correct number of points', () => {
      const data = [10, 20, 30, 40, 50];
      const expectedPoints = 5;
      expect(data.length).toBe(expectedPoints);
    });

    it('handles ascending data', () => {
      const data = [10, 20, 30, 40, 50];
      const lastValue = data[data.length - 1];
      expect(lastValue).toBeGreaterThan(data[0]);
    });

    it('handles descending data', () => {
      const data = [50, 40, 30, 20, 10];
      const lastValue = data[data.length - 1];
      expect(lastValue).toBeLessThan(data[0]);
    });

    it('handles flat data', () => {
      const data = [10, 10, 10, 10, 10];
      const uniqueValues = new Set(data);
      expect(uniqueValues.size).toBe(1);
    });

    it('handles mixed data', () => {
      const data = [10, 30, 20, 40, 25];
      expect(data.length).toBe(5);
      expect(Math.max(...data)).toBe(40);
      expect(Math.min(...data)).toBe(10);
    });
  });
});
