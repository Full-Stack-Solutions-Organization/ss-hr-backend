import { z } from 'zod';
import { Gender } from '../../domain/entities/user';

export const createUserByAdminSchema = z.object({
  fullName: z.string()
    .min(4, "Full name must be at least 4 characters")
    .max(30, "Full name must be at most 30 characters")
    .regex(/^[a-zA-Z\s]{4,30}$/, "Invalid full name"),
  email: z.string()
    .email("Invalid email format")
    .toLowerCase(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,100}$/, "Password must contain uppercase, lowercase, number and special character"),
  role: z.enum(['user', 'admin'], "Invalid role"),
  phone: z.string()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number")
    .optional(),
  phoneTwo: z.string()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number")
    .optional()
});

export const updateUserSchema = z.object({
  fullName: z.string()
    .min(4, "Full name must be at least 4 characters")
    .max(30, "Full name must be at most 30 characters")
    .regex(/^[a-zA-Z\s]{4,30}$/, "Invalid full name")
    .optional(),
  email: z.string()
    .email("Invalid email format")
    .toLowerCase()
    .optional(),
  phone: z.string()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number")
    .optional(),
  phoneTwo: z.string()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number")
    .optional(),
  isBlocked: z.boolean().optional(),
  isVerified: z.boolean().optional()
});

export const getUserByIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID")
});


// User Profile details zod schema
const e164Regex = /^\+[1-9]\d{1,14}$/;

export const updateUserInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),

  phone: z.string().regex(e164Regex, "Enter a valid phone number (e.g. +971501234567)"),

  phoneTwo: z.string().regex(e164Regex, "Enter a valid phone number (e.g. +971501234567)"),

  gender: z.custom<Gender>((val) => val === "male" || val === "female" || val === "other", {
    message: "Invalid gender",
  }),

  nationality: z.string().min(2, "Enter a valid nationality").max(60),

  linkedInUrl: z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || /^https?:\/\/.+\..+/.test(val),
    { message: "Enter a valid LinkedIn URL (https://...)" }
  ),

portfolioUrl: z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || /^https?:\/\/.+\..+/.test(val),
    { message: "Enter a valid portfolio URL (https://...)" }
  ),

  dob: z.string(),
});