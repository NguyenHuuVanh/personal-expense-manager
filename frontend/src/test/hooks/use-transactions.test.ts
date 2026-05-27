import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTransactions, Transaction, TransactionsResponse } from '@/hooks/use-transactions';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTransaction: Transaction = {
  _id: 'txn-1',
  type: 'expense',
  amount: 500000,
  currency: 'VND',
  description: 'Test transaction',
  date: '2024-03-15T10:00:00Z',
  walletId: 'wallet-1',
  categoryId: { _id: 'cat-1', name: 'Food', icon: 'utensils', color: '#ff0000' },
};

const mockResponse: TransactionsResponse = {
  transactions: [mockTransaction],
  pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
};

describe('useTransactions hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with loading true and empty transactions', async () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useTransactions());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.transactions).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.pagination.total).toBe(0);
    });
  });

  describe('successful data fetching', () => {
    it('should fetch transactions successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.transactions).toHaveLength(1);
      expect(result.current.transactions[0]).toEqual(mockTransaction);
      expect(result.current.error).toBeNull();
      expect(result.current.pagination.total).toBe(1);
    });

    it('should apply wallet filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      renderHook(() => useTransactions({ walletId: 'wallet-1' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('/api/transactions');
      expect(fetchCall).toContain('walletId=wallet-1');
    });

    it('should apply category filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      renderHook(() => useTransactions({ categoryId: 'cat-1' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('categoryId=cat-1');
    });

    it('should apply type filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      renderHook(() => useTransactions({ type: 'expense' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('type=expense');
    });

    it('should apply period filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      renderHook(() => useTransactions({ period: 'month' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('period=month');
    });

    it('should apply date range filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      renderHook(() => useTransactions({
        startDate: '2024-03-01',
        endDate: '2024-03-31',
      }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('startDate=2024-03-01');
      expect(fetchCall).toContain('endDate=2024-03-31');
    });

    it('should not fetch when autoFetch is false', () => {
      renderHook(() => useTransactions({}, false));

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('createTransaction', () => {
    it('should create transaction and add to list', async () => {
      const newTransaction = {
        type: 'income' as const,
        amount: 1000000,
        currency: 'VND',
        description: 'New income',
        date: '2024-03-16T10:00:00Z',
        walletId: 'wallet-1',
        categoryId: 'cat-2',
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ transaction: { ...newTransaction, _id: 'txn-2' } }),
        });

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const createResult = await act(async () => {
        return result.current.createTransaction(newTransaction);
      });

      expect(createResult.success).toBe(true);
      expect(result.current.transactions.length).toBe(2);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should return error on create failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to create' }),
        });

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const createResult = await act(async () => {
        return result.current.createTransaction({
          type: 'expense',
          amount: 100,
          currency: 'VND',
          description: 'Test',
          date: '2024-03-15',
          walletId: 'wallet-1',
          categoryId: 'cat-1',
        });
      });

      expect(createResult.success).toBe(false);
      expect(createResult.error).toBe('Failed to create');
    });
  });

  describe('deleteTransaction', () => {
    it('should delete transaction and remove from list', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.transactions).toHaveLength(1);

      const deleteResult = await act(async () => {
        return result.current.deleteTransaction('txn-1');
      });

      expect(deleteResult.success).toBe(true);
      expect(result.current.transactions).toHaveLength(0);
    });

    it('should return error on delete failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to delete' }),
        });

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const deleteResult = await act(async () => {
        return result.current.deleteTransaction('txn-1');
      });

      expect(deleteResult.success).toBe(false);
      expect(deleteResult.error).toBe('Failed to delete');
    });
  });

  describe('error handling', () => {
    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.transactions).toEqual([]);
    });

    it('should handle non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Unauthorized');
    });
  });

  describe('fetchTransactions function', () => {
    it('should have fetchTransactions function available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.fetchTransactions).toBe('function');
    });
  });
});
