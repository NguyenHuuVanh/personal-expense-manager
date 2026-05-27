/**
 * Centralized query keys cho toàn app.
 *
 * Tại sao cần factory này:
 * 1. Tránh typo (gõ "snapshot" vs "snapshots" → 2 cache khác nhau, bug khó debug)
 * 2. Hỗ trợ TypeScript autocomplete
 * 3. Dễ invalidate theo hierarchy: invalidate "wallet" → invalidate cả "wallet.list" + "wallet.snapshot"
 * 4. Đặt tất cả keys 1 chỗ → biết app có những query nào
 *
 * Hierarchy convention:
 *   [domain, action, ...params]
 *
 * Ví dụ:
 *   ["wallets"] → root key của wallet domain
 *   ["wallets", "list"] → list ví
 *   ["wallets", "snapshot", "2026-05"] → snapshot tháng 5/2026
 *
 * Khi invalidate ["wallets"] → tất cả query ở dưới đều invalidate.
 */
export const QUERY_KEYS = {
  // Auth domain
  auth: {
    all: ["auth"] as const,
    me: () => [...QUERY_KEYS.auth.all, "me"] as const,
  },

  // Wallets domain
  wallets: {
    all: ["wallets"] as const,
    list: () => [...QUERY_KEYS.wallets.all, "list"] as const,
    detail: (id: string) => [...QUERY_KEYS.wallets.all, "detail", id] as const,
    snapshots: () => [...QUERY_KEYS.wallets.all, "snapshots"] as const,
    snapshot: (monthKey?: string) =>
      [...QUERY_KEYS.wallets.snapshots(), monthKey ?? "current"] as const,
  },

  // Transactions domain
  transactions: {
    all: ["transactions"] as const,
    list: (filter?: Record<string, unknown>) =>
      [...QUERY_KEYS.transactions.all, "list", filter ?? {}] as const,
    infinite: (filter?: Record<string, unknown>) =>
      [...QUERY_KEYS.transactions.all, "infinite", filter ?? {}] as const,
    detail: (id: string) =>
      [...QUERY_KEYS.transactions.all, "detail", id] as const,
  },

  // Categories domain
  categories: {
    all: ["categories"] as const,
    list: (type?: string) =>
      [...QUERY_KEYS.categories.all, "list", type ?? "all"] as const,
  },

  // Budgets domain
  budgets: {
    all: ["budgets"] as const,
    list: () => [...QUERY_KEYS.budgets.all, "list"] as const,
    detail: (id: string) => [...QUERY_KEYS.budgets.all, "detail", id] as const,
  },

  // Goals domain
  goals: {
    all: ["goals"] as const,
    list: () => [...QUERY_KEYS.goals.all, "list"] as const,
    detail: (id: string) => [...QUERY_KEYS.goals.all, "detail", id] as const,
  },

  // Reports domain
  reports: {
    all: ["reports"] as const,
    overview: (params?: Record<string, unknown>) =>
      [...QUERY_KEYS.reports.all, "overview", params ?? {}] as const,
    expense: (params?: Record<string, unknown>) =>
      [...QUERY_KEYS.reports.all, "expense", params ?? {}] as const,
    income: (params?: Record<string, unknown>) =>
      [...QUERY_KEYS.reports.all, "income", params ?? {}] as const,
  },

  // Banks (external — VietQR API)
  banks: {
    all: ["banks"] as const,
    list: () => [...QUERY_KEYS.banks.all, "list"] as const,
  },
} as const;
