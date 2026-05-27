'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn-ui/avatar';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { apiClient, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';

interface UpdateProfileResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  settings?: Record<string, unknown>;
}

export function AccountSettings() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    birthdate: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Tên không được để trống');
      return;
    }

    setIsSaving(true);

    try {
      const data = await apiClient.put<UpdateProfileResponse>('/auth/me', {
        name: formData.name,
      });
      updateUser({ name: data.name });
      toast.success('Cập nhật thông tin thành công');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsSaving(true);

    try {
      await apiClient.put('/auth/me', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Đổi mật khẩu thành công');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.avatar || ''} />
                <AvatarFallback className="bg-[#827BF2] text-white text-2xl">
                  {user?.name ? getInitials(user.name) : 'ND'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  Đổi ảnh
                </Button>
                <p className="text-xs text-[#5A607F] mt-1">JPG, PNG. Tối đa 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9EA3B8]" />
                  <Input
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập họ tên của bạn"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9EA3B8]" />
                  <Input
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Nhập email của bạn"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9EA3B8]" />
                  <Input
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Ngày sinh
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9EA3B8]" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Địa chỉ
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9EA3B8]" />
                  <Input
                    className="pl-10"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Nhập địa chỉ của bạn"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-[#827BF2] hover:bg-[#6B5FD4]" disabled={isSaving}>
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle>Bảo mật</CardTitle>
          <CardDescription>Quản lý mật khẩu và bảo mật tài khoản</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1A1D2E]">Đổi mật khẩu</p>
              <p className="text-sm text-[#5A607F]">Cập nhật mật khẩu để bảo vệ tài khoản</p>
            </div>
            <Button variant="outline" onClick={() => setIsChangingPassword(!isChangingPassword)}>
              {isChangingPassword ? 'Hủy' : 'Đổi mật khẩu'}
            </Button>
          </div>

          {isChangingPassword && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Mật khẩu hiện tại
                </label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Mật khẩu mới
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                  Xác nhận mật khẩu mới
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                className="bg-[#827BF2] hover:bg-[#6B5FD4]"
                disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword}
              >
                {isSaving ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1A1D2E]">Xác thực hai yếu tố</p>
              <p className="text-sm text-[#5A607F]">Bảo vệ tài khoản bằng 2FA</p>
            </div>
            <Button variant="outline">Kích hoạt</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
