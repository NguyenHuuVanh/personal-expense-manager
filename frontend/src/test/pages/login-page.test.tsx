import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import LoginPage from '@/app/(auth)/login/page';
import { AuthProvider } from '@/contexts/auth-context';
import { mockFetchOnce, resetFetchMock } from '../helpers/mockFetch';
import { createMockUser } from '../helpers/factories';
import { renderWithQueryClient } from '../helpers/renderWithProviders';

// Mock router để bắt được router.push
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/login',
  useSearchParams: () => new URLSearchParams(),
}));

const renderLoginPage = () => {
  return renderWithQueryClient(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    resetFetchMock();
    vi.clearAllMocks();
    mockPush.mockClear();
  });

  describe('Rendering', () => {
    it('phải hiển thị form đăng nhập với các field cần thiết', async () => {
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderLoginPage();

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument();
    });

    it('phải có link "Quên mật khẩu" và "Đăng ký ngay"', async () => {
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderLoginPage();

      expect(screen.getByText('Quên mật khẩu?')).toBeInTheDocument();
      expect(screen.getByText('Đăng ký ngay')).toBeInTheDocument();
    });
  });

  describe('Toggle hiển thị mật khẩu', () => {
    it('phải mặc định ẩn password (type=password)', async () => {
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderLoginPage();

      const passwordInput = screen.getByLabelText('Mật khẩu') as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
    });

    it('phải đổi sang type=text khi click toggle', async () => {
      const user = userEvent.setup();
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderLoginPage();

      const passwordInput = screen.getByLabelText('Mật khẩu') as HTMLInputElement;
      const toggleButton = screen.getByRole('button', { name: /hiện mật khẩu/i });

      await user.click(toggleButton);

      expect(passwordInput.type).toBe('text');
    });
  });

  describe('Validation với react-hook-form + zod', () => {
    it('phải hiển thị lỗi khi email rỗng và submit', async () => {
      const user = userEvent.setup();
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderLoginPage();

      await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

      await waitFor(() => {
        expect(screen.getByText('Email là bắt buộc')).toBeInTheDocument();
      });

      // Không gọi API khi validation fail
      const fetchCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const loginCalls = fetchCalls.filter(([url]) => url === '/api/auth/login');
      expect(loginCalls).toHaveLength(0);
    });

    it('phải hiển thị lỗi khi email không đúng định dạng', async () => {
      const user = userEvent.setup();
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderLoginPage();

      await user.type(screen.getByLabelText('Email'), 'invalid-email');
      await user.type(screen.getByLabelText('Mật khẩu'), 'password123');
      await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

      await waitFor(() => {
        expect(screen.getByText('Email không hợp lệ')).toBeInTheDocument();
      });
    });

    it('phải hiển thị lỗi khi password rỗng', async () => {
      const user = userEvent.setup();
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderLoginPage();

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

      await waitFor(() => {
        expect(screen.getByText('Mật khẩu là bắt buộc')).toBeInTheDocument();
      });
    });

    it('email input phải có aria-invalid khi có lỗi', async () => {
      const user = userEvent.setup();
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderLoginPage();

      await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

      await waitFor(() => {
        const emailInput = screen.getByLabelText('Email');
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('Submit form', () => {
    it('phải gọi API login với đúng email và password', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser({ email: 'demo@test.com' });

      mockFetchOnce({ ok: false, status: 401, data: {} }); // mount: me 401
      mockFetchOnce({ ok: false, status: 401, data: {} }); // mount: refresh 401
      mockFetchOnce({
        ok: true,
        data: { success: true, data: { user: mockUser } },
      });
      mockFetchOnce({ ok: true, data: { success: true } }); // auto-refresh after login

      renderLoginPage();

      await user.type(screen.getByLabelText('Email'), 'demo@test.com');
      await user.type(screen.getByLabelText('Mật khẩu'), 'mypass123');
      await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              email: 'demo@test.com',
              password: 'mypass123',
            }),
          })
        );
      });
    });

    it('phải redirect tới /dashboard khi login thành công', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({
        ok: true,
        data: { success: true, data: { user: mockUser } },
      });
      mockFetchOnce({ ok: true, data: { success: true } });

      renderLoginPage();

      await user.type(screen.getByLabelText('Email'), 'demo@test.com');
      await user.type(screen.getByLabelText('Mật khẩu'), 'mypass123');
      await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Đăng nhập thành công!',
        expect.any(Object)
      );
    });

    it('phải hiển thị toast error khi login thất bại', async () => {
      const user = userEvent.setup();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({
        ok: false,
        status: 401,
        data: { error: 'Email hoặc mật khẩu không đúng' },
      });

      renderLoginPage();

      await user.type(screen.getByLabelText('Email'), 'wrong@test.com');
      await user.type(screen.getByLabelText('Mật khẩu'), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Đăng nhập thất bại',
          expect.objectContaining({
            description: 'Email hoặc mật khẩu không đúng',
          })
        );
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('phải disable nút submit khi đang submitting', async () => {
      const user = userEvent.setup();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({ ok: false, status: 401, data: {} });

      // Tạo promise pending để giữ state submitting
      let resolveLogin: (value: unknown) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
      fetchMock.mockReturnValueOnce(loginPromise);

      renderLoginPage();

      await user.type(screen.getByLabelText('Email'), 'test@test.com');
      await user.type(screen.getByLabelText('Mật khẩu'), 'password');

      const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Cleanup
      resolveLogin!({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Failed' }),
      });
    });
  });

  describe('Network error handling', () => {
    it('phải hiển thị toast error khi login gặp network error', async () => {
      const user = userEvent.setup();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({ ok: false, status: 401, data: {} });

      const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
      fetchMock.mockRejectedValueOnce(new Error('Network down'));

      renderLoginPage();

      await user.type(screen.getByLabelText('Email'), 'test@test.com');
      await user.type(screen.getByLabelText('Mật khẩu'), 'password123');
      await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Đăng nhập thất bại',
          expect.objectContaining({
            description: 'Network down',
          })
        );
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
