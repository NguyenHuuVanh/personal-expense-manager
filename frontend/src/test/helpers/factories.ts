/**
 * Factory tạo mock user cho test.
 * Cho phép override một phần để tạo các kịch bản khác nhau.
 */
export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => {
  return {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    settings: {
      lowBalanceThreshold: 100000,
      currency: 'VND',
      theme: 'light',
    },
    ...overrides,
  };
};

interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  settings: {
    lowBalanceThreshold: number;
    currency: string;
    theme: 'light' | 'dark' | 'system';
  };
}
