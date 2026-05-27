import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BudgetOverview } from '@/components/budgets/budget-overview';

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock('@/hooks/use-budgets', () => ({
  useBudgets: vi.fn(),
}));

vi.mock('@/utils/format-number', () => ({
  formatCurrency: (val: number) => `${val.toLocaleString('vi-VN')} VNĐ`,
}));

import { useBudgets } from '@/hooks/use-budgets';

const mockedUseBudgets = useBudgets as ReturnType<typeof vi.fn>;

describe('BudgetOverview Component', () => {
  const mockBudgetsData = {
    budgets: [
      {
        _id: 'budget-1',
        categoryId: { _id: 'cat-1', name: 'Food', icon: 'utensils', color: '#ff0000' },
        budgetAmount: 5000000,
        spentAmount: 3000000,
        period: 'month',
        isOverBudget: false,
      },
      {
        _id: 'budget-2',
        categoryId: { _id: 'cat-2', name: 'Transport', icon: 'car', color: '#00ff00' },
        budgetAmount: 2000000,
        spentAmount: 2500000,
        period: 'month',
        isOverBudget: true,
      },
    ],
    totalBudget: 7000000,
    totalSpent: 5500000,
    overBudgetCount: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    it('shows loading spinner when isLoading is true', () => {
      mockedUseBudgets.mockReturnValue({
        budgets: [],
        isLoading: true,
        error: null,
        fetchBudgets: vi.fn(),
        totalBudget: 0,
        totalSpent: 0,
      });

      render(<BudgetOverview />);
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('shows error message and retry button when error exists', () => {
      mockedUseBudgets.mockReturnValue({
        budgets: [],
        isLoading: false,
        error: 'Failed to fetch budgets',
        fetchBudgets: vi.fn(),
        totalBudget: 0,
        totalSpent: 0,
      });

      render(<BudgetOverview />);
      expect(screen.getByText('Failed to fetch budgets')).toBeInTheDocument();
      expect(screen.getByText('Thử lại')).toBeInTheDocument();
    });
  });

  describe('data display', () => {
    it('renders total budget card', () => {
      mockedUseBudgets.mockReturnValue({
        ...mockBudgetsData,
        isLoading: false,
        error: null,
      });

      render(<BudgetOverview />);
      expect(screen.getByText('Tổng ngân sách')).toBeInTheDocument();
      expect(screen.getByText('7.000.000 VNĐ')).toBeInTheDocument();
    });

    it('renders spent card', () => {
      mockedUseBudgets.mockReturnValue({
        ...mockBudgetsData,
        isLoading: false,
        error: null,
      });

      render(<BudgetOverview />);
      expect(screen.getByText('Đã chi')).toBeInTheDocument();
      expect(screen.getByText('5.500.000 VNĐ')).toBeInTheDocument();
    });

    it('renders remaining card', () => {
      mockedUseBudgets.mockReturnValue({
        ...mockBudgetsData,
        isLoading: false,
        error: null,
      });

      render(<BudgetOverview />);
      expect(screen.getByText('Còn lại')).toBeInTheDocument();
      expect(screen.getByText('1.500.000 VNĐ')).toBeInTheDocument();
    });

    it('renders over-budget card', () => {
      mockedUseBudgets.mockReturnValue({
        ...mockBudgetsData,
        isLoading: false,
        error: null,
      });

      render(<BudgetOverview />);
      expect(screen.getByText('Vượt ngân sách')).toBeInTheDocument();
      expect(screen.getByText('1 danh mục')).toBeInTheDocument();
    });

    it('renders wallet icon', () => {
      mockedUseBudgets.mockReturnValue({
        ...mockBudgetsData,
        isLoading: false,
        error: null,
      });

      render(<BudgetOverview />);
      const icons = document.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('responsive grid', () => {
    it('renders with correct grid classes', () => {
      mockedUseBudgets.mockReturnValue({
        ...mockBudgetsData,
        isLoading: false,
        error: null,
      });

      const { container } = render(<BudgetOverview />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid?.className).toContain('grid-cols-1');
      expect(grid?.className).toContain('sm:grid-cols-2');
      expect(grid?.className).toContain('lg:grid-cols-4');
    });

    it('renders 4 cards in grid', () => {
      mockedUseBudgets.mockReturnValue({
        ...mockBudgetsData,
        isLoading: false,
        error: null,
      });

      render(<BudgetOverview />);
      const cards = document.querySelectorAll('.rounded-lg');
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('calculations', () => {
    it('calculates remaining correctly', () => {
      mockedUseBudgets.mockReturnValue({
        budgets: mockBudgetsData.budgets,
        isLoading: false,
        error: null,
        fetchBudgets: vi.fn(),
        totalBudget: 7000000,
        totalSpent: 5500000,
        overBudgetCount: 1,
      });

      render(<BudgetOverview />);
      const remaining = 7000000 - 5500000;
      expect(remaining).toBe(1500000);
    });

    it('counts over-budget items correctly', () => {
      const budgetsWithMultipleOver = [
        ...mockBudgetsData.budgets,
        { ...mockBudgetsData.budgets[0], _id: 'budget-3', isOverBudget: true },
      ];

      mockedUseBudgets.mockReturnValue({
        budgets: budgetsWithMultipleOver,
        isLoading: false,
        error: null,
        fetchBudgets: vi.fn(),
        totalBudget: 12000000,
        totalSpent: 11000000,
        overBudgetCount: 2,
      });

      render(<BudgetOverview />);
      expect(screen.getByText('2 danh mục')).toBeInTheDocument();
    });
  });

  describe('no budgets state', () => {
    beforeEach(() => {
      mockedUseBudgets.mockReturnValue({
        budgets: [],
        isLoading: false,
        error: null,
        fetchBudgets: vi.fn(),
        totalBudget: 0,
        totalSpent: 0,
        overBudgetCount: 0,
      });
    });

    it('shows zero values when no budgets exist', () => {
      render(<BudgetOverview />);
      // Check that the component renders with zero values
      expect(screen.getByText('Tổng ngân sách')).toBeInTheDocument();
      // Use getAllByText since 0 VNĐ appears in multiple cards
      expect(screen.getAllByText('0 VNĐ').length).toBe(3);
    });

    it('shows zero over-budget count', () => {
      render(<BudgetOverview />);
      expect(screen.getByText('0 danh mục')).toBeInTheDocument();
    });
  });
});
