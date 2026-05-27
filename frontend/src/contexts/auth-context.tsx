"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query";
import { apiClient, tokenStorage, ApiError } from "@/lib/api-client";

interface UserSettings {
  lowBalanceThreshold: number;
  currency: string;
  theme: "light" | "dark" | "system";
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  settings: UserSettings;
}

interface AuthResponse {
  user: { id: string; name: string; email: string };
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Fetch current user — KHÔNG retry khi 401 (chưa login).
 * Trả null nếu chưa login, throw error cho các loại lỗi khác.
 */
async function fetchCurrentUser(): Promise<User | null> {
  const token = tokenStorage.get();
  if (!token) return null;

  try {
    return await apiClient.get<User>("/auth/me");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      // Token hết hạn / không hợp lệ → clear và trả null
      tokenStorage.clear();
      return null;
    }
    throw err;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // useQuery cho current user
  const userQuery = useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const data = await apiClient.post<AuthResponse>("/auth/login", input, {
        skipAuth: true,
      });
      tokenStorage.set(data.token);
      return data.user;
    },
    onSuccess: () => {
      // Refetch user info để lấy đầy đủ profile (settings, avatar...)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (input: {
      name: string;
      email: string;
      password: string;
    }) => {
      const data = await apiClient.post<AuthResponse>(
        "/auth/register",
        input,
        { skipAuth: true }
      );
      tokenStorage.set(data.token);
      return data.user;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });

  // Logout — clear token + cache
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post("/auth/logout");
      } catch (error) {
        // Logout API fail không block, vẫn clear local state
        console.error("Logout API error (ignored):", error);
      }
    },
    onSuccess: () => {
      tokenStorage.clear();
      queryClient.setQueryData(QUERY_KEYS.auth.me(), null);
      queryClient.clear();
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await loginMutation.mutateAsync({ email, password });
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi. Vui lòng thử lại.";
        return { success: false, error: message };
      }
    },
    [loginMutation]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        await registerMutation.mutateAsync({ name, email, password });
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi. Vui lòng thử lại.";
        return { success: false, error: message };
      }
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const updateUser = useCallback(
    (data: Partial<User>) => {
      queryClient.setQueryData<User | null>(
        QUERY_KEYS.auth.me(),
        (prev) => (prev ? { ...prev, ...data } : null)
      );
    },
    [queryClient]
  );

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const result = await userQuery.refetch();
    return Boolean(result.data);
  }, [userQuery]);

  const user = userQuery.data ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: userQuery.isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
