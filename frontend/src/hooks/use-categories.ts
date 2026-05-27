"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query";
import { apiClient } from "@/lib/api-client";

import type { CategoryOption } from "@/types/category";
export type { CategoryOption };

export interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense" | "both";
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const CATEGORIES_ENDPOINT = "/categories";

const fetchCategories = (type?: string) => {
  const query = type ? `?type=${type}` : "";
  return apiClient.get<Category[]>(`${CATEGORIES_ENDPOINT}${query}`);
};

const postCategory = (input: Omit<Category, "_id">) =>
  apiClient.post<Category>(CATEGORIES_ENDPOINT, input);

const putCategory = (categoryId: string, input: Partial<Category>) =>
  apiClient.put<Category>(`${CATEGORIES_ENDPOINT}/${categoryId}`, input);

const deleteCategoryApi = (categoryId: string) =>
  apiClient.delete<void>(`${CATEGORIES_ENDPOINT}/${categoryId}`);

export function useCategories(type?: "income" | "expense" | "both") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.categories.list(type),
    queryFn: () => fetchCategories(type),
    staleTime: 10 * 60 * 1000,
  });

  const invalidateCategories = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: postCategory,
    onSuccess: invalidateCategories,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: Partial<Category>;
    }) => putCategory(categoryId, data),
    onSuccess: invalidateCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: invalidateCategories,
  });

  const createCategory = useCallback(
    async (data: Omit<Category, "_id">) => {
      try {
        const category = await createMutation.mutateAsync(data);
        return { success: true, category };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [createMutation]
  );

  const updateCategory = useCallback(
    async (categoryId: string, data: Partial<Category>) => {
      try {
        const category = await updateMutation.mutateAsync({ categoryId, data });
        return { success: true, category };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [updateMutation]
  );

  const deleteCategory = useCallback(
    async (categoryId: string) => {
      try {
        await deleteMutation.mutateAsync(categoryId);
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [deleteMutation]
  );

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    fetchCategories: query.refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
