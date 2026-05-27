import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useCategories, Category } from '@/hooks/use-categories';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockCategory: Category = {
  _id: 'cat-1',
  name: 'Food',
  icon: 'utensils',
  color: '#ff0000',
  type: 'expense',
};

const mockCategories: Category[] = [
  mockCategory,
  { _id: 'cat-2', name: 'Transport', icon: 'car', color: '#00ff00', type: 'expense' },
  { _id: 'cat-3', name: 'Salary', icon: 'wallet', color: '#0000ff', type: 'income' },
];

describe('useCategories hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with loading true and empty categories', async () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useCategories());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.categories).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('successful data fetching', () => {
    it('should fetch all categories', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ categories: mockCategories }),
      });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.categories).toHaveLength(3);
      expect(result.current.error).toBeNull();
    });

    it('should filter by income type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ categories: [mockCategories[2]] }),
      });

      renderHook(() => useCategories('income'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('/api/categories');
      expect(fetchCall).toContain('type=income');
    });

    it('should filter by expense type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ categories: mockCategories.slice(0, 2) }),
      });

      renderHook(() => useCategories('expense'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('type=expense');
    });

    it('should filter by both type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ categories: mockCategories }),
      });

      renderHook(() => useCategories('both'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0][0];
      expect(fetchCall).toContain('type=both');
    });
  });

  describe('createCategory', () => {
    it('should create category and add to list', async () => {
      const newCategory = {
        name: 'Entertainment',
        icon: 'gamepad',
        color: '#ffff00',
        type: 'expense' as const,
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ categories: mockCategories }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ category: { ...newCategory, _id: 'cat-4' } }),
        });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const createResult = await act(async () => {
        return result.current.createCategory(newCategory);
      });

      expect(createResult.success).toBe(true);
      expect(result.current.categories.length).toBe(4);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should return error on create failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ categories: mockCategories }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to create' }),
        });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const createResult = await act(async () => {
        return result.current.createCategory({
          name: 'New',
          icon: 'icon',
          color: '#000',
          type: 'expense',
        });
      });

      expect(createResult.success).toBe(false);
      expect(createResult.error).toBe('Failed to create');
    });
  });

  describe('updateCategory', () => {
    it('should update category in list', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ categories: mockCategories }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            category: { ...mockCategory, name: 'Updated Food' },
          }),
        });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updateResult = await act(async () => {
        return result.current.updateCategory('cat-1', { name: 'Updated Food' });
      });

      expect(updateResult.success).toBe(true);
      const updatedCat = result.current.categories.find(c => c._id === 'cat-1');
      expect(updatedCat?.name).toBe('Updated Food');
    });

    it('should return error on update failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ categories: mockCategories }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to update' }),
        });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updateResult = await act(async () => {
        return result.current.updateCategory('cat-1', { name: 'Test' });
      });

      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toBe('Failed to update');
    });
  });

  describe('deleteCategory', () => {
    it('should delete category from list', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ categories: mockCategories }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.categories).toHaveLength(3);

      const deleteResult = await act(async () => {
        return result.current.deleteCategory('cat-1');
      });

      expect(deleteResult.success).toBe(true);
      expect(result.current.categories).toHaveLength(2);
      expect(result.current.categories.find(c => c._id === 'cat-1')).toBeUndefined();
    });

    it('should return error on delete failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ categories: mockCategories }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to delete' }),
        });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const deleteResult = await act(async () => {
        return result.current.deleteCategory('cat-1');
      });

      expect(deleteResult.success).toBe(false);
      expect(deleteResult.error).toBe('Failed to delete');
    });
  });

  describe('error handling', () => {
    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.categories).toEqual([]);
    });

    it('should handle non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Unauthorized');
    });
  });

  describe('fetchCategories function', () => {
    it('should have fetchCategories function available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ categories: mockCategories }),
      });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.fetchCategories).toBe('function');
    });
  });
});
