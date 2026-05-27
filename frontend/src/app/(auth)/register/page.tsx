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
import { registerSchema, type RegisterFormValues } from "@/utils/validation/auth";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
    mode: "onBlur",
  });

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleAgreeTermsChange = useCallback(
    (checked: boolean | "indeterminate") => {
      setValue("agreeTerms", !!checked, { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async (values: RegisterFormValues) => {
      try {
        const result = await registerUser(values.name, values.email, values.password);

        if (result.success) {
          toast.success("Đăng ký thành công!", {
            description: "Chào mừng bạn đến với Expense Manager",
          });
          router.push("/dashboard");
          return;
        }

        toast.error("Đăng ký thất bại", {
          description: result.error || "Vui lòng thử lại",
        });
      } catch {
        toast.error("Đã xảy ra lỗi", {
          description: "Vui lòng thử lại sau ít phút",
        });
      }
    },
    [registerUser, router]
  );

  const agreeTermsValue = watch("agreeTerms");

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Bảo mật tuyệt đối</h3>
                <p className="text-white/70 text-sm">Dữ liệu được mã hóa an toàn</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Miễn phí sử dụng</h3>
                <p className="text-white/70 text-sm">Tất cả tính năng cơ bản</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Nhanh chóng & Dễ dàng</h3>
                <p className="text-white/70 text-sm">Bắt đầu trong vài giây</p>
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
              <h2 className="text-2xl font-bold text-[#1A1D2E] mb-2">Tạo tài khoản mới</h2>
              <p className="text-[#5A607F] text-sm">Bắt đầu quản lý tài chính ngay hôm nay</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-[#1A1D2E]">
                  Họ và tên
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  aria-invalid={!!errors.name}
                  className="h-12 bg-[#FAFBFC] border-[#E0E3EC] focus:border-[#827BF2] focus:ring-[#827BF2]/20 rounded-xl"
                  {...registerField("name")}
                />
                <FormError message={errors.name?.message} />
              </div>

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
                <Label htmlFor="password" className="text-sm font-medium text-[#1A1D2E]">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tối thiểu 8 ký tự"
                    aria-invalid={!!errors.password}
                    className="h-12 bg-[#FAFBFC] border-[#E0E3EC] focus:border-[#827BF2] focus:ring-[#827BF2]/20 rounded-xl pr-12"
                    {...registerField("password")}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA3B8] hover:text-[#5A607F] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <FormError message={errors.password?.message} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#1A1D2E]">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    aria-invalid={!!errors.confirmPassword}
                    className="h-12 bg-[#FAFBFC] border-[#E0E3EC] focus:border-[#827BF2] focus:ring-[#827BF2]/20 rounded-xl pr-12"
                    {...registerField("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA3B8] hover:text-[#5A607F] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <FormError message={errors.confirmPassword?.message} />
              </div>

              {/* Terms */}
              <div className="space-y-2">
                <div className="flex items-start">
                  <Checkbox
                    id="agreeTerms"
                    checked={!!agreeTermsValue}
                    onCheckedChange={handleAgreeTermsChange}
                    className="border-[#E0E3EC] data-[state=checked]:bg-[#827BF2] data-[state=checked]:border-[#827BF2] mt-0.5"
                  />
                  <Label
                    htmlFor="agreeTerms"
                    className="ml-2 text-sm text-[#5A607F] cursor-pointer leading-relaxed"
                  >
                    Tôi đồng ý với{" "}
                    <Link href="/terms" className="text-[#827BF2] hover:text-[#6B5FE2] font-medium">
                      Điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link href="/privacy" className="text-[#827BF2] hover:text-[#6B5FE2] font-medium">
                      Chính sách bảo mật
                    </Link>
                  </Label>
                </div>
                <FormError message={errors.agreeTerms?.message} />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting || !agreeTermsValue}
                className="w-full h-12 bg-gradient-to-r from-[#827BF2] to-[#6B5FE2] hover:from-[#6B5FE2] hover:to-[#5046E4] text-white font-semibold rounded-xl shadow-lg shadow-[#827BF2]/30 transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tạo tài khoản"}
              </Button>
            </form>

            <AuthDivider />
            <SocialButtons />

            <p className="text-center text-sm text-[#5A607F] mt-8">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-[#827BF2] hover:text-[#6B5FE2] font-semibold">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
