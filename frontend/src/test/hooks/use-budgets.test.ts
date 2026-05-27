import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useBudgets, BudgetItem } from '@/hooks/use-budgets';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockBudget: BudgetItem = {
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

const mockBudgets: BudgetItem[] = [
  mockBudget,
  {
    _id: 'budget-2',
    userId: 'user-1',
    categoryId: {
      _id: 'cat-2',
      name: 'Transport',
      icon: 'car',
      color: '#00ff00',
    },
    budgetAmount: 2000000,
    spentAmount: 2500000,
    period: 'month',
    isOverBudget: true,
  },
];

describe('useBudgets hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with loading true and empty budgets', async () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useBudgets());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.budgets).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should default to month period', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ budgets: mockBudgets }),
      });

      renderHook(() => useBudgets());

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('period=month');
    });
  });

  describe('successful data fetching', () => {
    it('should fetch all budgets', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ budgets: mockBudgets }),
      });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.budgets).toHaveLength(2);
      expect(result.current.error).toBeNull();
    });

    it('should use custom period', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ budgets: mockBudgets }),
      });

      renderHook(() => useBudgets('week'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('period=week');
    });

    it('should calculate total budget amount', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ budgets: mockBudgets }),
      });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.totalBudget).toBe(7000000);
    });

    it('should calculate total spent amount', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ budgets: mockBudgets }),
      });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.totalSpent).toBe(5500000);
    });

    it('should count over-budget items', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ budgets: mockBudgets }),
      });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.overBudgetCount).toBe(1);
    });
  });

  describe('createBudget', () => {
    it('should create budget and add to list', async () => {
      const newBudget = {
        categoryId: 'cat-3',
        budgetAmount: 3000000,
        period: 'month' as const,
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ budgets: mockBudgets }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            budget: { ...newBudget, _id: 'budget-3', spentAmount: 0, isOverBudget: false },
          }),
        });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const createResult = await act(async () => {
        return result.current.createBudget('cat-3', 3000000);
      });

      expect(createResult.success).toBe(true);
      expect(result.current.budgets.length).toBe(3);
    });

    it('should return error on create failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ budgets: mockBudgets }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to create' }),
        });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const createResult = await act(async () => {
        return result.current.createBudget('cat-3', 3000000);
      });

      expect(createResult.success).toBe(false);
      expect(createResult.error).toBe('Failed to create');
    });
  });

  describe('deleteBudget', () => {
    it('should delete budget from list', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ budgets: mockBudgets }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.budgets).toHaveLength(2);

      const deleteResult = await act(async () => {
        return result.current.deleteBudget('budget-1');
      });

      expect(deleteResult.success).toBe(true);
      expect(result.current.budgets).toHaveLength(1);
      expect(result.current.budgets.find(b => b._id === 'budget-1')).toBeUndefined();
    });

    it('should return error on delete failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ budgets: mockBudgets }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to delete' }),
        });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const deleteResult = await act(async () => {
        return result.current.deleteBudget('budget-1');
      });

      expect(deleteResult.success).toBe(false);
      expect(deleteResult.error).toBe('Failed to delete');
    });
  });

  describe('error handling', () => {
    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.budgets).toEqual([]);
    });

    it('should handle non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Unauthorized');
    });
  });

  describe('fetchBudgets function', () => {
    it('should have fetchBudgets function available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ budgets: mockBudgets }),
      });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.fetchBudgets).toBe('function');
    });
  });

  describe('computed values', () => {
    it('should return 0 for totals when no budgets', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ budgets: [] }),
      });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.totalBudget).toBe(0);
      expect(result.current.totalSpent).toBe(0);
      expect(result.current.overBudgetCount).toBe(0);
    });

    it('should calculate remaining budget correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ budgets: [mockBudget] }),
      });

      const { result } = renderHook(() => useBudgets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const remaining = result.current.totalBudget - result.current.totalSpent;
      expect(remaining).toBe(2000000);
    });
  });
});
