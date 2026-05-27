"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { SocialButtons, AuthDivider, FormError } from "@/components/auth";
import { useAuth } from "@/contexts/auth-context";
import { loginSchema, type LoginFormValues } from "@/utils/validation/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "onBlur",
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleRememberChange = useCallback(
    (checked: boolean | "indeterminate") => {
      setValue("remember", !!checked);
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async (values: LoginFormValues) => {
      try {
        const result = await login(values.email, values.password);

        if (result.success) {
          toast.success("Đăng nhập thành công!", {
            description: "Chào mừng bạn quay trở lại",
          });
          router.push("/dashboard");
          return;
        }

        toast.error("Đăng nhập thất bại", {
          description: result.error || "Vui lòng kiểm tra lại email và mật khẩu",
        });
      } catch {
        toast.error("Đã xảy ra lỗi", {
          description: "Vui lòng thử lại sau ít phút",
        });
      }
    },
    [login, router]
  );

  const rememberValue = watch("remember");

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#F2F4F8] via-white to-[#EAE8FD]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#827BF2] via-[#6B5FE2] to-[#5046E4]">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-40 right-10 w-96 h-96 bg-[#F66PAC]/20 rounded-full blur-3xl animate-float-medium" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#21AE5A]/20 rounded-full blur-3xl animate-float-fast" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="white" strokeWidth="2" fill="white/20" />
                <path d="M16 4V16M16 16L28 10M16 16L4 10M16 16V28" stroke="white" strokeWidth="2" />
                <circle cx="16" cy="16" r="4" fill="white" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Expense Manager</h1>
              <p className="text-white/70 text-sm">Quản lý tài chính thông minh</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Theo dõi chi tiêu</h3>
                <p className="text-white/70 text-sm">Ghi lại mọi giao dịch một cách dễ dàng</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Phân tích thông minh</h3>
                <p className="text-white/70 text-sm">Biểu đồ và báo cáo chi tiết</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ngân sách thông minh</h3>
                <p className="text-white/70 text-sm">Đặt mục tiêu và theo dõi tiến độ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#827BF2] to-[#6B5FE2] rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="white" strokeWidth="2" fill="white/20" />
                <circle cx="16" cy="16" r="4" fill="white" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1A1D2E]">Expense Manager</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-[#827BF2]/10 p-8 lg:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1A1D2E] mb-2">Chào mừng trở lại!</h2>
              <p className="text-[#5A607F] text-sm">Đăng nhập để tiếp tục quản lý tài chính</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#1A1D2E]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  aria-invalid={!!errors.email}
                  className="h-12 bg-[#FAFBFC] border-[#E0E3EC] focus:border-[#827BF2] focus:ring-[#827BF2]/20 rounded-xl"
                  {...registerField("email")}
                />
                <FormError message={errors.email?.message} />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-[#1A1D2E]">
                    Mật khẩu
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-[#827BF2] hover:text-[#6B5FE2] font-medium"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    className="h-12 bg-[#FAFBFC] border-[#E0E3EC] focus:border-[#827BF2] focus:ring-[#827BF2]/20 rounded-xl pr-12"
                    {...registerField("password")}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA3B8] hover:text-[#5A607F] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <FormError message={errors.password?.message} />
              </div>

              {/* Remember */}
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  checked={!!rememberValue}
                  onCheckedChange={handleRememberChange}
                  className="border-[#E0E3EC] data-[state=checked]:bg-[#827BF2] data-[state=checked]:border-[#827BF2]"
                />
                <Label htmlFor="remember" className="ml-2 text-sm text-[#5A607F] cursor-pointer">
                  Ghi nhớ đăng nhập
                </Label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-[#827BF2] to-[#6B5FE2] hover:from-[#6B5FE2] hover:to-[#5046E4] text-white font-semibold rounded-xl shadow-lg shadow-[#827BF2]/30 transition-all duration-300"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đăng nhập"}
              </Button>
            </form>

            <AuthDivider />
            <SocialButtons />

            <p className="text-center text-sm text-[#5A607F] mt-8">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-[#827BF2] hover:text-[#6B5FE2] font-semibold">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
