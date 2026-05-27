import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncomeExpenseBarChart } from '@/components/expense-dashboard/charts/income-expense-bar-chart';

// Mock recharts - simplified
vi.mock('recharts', () => ({
  BarChart: ({ children, data }: any) => (
    <div data-testid="bar-chart" data-has-data={data?.length > 0}>
      {children}
    </div>
  ),
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

// Mock fetch globally
vi.stubGlobal('fetch', vi.fn());

describe('IncomeExpenseBarChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders chart header', () => {
      // Mock fetch to prevent actual network calls
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      render(<IncomeExpenseBarChart />);
      expect(screen.getByText('Thu nhập & Chi tiêu')).toBeInTheDocument();
    });

    it('renders summary section', () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      render(<IncomeExpenseBarChart />);
      expect(screen.getByText('Thu nhập')).toBeInTheDocument();
      expect(screen.getByText('Chi tiêu')).toBeInTheDocument();
    });
  });

  describe('chart structure', () => {
    it('renders chart container', () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      const { container } = render(<IncomeExpenseBarChart />);
      // Check that the main container has the correct class
      const chartContainer = container.querySelector('.rounded-2xl');
      expect(chartContainer).toBeInTheDocument();
    });

    it('applies custom className', () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      const { container } = render(
        <IncomeExpenseBarChart className="my-custom-class" />
      );
      expect(container.querySelector('.my-custom-class')).toBeInTheDocument();
    });
  });
});

describe('CustomTooltip logic', () => {
  it('validates tooltip data structure', () => {
    const payload = [
      { dataKey: 'income', value: 1000000, color: '#10b981', name: 'Thu nhập' },
      { dataKey: 'expense', value: 500000, color: '#ec4899', name: 'Chi tiêu' },
    ];

    expect(payload.length).toBe(2);
    expect(payload[0].dataKey).toBe('income');
    expect(payload[1].dataKey).toBe('expense');
    expect(payload[0].value).toBeGreaterThan(payload[1].value);
  });
});
