"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query";
import { apiClient } from "@/lib/api-client";

import type { SavingGoal } from "@/types/goal";

export type { SavingGoal };

export type GoalFilter = "all" | "active" | "completed";

const GOALS_ENDPOINT = "/goals";

const fetchGoals = (filter: GoalFilter): Promise<SavingGoal[]> => {
  const query = filter !== "all" ? `?filter=${filter}` : "";
  return apiClient.get<SavingGoal[]>(`${GOALS_ENDPOINT}${query}`);
};

const postGoal = (
  input: Omit<
    SavingGoal,
    "_id" | "currentAmount" | "isCompleted" | "createdAt" | "updatedAt"
  >
) => apiClient.post<SavingGoal>(GOALS_ENDPOINT, input);

const putGoal = (goalId: string, input: Partial<SavingGoal>) =>
  apiClient.put<SavingGoal>(`${GOALS_ENDPOINT}/${goalId}`, input);

const deleteGoalApi = (goalId: string) =>
  apiClient.delete<void>(`${GOALS_ENDPOINT}/${goalId}`);

export function useGoals(filter: GoalFilter = "all") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...QUERY_KEYS.goals.list(), filter],
    queryFn: () => fetchGoals(filter),
    staleTime: 2 * 60 * 1000,
  });

  const invalidateGoals = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals.all });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: postGoal,
    onSuccess: invalidateGoals,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      goalId,
      data,
    }: {
      goalId: string;
      data: Partial<SavingGoal>;
    }) => putGoal(goalId, data),
    onSuccess: invalidateGoals,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGoalApi,
    onSuccess: invalidateGoals,
  });

  const createGoal = useCallback(
    async (
      data: Omit<
        SavingGoal,
        "_id" | "currentAmount" | "isCompleted" | "createdAt" | "updatedAt"
      >
    ) => {
      try {
        const goal = await createMutation.mutateAsync(data);
        return { success: true, goal };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [createMutation]
  );

  const updateGoal = useCallback(
    async (goalId: string, data: Partial<SavingGoal>) => {
      try {
        const goal = await updateMutation.mutateAsync({ goalId, data });
        return { success: true, goal };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [updateMutation]
  );

  const deleteGoal = useCallback(
    async (goalId: string) => {
      try {
        await deleteMutation.mutateAsync(goalId);
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
        return { success: false, error: message };
      }
    },
    [deleteMutation]
  );

  const goals = query.data ?? [];
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const completedCount = goals.filter((g) => g.isCompleted).length;

  return {
    goals,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    fetchGoals: query.refetch,
    createGoal,
    updateGoal,
    deleteGoal,
    totalTarget,
    totalCurrent,
    completedCount,
  };
}
