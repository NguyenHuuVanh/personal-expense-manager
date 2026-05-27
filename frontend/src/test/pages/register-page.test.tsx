import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import RegisterPage from '@/app/(auth)/register/page';
import { AuthProvider } from '@/contexts/auth-context';
import { mockFetchOnce, resetFetchMock } from '../helpers/mockFetch';
import { createMockUser } from '../helpers/factories';
import { renderWithQueryClient } from '../helpers/renderWithProviders';

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
  usePathname: () => '/register',
  useSearchParams: () => new URLSearchParams(),
}));

const renderRegisterPage = () => {
  return renderWithQueryClient(
    <AuthProvider>
      <RegisterPage />
    </AuthProvider>
  );
};

const fillValidForm = async (
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }> = {}
) => {
  const data = {
    name: 'Nguyễn Văn A',
    email: 'newuser@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    ...overrides,
  };

  await user.type(screen.getByLabelText('Họ và tên'), data.name);
  await user.type(screen.getByLabelText('Email'), data.email);
  await user.type(screen.getByLabelText('Mật khẩu'), data.password);
  await user.type(screen.getByLabelText('Xác nhận mật khẩu'), data.confirmPassword);
};

const checkAgreeTerms = async (user: ReturnType<typeof userEvent.setup>) => {
  const checkbox = screen.getByLabelText(/tôi đồng ý với/i);
  await user.click(checkbox);
};

