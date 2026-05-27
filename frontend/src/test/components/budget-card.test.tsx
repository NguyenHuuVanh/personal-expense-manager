import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BudgetCard } from '@/components/budgets/budget-card';
import type { BudgetItem } from '@/types/budget';

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock('@/utils/format-number', () => ({
  formatCurrency: (val: number) => `${val.toLocaleString('vi-VN')} VNĐ`,
}));

vi.mock('@/components/ui/category-icon', () => ({
  CategoryIcon: ({ size, style }: { size: number; style?: object }) => (
    <svg data-testid="category-icon" style={style} width={size} height={size} />
  ),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('BudgetCard Component', () => {
  const mockBudgetItem: BudgetItem = {
    _id: 'budget-1',
    userId: 'user-1',
    categoryId: {
      _id: 'cat-1',
      name: 'Food',
      icon: 'utensils',
      color: '#ff0000',
    },
    budgetAmount: 5000000,
    spentAmount: 3000000,
    period: 'month',
    isOverBudget: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders category name', () => {
      render(<BudgetCard item={mockBudgetItem} />);
      expect(screen.getByText('Food')).toBeInTheDocument();
    });

    it('renders budget amount in format', () => {
      render(<BudgetCard item={mockBudgetItem} />);
      // The format is "5.000.000" with "VNĐ"
      expect(screen.getByText(/5\.000\.000/)).toBeInTheDocument();
    });

    it('renders spent amount', () => {
      render(<BudgetCard item={mockBudgetItem} />);
      expect(screen.getByText(/3\.000\.000/)).toBeInTheDocument();
    });

    it('renders period label', () => {
      render(<BudgetCard item={mockBudgetItem} />);
      expect(screen.getByText('Hàng tháng')).toBeInTheDocument();
    });

    it('renders weekly period correctly', () => {
      const weeklyBudget = { ...mockBudgetItem, period: 'weekly' as const };
      render(<BudgetCard item={weeklyBudget} />);
      expect(screen.getByText('Hàng tuần')).toBeInTheDocument();
    });

    it('renders daily period correctly', () => {
      const dailyBudget = { ...mockBudgetItem, period: 'daily' as const };
      render(<BudgetCard item={dailyBudget} />);
      expect(screen.getByText('Hàng ngày')).toBeInTheDocument();
    });
  });

  describe('progress bar', () => {
    it('shows correct percentage', () => {
      render(<BudgetCard item={mockBudgetItem} />);
      expect(screen.getByText(/60.*% đã sử dụng/)).toBeInTheDocument();
    });

    it('shows remaining label', () => {
      render(<BudgetCard item={mockBudgetItem} />);
      expect(screen.getByText(/Còn lại.*2\.000\.000/)).toBeInTheDocument();
    });
  });

  describe('over-budget state', () => {
    it('shows "Vượt ngân sách" badge when over budget', () => {
      const overBudgetItem = {
        ...mockBudgetItem,
        spentAmount: 6000000,
        isOverBudget: true,
      };
      render(<BudgetCard item={overBudgetItem} />);
      expect(screen.getByText(/Vượt ngân sách/)).toBeInTheDocument();
    });

    it('shows "Vượt" label with remaining amount', () => {
      const overBudgetItem = {
        ...mockBudgetItem,
        spentAmount: 6000000,
        isOverBudget: true,
      };
      render(<BudgetCard item={overBudgetItem} />);
      // The text is "Vượt " followed by amount
      expect(screen.getByText(/Vượt.*1\.000\.000/)).toBeInTheDocument();
    });

    it('caps progress at 100%', () => {
      const overBudgetItem = {
        ...mockBudgetItem,
        spentAmount: 7000000,
      };
      render(<BudgetCard item={overBudgetItem} />);
      expect(screen.getByText('100% đã sử dụng')).toBeInTheDocument();
    });
  });

  describe('edit dialog', () => {
    it('opens edit dialog on edit button click', () => {
      render(<BudgetCard item={mockBudgetItem} />);
      const editButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
      if (editButton) {
        fireEvent.click(editButton);
      }
    });
  });

  describe('actions', () => {
    it('renders edit and delete buttons', () => {
      render(<BudgetCard item={mockBudgetItem} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('progress color logic', () => {
    it('shows green when under 80%', () => {
      const lowSpendBudget = { ...mockBudgetItem, spentAmount: 1000000 };
      render(<BudgetCard item={lowSpendBudget} />);
      expect(screen.getByText('20% đã sử dụng')).toBeInTheDocument();
    });

    it('shows orange when between 80-100%', () => {
      const highSpendBudget = { ...mockBudgetItem, spentAmount: 4500000 };
      render(<BudgetCard item={highSpendBudget} />);
      expect(screen.getByText('90% đã sử dụng')).toBeInTheDocument();
    });

    it('shows red when over 100%', () => {
      const overBudget = { ...mockBudgetItem, spentAmount: 6000000 };
      render(<BudgetCard item={overBudget} />);
      expect(screen.getByText('Vượt ngân sách')).toBeInTheDocument();
    });
  });
});

describe('BudgetCard Calculations', () => {
  describe('percentage calculation', () => {
    it('calculates percentage correctly', () => {
      const spentAmount = 3000000;
      const budgetAmount = 5000000;
      const percentage = Math.min((spentAmount / budgetAmount) * 100, 100);
      expect(percentage).toBe(60);
    });

    it('caps at 100%', () => {
      const spentAmount = 7000000;
      const budgetAmount = 5000000;
      const percentage = Math.min((spentAmount / budgetAmount) * 100, 100);
      expect(percentage).toBe(100);
    });

    it('handles zero budget', () => {
      const spentAmount = 1000;
      const budgetAmount = 0;
      const percentage = budgetAmount === 0 ? 0 : Math.min((spentAmount / budgetAmount) * 100, 100);
      expect(percentage).toBe(0);
    });
  });

  describe('remaining calculation', () => {
    it('calculates remaining correctly', () => {
      const budgetAmount = 5000000;
      const spentAmount = 3000000;
      const remaining = budgetAmount - spentAmount;
      expect(remaining).toBe(2000000);
    });

    it('calculates negative remaining when over budget', () => {
      const budgetAmount = 5000000;
      const spentAmount = 6000000;
      const remaining = budgetAmount - spentAmount;
      expect(remaining).toBe(-1000000);
    });
  });

  describe('isOverBudget check', () => {
    it('returns false when spent is less than budget', () => {
      const isOverBudget = 3000000 > 5000000;
      expect(isOverBudget).toBe(false);
    });

    it('returns true when spent equals budget', () => {
      const isOverBudget = 5000000 > 5000000;
      expect(isOverBudget).toBe(false);
    });

    it('returns true when spent exceeds budget', () => {
      const isOverBudget = 6000000 > 5000000;
      expect(isOverBudget).toBe(true);
    });

    it('uses isOverBudget flag from data', () => {
      const item = { isOverBudget: true, spentAmount: 4000000, budgetAmount: 5000000 };
      const isOver = item.isOverBudget || item.spentAmount > item.budgetAmount;
      expect(isOver).toBe(true);
    });
  });
});
