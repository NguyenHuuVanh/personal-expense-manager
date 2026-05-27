import { z } from 'zod';

// Constants dùng riêng cho auth validation
const PASSWORD_MIN_LENGTH = 8;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;

/**
 * Schema validation cho form đăng nhập.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc'),
  remember: z.boolean().optional(),
});

/**
 * Schema validation cho form đăng ký.
 * Dùng .refine() để check 2 password khớp nhau.
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(NAME_MIN_LENGTH, `Họ tên phải có ít nhất ${NAME_MIN_LENGTH} ký tự`)
      .max(NAME_MAX_LENGTH, `Họ tên không quá ${NAME_MAX_LENGTH} ký tự`)
      .trim(),
    email: z
      .string()
      .min(1, 'Email là bắt buộc')
      .email('Email không hợp lệ'),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Mật khẩu phải có ít nhất ${PASSWORD_MIN_LENGTH} ký tự`),
    confirmPassword: z
      .string()
      .min(1, 'Xác nhận mật khẩu là bắt buộc'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'Bạn phải đồng ý với điều khoản',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

// Inferred types — dùng cho form values
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
