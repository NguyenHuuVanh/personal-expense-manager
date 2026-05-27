import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useWallets, Wallet } from '@/hooks/use-wallets';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockWallet: Wallet = {
  _id: 'wallet-1',
  name: 'Main Wallet',
  type: 'cash',
  balance: 5000000,
  currency: 'VND',
  color: '#3b82f6',
  icon: 'wallet',
  isPrimary: true,
  userId: 'user-1',
};

const mockWallets: Wallet[] = [
  mockWallet,
  {
    _id: 'wallet-2',
    name: 'Savings',
    type: 'bank',
    balance: 10000000,
    currency: 'VND',
    color: '#10b981',
    icon: 'landmark',
    isPrimary: false,
    userId: 'user-1',
  },
];

describe('useWallets hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with loading true and empty wallets', async () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useWallets());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.wallets).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('successful data fetching', () => {
    it('should fetch all wallets', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockWallets }),
      });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.wallets).toHaveLength(2);
      expect(result.current.error).toBeNull();
    });

    it('should calculate total balance', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockWallets }),
      });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.totalBalance).toBe(15000000);
    });

    it('should identify primary wallet', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockWallets }),
      });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.primaryWallet?.name).toBe('Main Wallet');
    });

    it('should use first wallet as primary when none marked', async () => {
      const walletsWithoutPrimary = mockWallets.map(w => ({ ...w, isPrimary: false }));
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: walletsWithoutPrimary }),
      });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.primaryWallet?._id).toBe('wallet-1');
    });
  });

  describe('createWallet', () => {
    it('should create wallet and add to list', async () => {
      const newWalletData = {
        name: 'New Wallet',
        type: 'cash',
        balance: 1000000,
        currency: 'VND',
        color: '#ff0000',
        icon: 'wallet',
        isPrimary: false,
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: mockWallets }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: { ...newWalletData, _id: 'wallet-3' } }),
        });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const createResult = await act(async () => {
        return result.current.createWallet(newWalletData);
      });

      expect(createResult.success).toBe(true);
      expect(result.current.wallets.length).toBe(3);
    });

    it('should remove primary from others when new wallet is primary', async () => {
      const newWalletData = {
        name: 'New Primary',
        type: 'cash',
        balance: 1000000,
        currency: 'VND',
        color: '#ff0000',
        icon: 'wallet',
        isPrimary: true,
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: mockWallets }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: { ...newWalletData, _id: 'wallet-3' } }),
        });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.createWallet(newWalletData);
      });

      const newWallet = result.current.wallets.find(w => w._id === 'wallet-3');
      expect(newWallet?.isPrimary).toBe(true);
    });

    it('should return error on create failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: mockWallets }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to create' }),
        });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const createResult = await act(async () => {
        return result.current.createWallet({
          name: 'Test',
          type: 'cash',
          balance: 0,
          currency: 'VND',
          color: '#000',
          icon: 'wallet',
        });
      });

      expect(createResult.success).toBe(false);
      expect(createResult.error).toBe('Failed to create');
    });
  });

  describe('updateWallet', () => {
    it('should update wallet in list', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: mockWallets }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            data: { ...mockWallet, name: 'Updated Wallet' },
          }),
        });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updateResult = await act(async () => {
        return result.current.updateWallet('wallet-1', { name: 'Updated Wallet' });
      });

      expect(updateResult.success).toBe(true);
      const updatedWallet = result.current.wallets.find(w => w._id === 'wallet-1');
      expect(updatedWallet?.name).toBe('Updated Wallet');
    });

    it('should remove primary from others when wallet becomes primary', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: mockWallets }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            data: { ...mockWallets[1], isPrimary: true },
          }),
        });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateWallet('wallet-2', { isPrimary: true });
      });

      const updatedWallet = result.current.wallets.find(w => w._id === 'wallet-2');
      const otherWallet = result.current.wallets.find(w => w._id === 'wallet-1');
      expect(updatedWallet?.isPrimary).toBe(true);
      expect(otherWallet?.isPrimary).toBe(false);
    });

    it('should return error on update failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: mockWallets }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to update' }),
        });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updateResult = await act(async () => {
        return result.current.updateWallet('wallet-1', { name: 'Test' });
      });

      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toBe('Failed to update');
    });
  });

  describe('deleteWallet', () => {
    it('should delete wallet from list', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: mockWallets }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.wallets).toHaveLength(2);

      const deleteResult = await act(async () => {
        return result.current.deleteWallet('wallet-2');
      });

      expect(deleteResult.success).toBe(true);
      expect(result.current.wallets).toHaveLength(1);
    });

    it('should set first remaining wallet as primary when deleting primary', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: mockWallets }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.primaryWallet?._id).toBe('wallet-1');

      await act(async () => {
        await result.current.deleteWallet('wallet-1');
      });

      const remaining = result.current.wallets.find(w => w._id === 'wallet-2');
      expect(remaining?.isPrimary).toBe(true);
    });

    it('should return error on delete failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: mockWallets }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to delete' }),
        });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const deleteResult = await act(async () => {
        return result.current.deleteWallet('wallet-1');
      });

      expect(deleteResult.success).toBe(false);
      expect(deleteResult.error).toBe('Failed to delete');
    });
  });

  describe('error handling', () => {
    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.wallets).toEqual([]);
    });

    it('should handle non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Unauthorized');
    });
  });

  describe('fetchWallets function', () => {
    it('should have fetchWallets function available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockWallets }),
      });

      const { result } = renderHook(() => useWallets());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.fetchWallets).toBe('function');
    });
  });
});
