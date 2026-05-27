import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MetricCardsGrid } from '@/components/dashboard/metric-cards-grid';
import { TrendingUp, DollarSign } from 'lucide-react';

describe('MetricCardsGrid', () => {
  const mockItems = [
    { label: 'Tổng thu nhập', value: '10.000.000 VNĐ', icon: TrendingUp, color: 'green' as const },
    { label: 'Tổng chi tiêu', value: '5.000.000 VNĐ', icon: DollarSign, color: 'red' as const },
    { label: 'Số dư', value: '5.000.000 VNĐ', color: 'blue' as const },
  ];

  describe('rendering', () => {
    it('renders all metric cards', () => {
      render(<MetricCardsGrid metricCardsItems={mockItems} />);

      expect(screen.getByText('Tổng thu nhập')).toBeInTheDocument();
      expect(screen.getByText('Tổng chi tiêu')).toBeInTheDocument();
      expect(screen.getByText('Số dư')).toBeInTheDocument();
    });

    it('renders card values', () => {
      render(<MetricCardsGrid metricCardsItems={mockItems} />);

      // All values contain the formatted numbers
      const allValues = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('VNĐ') ?? false;
      });
      expect(allValues.length).toBeGreaterThanOrEqual(2);
    });

    it('renders icons when provided', () => {
      render(<MetricCardsGrid metricCardsItems={mockItems} />);

      // Icons are rendered via Lucide icons which create SVG elements
      const svgElements = document.querySelectorAll('svg');
      expect(svgElements.length).toBeGreaterThan(0);
    });

    it('applies correct color gradients', () => {
      const { container } = render(<MetricCardsGrid metricCardsItems={mockItems} />);

      const cards = container.querySelectorAll('[class*="from-"]');
      expect(cards.length).toBe(mockItems.length);
    });
  });

  describe('loading state', () => {
    it('shows skeleton loaders when loading is true', () => {
      render(<MetricCardsGrid metricCardsItems={mockItems} loading />);

      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('hides actual content when loading', () => {
      render(<MetricCardsGrid metricCardsItems={mockItems} loading />);

      expect(screen.queryByText('Tổng thu nhập')).not.toBeInTheDocument();
    });
  });

  describe('grid columns', () => {
    it('renders with default 4 columns', () => {
      const { container } = render(<MetricCardsGrid metricCardsItems={mockItems} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });

    it('respects columns prop', () => {
      const { container } = render(<MetricCardsGrid metricCardsItems={mockItems} columns={2} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('sm:grid-cols-2');
    });

    it('supports 3 columns layout', () => {
      const { container } = render(<MetricCardsGrid metricCardsItems={mockItems} columns={3} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('lg:grid-cols-3');
    });
  });

  describe('trends', () => {
    it('renders positive trend with green color', () => {
      const itemsWithTrend = [
        { label: 'Test', value: '100', trend: { value: 15.5, label: 'vs last month' } },
      ];

      render(<MetricCardsGrid metricCardsItems={itemsWithTrend} />);

      const trend = screen.getByText((content) => content.includes('15.5'));
      expect(trend).toHaveClass('text-green-200');
    });

    it('renders negative trend with red color', () => {
      const itemsWithTrend = [
        { label: 'Test', value: '100', trend: { value: -10.2, label: 'vs last month' } },
      ];

      render(<MetricCardsGrid metricCardsItems={itemsWithTrend} />);

      const trend = screen.getByText((content) => content.includes('-10.2'));
      expect(trend).toHaveClass('text-red-200');
    });

    it('displays trend label', () => {
      const itemsWithTrend = [
        { label: 'Test', value: '100', trend: { value: 10, label: 'vs last month' } },
      ];

      render(<MetricCardsGrid metricCardsItems={itemsWithTrend} />);

      // The label is displayed after the percentage
      const trendText = screen.getByText((content) => content.includes('vs last month'));
      expect(trendText).toBeInTheDocument();
    });
  });

  describe('iconName prop', () => {
    it('renders icon by name from iconMap', () => {
      const itemsWithIconName = [
        { label: 'Test', value: '100', iconName: 'TrendingUp' },
      ];

      render(<MetricCardsGrid metricCardsItems={itemsWithIconName} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('renders with empty array', () => {
      const { container } = render(<MetricCardsGrid metricCardsItems={[]} />);

      expect(container.querySelector('.grid')).toBeInTheDocument();
    });
  });

  describe('value types', () => {
    it('renders number values', () => {
      const itemsWithNumbers = [
        { label: 'Count', value: 42, color: 'purple' as const },
      ];

      render(<MetricCardsGrid metricCardsItems={itemsWithNumbers} />);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders string values', () => {
      const itemsWithStrings = [
        { label: 'Text', value: 'Custom formatted value', color: 'orange' as const },
      ];

      render(<MetricCardsGrid metricCardsItems={itemsWithStrings} />);

      expect(screen.getByText('Custom formatted value')).toBeInTheDocument();
    });
  });
});
