import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { mockFetchOnce, mockFetchReject, resetFetchMock } from '../helpers/mockFetch';
import { createMockUser } from '../helpers/factories';
import { renderWithQueryClient } from '../helpers/renderWithProviders';

// Component giả lập dùng để truy cập context bên trong test
function TestConsumer() {
  const { user, isAuthenticated, isLoading, login, register, logout, updateUser, refreshSession } = useAuth();

  const handleLogin = () => {
    void login('test@example.com', 'password123');
  };

  const handleRegister = () => {
    void register('Nguyễn Văn A', 'newuser@example.com', 'password123');
  };

  const handleLogout = () => {
    void logout();
  };

  const handleUpdateUser = () => {
    updateUser({ name: 'Updated Name', email: 'updated@example.com' });
  };

  const handleRefreshSession = async () => {
    const result = await refreshSession();
    // Lưu result vào data attribute để test có thể kiểm tra
    document.getElementById('refresh-result')?.setAttribute('data-result', String(result));
  };

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'idle'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</div>
      <div data-testid="user-email">{user?.email ?? 'none'}</div>
      <div data-testid="user-name">{user?.name ?? 'none'}</div>
      <div id="refresh-result" data-testid="refresh-result" data-result=""></div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleUpdateUser}>UpdateUser</button>
      <button onClick={() => void handleRefreshSession()}>RefreshSession</button>
    </div>
  );
}

