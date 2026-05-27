import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardReport } from '@/hooks/use-dashboard-report';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useDashboardReport hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with loading true and no data', async () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useDashboardReport());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('successful data fetching', () => {
    const mockReportData = {
      summary: {
        totalIncome: 10000000,
        totalExpense: 5000000,
        netBalance: 5000000,
        incomeCount: 20,
        expenseCount: 15,
        incomeTrend: 10.5,
        expenseTrend: -5.2,
        balanceTrend: 25.0,
        totalBalance: 50000000,
        monthKey: '2024-03',
      },
      categoryBreakdown: [],
      recentTransactions: [],
      quickStats: {
        transactionCount: 35,
        categoryCount: 10,
        walletCount: 3,
      },
    };

    it('should fetch data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReportData),
      });

      const { result } = renderHook(() => useDashboardReport());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockReportData);
      expect(result.current.error).toBeNull();
    });

    it('should build correct query params with date range', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReportData),
      });

      const filters = {
        dateRange: {
          from: new Date('2024-03-01'),
          to: new Date('2024-03-31'),
        },
        period: 'month' as const,
        type: 'expense' as const,
      };

      renderHook(() => useDashboardReport(filters));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('/api/reports');
      expect(fetchCall).toContain('startDate=2024-03-01');
      expect(fetchCall).toContain('endDate=2024-03-31');
      expect(fetchCall).toContain('type=expense');
    });

    it('should build correct query params with period', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReportData),
      });

      renderHook(() => useDashboardReport({ period: 'week' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('period=week');
    });

    it('should include categoryId when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReportData),
      });

      renderHook(() => useDashboardReport({ categoryId: 'cat-123' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('categoryId=cat-123');
    });
  });

  describe('error handling', () => {
    it('should handle fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useDashboardReport());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.data).toBeNull();
    });

    it('should handle non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      const { result } = renderHook(() => useDashboardReport());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Unauthorized');
    });

    it('should handle non-JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const { result } = renderHook(() => useDashboardReport());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // The hook catches the error and sets a generic message
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('refetch behavior', () => {
    it('should have fetchReport function available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ summary: {} }),
      });

      const { result } = renderHook(() => useDashboardReport());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.fetchReport).toBe('function');
    });
  });
});