describe('RegisterPage', () => {
  beforeEach(() => {
    resetFetchMock();
    vi.clearAllMocks();
    mockPush.mockClear();
  });

  describe('Rendering', () => {
    it('phải hiển thị form đăng ký với đầy đủ các field', async () => {
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderRegisterPage();

      expect(screen.getByLabelText('Họ và tên')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument();
      expect(screen.getByLabelText('Xác nhận mật khẩu')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /tạo tài khoản/i })).toBeInTheDocument();
    });

    it('phải có link "Đăng nhập ngay"', async () => {
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderRegisterPage();

      expect(screen.getByText('Đăng nhập ngay')).toBeInTheDocument();
    });

    it('phải có link "Điều khoản sử dụng" và "Chính sách bảo mật"', async () => {
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderRegisterPage();

      expect(screen.getByText('Điều khoản sử dụng')).toBeInTheDocument();
      expect(screen.getByText('Chính sách bảo mật')).toBeInTheDocument();
    });
  });

  describe('Toggle hiển thị mật khẩu', () => {
    it('phải mặc định ẩn cả 2 password (type=password)', async () => {
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderRegisterPage();

      const password = screen.getByLabelText('Mật khẩu') as HTMLInputElement;
      const confirm = screen.getByLabelText('Xác nhận mật khẩu') as HTMLInputElement;

      expect(password.type).toBe('password');
      expect(confirm.type).toBe('password');
    });

    it('phải toggle độc lập giữa password và confirm password', async () => {
      const user = userEvent.setup();
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderRegisterPage();

      const password = screen.getByLabelText('Mật khẩu') as HTMLInputElement;
      const confirm = screen.getByLabelText('Xác nhận mật khẩu') as HTMLInputElement;

      // Click vào toggle button của Password (button đầu tiên có aria-label)
      const toggleButtons = screen.getAllByRole('button', { name: /hiện mật khẩu/i });
      await user.click(toggleButtons[0]);

      // Chỉ password đổi, confirm vẫn ẩn
      expect(password.type).toBe('text');
      expect(confirm.type).toBe('password');
    });
  });

  describe('Trạng thái nút submit', () => {
    it('phải disable nút submit khi chưa tick "Đồng ý điều khoản"', async () => {
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderRegisterPage();

      const submitButton = screen.getByRole('button', { name: /tạo tài khoản/i });
      expect(submitButton).toBeDisabled();
    });

    it('phải enable nút submit sau khi tick agree terms', async () => {
      const user = userEvent.setup();
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderRegisterPage();

      await checkAgreeTerms(user);

      const submitButton = screen.getByRole('button', { name: /tạo tài khoản/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Validation với react-hook-form + zod', () => {
    it('phải hiển thị tất cả lỗi khi submit form rỗng', async () => {
      const user = userEvent.setup();
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderRegisterPage();

      await checkAgreeTerms(user);
      await user.click(screen.getByRole('button', { name: /tạo tài khoản/i }));

      await waitFor(() => {
        expect(screen.getByText(/họ tên phải có ít nhất/i)).toBeInTheDocument();
        expect(screen.getByText('Email là bắt buộc')).toBeInTheDocument();
        expect(screen.getByText(/mật khẩu phải có ít nhất 8 ký tự/i)).toBeInTheDocument();
      });

      const fetchCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const registerCalls = fetchCalls.filter(([url]) => url === '/api/auth/register');
      expect(registerCalls).toHaveLength(0);
    });

    it('phải hiển thị lỗi khi password và confirmPassword không khớp', async () => {
      const user = userEvent.setup();
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderRegisterPage();

      await fillValidForm(user, {
        password: 'password123',
        confirmPassword: 'differentpass',
      });
      await checkAgreeTerms(user);

      await user.click(screen.getByRole('button', { name: /tạo tài khoản/i }));

      await waitFor(() => {
        expect(screen.getByText('Mật khẩu xác nhận không khớp')).toBeInTheDocument();
      });

      const fetchCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const registerCalls = fetchCalls.filter(([url]) => url === '/api/auth/register');
      expect(registerCalls).toHaveLength(0);
    });

    it('phải hiển thị lỗi khi password dưới 8 ký tự', async () => {
      const user = userEvent.setup();
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderRegisterPage();

      await fillValidForm(user, {
        password: 'short',
        confirmPassword: 'short',
      });
      await checkAgreeTerms(user);

      await user.click(screen.getByRole('button', { name: /tạo tài khoản/i }));

      await waitFor(() => {
        expect(screen.getByText(/mật khẩu phải có ít nhất 8 ký tự/i)).toBeInTheDocument();
      });

      const fetchCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const registerCalls = fetchCalls.filter(([url]) => url === '/api/auth/register');
      expect(registerCalls).toHaveLength(0);
    });

    it('phải hiển thị lỗi khi email không đúng định dạng', async () => {
      const user = userEvent.setup();
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderRegisterPage();

      await fillValidForm(user, { email: 'invalid-email' });
      await checkAgreeTerms(user);

      await user.click(screen.getByRole('button', { name: /tạo tài khoản/i }));

      await waitFor(() => {
        expect(screen.getByText('Email không hợp lệ')).toBeInTheDocument();
      });
    });
  });

  describe('Submit form thành công', () => {
    it('phải gọi đúng API /api/auth/register với data từ form', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser({
        name: 'Trần Thị B',
        email: 'tran.b@example.com',
      });

      mockFetchOnce({ ok: false, status: 401, data: {} }); // mount: me 401
      mockFetchOnce({ ok: false, status: 401, data: {} }); // mount: refresh 401
      mockFetchOnce({
        ok: true,
        data: { success: true, data: { user: mockUser } },
      });
      mockFetchOnce({ ok: true, data: { success: true } }); // auto-refresh

      renderRegisterPage();

      await fillValidForm(user, {
        name: 'Trần Thị B',
        email: 'tran.b@example.com',
      });
      await checkAgreeTerms(user);
      await user.click(screen.getByRole('button', { name: /tạo tài khoản/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/register',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              name: 'Trần Thị B',
              email: 'tran.b@example.com',
              password: 'password123',
            }),
          })
        );
      });
    });

    it('phải redirect tới /dashboard và hiển thị toast success khi đăng ký thành công', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({
        ok: true,
        data: { success: true, data: { user: mockUser } },
      });
      mockFetchOnce({ ok: true, data: { success: true } });

      renderRegisterPage();

      await fillValidForm(user);
      await checkAgreeTerms(user);
      await user.click(screen.getByRole('button', { name: /tạo tài khoản/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Đăng ký thành công!',
        expect.objectContaining({
          description: expect.stringContaining('Chào mừng'),
        })
      );
    });
  });

  describe('Submit form thất bại', () => {
    it('phải hiển thị toast error với message từ server', async () => {
      const user = userEvent.setup();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({
        ok: false,
        status: 409,
        data: { error: 'Email đã được sử dụng' },
      });

      renderRegisterPage();

      await fillValidForm(user);
      await checkAgreeTerms(user);
      await user.click(screen.getByRole('button', { name: /tạo tài khoản/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Đăng ký thất bại',
          expect.objectContaining({
            description: 'Email đã được sử dụng',
          })
        );
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('phải hiển thị toast error khi register gặp network error', async () => {
      const user = userEvent.setup();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({ ok: false, status: 401, data: {} });

      const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
      fetchMock.mockRejectedValueOnce(new Error('Network down'));

      renderRegisterPage();

      await fillValidForm(user);
      await checkAgreeTerms(user);
      await user.click(screen.getByRole('button', { name: /tạo tài khoản/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Đăng ký thất bại',
          expect.objectContaining({
            description: 'Network down',
          })
        );
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