const renderWithProvider = () => {
  return renderWithQueryClient(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    resetFetchMock();
    vi.clearAllMocks();
  });

  describe('Khởi tạo - checkAuth', () => {
    it('phải set isLoading=true khi mới mount', async () => {
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderWithProvider();

      // Trước khi fetch xong, loading=true
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');

      // Sau khi fetch xong, loading=false
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      });
    });

    it('phải set user khi /api/auth/me trả về user hợp lệ', async () => {
      const mockUser = createMockUser({ email: 'user@gmail.com' });
      mockFetchOnce({
        ok: true,
        data: { success: true, data: mockUser },
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
        expect(screen.getByTestId('user-email')).toHaveTextContent('user@gmail.com');
      });
    });

    it('phải set user=null khi /api/auth/me trả về 401', async () => {
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
        expect(screen.getByTestId('user-email')).toHaveTextContent('none');
      });
    });
  });

  describe('login()', () => {
    it('phải đăng nhập thành công và set user khi API trả về OK', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser({ email: 'test@example.com' });

      // Mock 1: GET /api/auth/me khi mount → chưa có user
      mockFetchOnce({ ok: false, status: 401, data: {} });
      // Mock 2: POST /api/auth/refresh → fail (vẫn chưa login)
      mockFetchOnce({ ok: false, status: 401, data: {} });
      // Mock 3: POST /api/auth/login → success
      mockFetchOnce({
        ok: true,
        data: { success: true, data: { user: mockUser } },
      });
      // Mock 4: POST /api/auth/refresh → triggered bởi auto-refresh effect
      mockFetchOnce({ ok: true, data: { success: true } });

      renderWithProvider();

      // Đợi mount xong
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      });

      // Click login
      await user.click(screen.getByText('Login'));

      // User phải được set sau khi login thành công
      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      });

      // Kiểm tra fetch được gọi đúng endpoint, đúng body
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
    });

    it('phải KHÔNG set user khi API trả về lỗi 401', async () => {
      const user = userEvent.setup();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({
        ok: false,
        status: 401,
        data: { error: 'Email hoặc mật khẩu không đúng' },
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      });

      await user.click(screen.getByText('Login'));

      // Sau khi login thất bại, user vẫn null
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/login',
          expect.objectContaining({ method: 'POST' })
        );
      });

      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      expect(screen.getByTestId('user-email')).toHaveTextContent('none');
    });

    it('phải xử lý được khi network error', async () => {
      const user = userEvent.setup();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchReject(new Error('Network down'));

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      });

      // Không throw exception, không crash UI
      await user.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      });
    });
  });

  describe('logout()', () => {
    it('phải clear user và gọi đúng endpoint', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser();

      // Mount với user đã đăng nhập
      mockFetchOnce({
        ok: true,
        data: { success: true, data: mockUser },
      });
      // Mock POST /api/auth/logout
      mockFetchOnce({ ok: true, data: { success: true } });

      renderWithProvider();

      // Đợi user được load
      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
      });

      // Click logout
      await user.click(screen.getByText('Logout'));

      // User bị clear
      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
        expect(screen.getByTestId('user-email')).toHaveTextContent('none');
      });

      // Kiểm tra endpoint được gọi
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/logout',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      );
    });

    it('phải clear user kể cả khi API logout thất bại', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser();

      mockFetchOnce({
        ok: true,
        data: { success: true, data: mockUser },
      });
      mockFetchReject(new Error('Server error'));

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
      });

      await act(async () => {
        await user.click(screen.getByText('Logout'));
      });

      // Dù API fail, client vẫn clear user (theo logic finally block)
      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      });
    });
  });

  describe('register()', () => {
    it('phải đăng ký thành công và set user khi API trả về OK', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser({
        name: 'Nguyễn Văn A',
        email: 'newuser@example.com',
      });

      // Mount: chưa đăng nhập (me 401 + refresh 401)
      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({ ok: false, status: 401, data: {} });
      // POST /api/auth/register: success
      mockFetchOnce({
        ok: true,
        data: { success: true, data: { user: mockUser } },
      });
      // Auto-refresh triggered after register
      mockFetchOnce({ ok: true, data: { success: true } });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      });

      await user.click(screen.getByText('Register'));

      // User được set sau khi đăng ký
      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
        expect(screen.getByTestId('user-email')).toHaveTextContent('newuser@example.com');
        expect(screen.getByTestId('user-name')).toHaveTextContent('Nguyễn Văn A');
      });

      // Kiểm tra fetch được gọi đúng endpoint, đúng body
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            name: 'Nguyễn Văn A',
            email: 'newuser@example.com',
            password: 'password123',
          }),
        })
      );
    });

    it('phải KHÔNG set user khi API trả về lỗi 409 (email tồn tại)', async () => {
      const user = userEvent.setup();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchOnce({
        ok: false,
        status: 409,
        data: { error: 'Email đã được sử dụng' },
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      });

      await user.click(screen.getByText('Register'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/register',
          expect.objectContaining({ method: 'POST' })
        );
      });

      // User vẫn null khi đăng ký thất bại
      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      expect(screen.getByTestId('user-email')).toHaveTextContent('none');
    });

    it('phải xử lý được khi network error', async () => {
      const user = userEvent.setup();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      mockFetchReject(new Error('Network down'));

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      });

      await user.click(screen.getByText('Register'));

      // Không crash UI, user vẫn null
      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      });
    });
  });

  describe('useAuth hook', () => {
    it('phải throw error khi dùng ngoài AuthProvider', () => {
      // Tắt console.error để không làm rối output test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const renderWithoutProvider = () => render(<TestConsumer />);

      expect(renderWithoutProvider).toThrow(
        'useAuth must be used within an AuthProvider'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('updateUser()', () => {
    it('phải cập nhật user data khi đã đăng nhập', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser({ name: 'Old Name', email: 'old@test.com' });

      mockFetchOnce({
        ok: true,
        data: { success: true, data: mockUser },
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('user-name')).toHaveTextContent('Old Name');
      });

      await user.click(screen.getByText('UpdateUser'));

      // User name và email phải được cập nhật
      expect(screen.getByTestId('user-name')).toHaveTextContent('Updated Name');
      expect(screen.getByTestId('user-email')).toHaveTextContent('updated@example.com');
    });

    it('phải KHÔNG thay đổi gì khi user = null', async () => {
      const user = userEvent.setup();

      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      });

      await user.click(screen.getByText('UpdateUser'));

      // User vẫn là null
      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      expect(screen.getByTestId('user-name')).toHaveTextContent('none');
    });
  });

  describe('refreshSession()', () => {
    it('phải trả về true và cập nhật user khi refresh thành công', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser({ email: 'initial@test.com' });
      const refreshedUser = createMockUser({ email: 'refreshed@test.com', name: 'Refreshed' });

      // Mount → có user
      mockFetchOnce({ ok: true, data: { success: true, data: mockUser } });
      // RefreshSession → gọi fetchUser lại
      mockFetchOnce({ ok: true, data: { success: true, data: refreshedUser } });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('initial@test.com');
      });

      await user.click(screen.getByText('RefreshSession'));

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('refreshed@test.com');
        expect(screen.getByTestId('refresh-result')).toHaveAttribute('data-result', 'true');
      });
    });

    it('phải trả về false khi refresh thất bại (token hết hạn)', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser();

      // Mount → có user
      mockFetchOnce({ ok: true, data: { success: true, data: mockUser } });
      // RefreshSession → fetch thất bại
      mockFetchOnce({ ok: false, status: 401, data: {} });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
      });

      await user.click(screen.getByText('RefreshSession'));

      await waitFor(() => {
        expect(screen.getByTestId('refresh-result')).toHaveAttribute('data-result', 'false');
      });
    });
  });

  describe('fetchUser() — error paths', () => {
    it('phải xử lý khi /api/auth/me throw network error', async () => {
      // Mock fetch throw error (network down)
      mockFetchReject(new Error('Network error'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      renderWithProvider();

      // Sau khi error, user = null, loading = false
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      });

      consoleSpy.mockRestore();
    });

    it('phải trả về null khi response.ok nhưng data.success = false', async () => {
      mockFetchOnce({
        ok: true,
        data: { success: false, data: null },
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      });
    });
  });

  describe('login() — edge cases', () => {
    it('phải trả về fallback error khi response OK nhưng data không có user', async () => {
      const user = userEvent.setup();

      mockFetchOnce({ ok: false, status: 401, data: {} });
      // API trả về 200 nhưng data.success = false hoặc không có user
      mockFetchOnce({
        ok: true,
        data: { success: false },
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      });

      await user.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      });
    });
  });
});
