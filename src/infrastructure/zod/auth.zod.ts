import { z } from 'zod';
import { email, fullName, limitedRole, otp, password, role, verificationToken } from './common.zod';

// register user zod validation
export const registerZodSchema = z.object({
  fullName,
  email,
  password,
  role
});

// otp verification zod validation
export const otpVerificationZodSchema = z.object({
  otp,
  verificationToken,
  role
});

// resend otp controller zod validation
export const resendOTPZodSchema = z.object({
  role: limitedRole,
  verificationToken: verificationToken.optional(),
  email: email.optional()
});

// login controller zod validation
export const loginZodSchema = z.object({ email, password, role });

// update password zod validation
export const updatePasswordZodSchema = z.object({
  role: limitedRole,
  verificationToken: verificationToken.optional(),
  password
});

