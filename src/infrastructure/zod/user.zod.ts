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


 //* User Address zod schema */
const postalOrPoBoxRegex = /^[0-9]{3,10}$/;
const cityRegex = /^[A-Za-z\s]{2,50}$/;
const countryRegex = /^[A-Za-z\s]{2,60}$/;

export const addressSchema = z
  .object({
    addressLine1: z
      .string()
      .trim()
      .min(3, "Address Line 1 must be at least 3 characters")
      .max(100, "Address Line 1 cannot exceed 100 characters"),

    addressLine2: z
      .string()
      .trim()
      .max(100, "Address Line 2 cannot exceed 100 characters"),

    city: z
      .string()
      .trim()
      .regex(cityRegex, "Enter a valid city name (letters and spaces only)")
      .min(2, "City name must be at least 2 characters")
      .max(50, "City name cannot exceed 50 characters"),

    state: z
      .string()
      .trim()
      .min(2, "State name must be at least 2 characters")
      .max(50, "State name cannot exceed 50 characters"),

    district: z
      .string()
      .trim()
      .min(2, "District name must be at least 2 characters")
      .max(50, "District name cannot exceed 50 characters"),

    country: z
      .string()
      .trim()
      .regex(countryRegex, "Enter a valid country name (letters and spaces only)")
      .min(2, "Country must be at least 2 characters")
      .max(60, "Country cannot exceed 60 characters"),
      
      postalCode: z
      .string()
      .trim()
      .regex(postalOrPoBoxRegex, "Enter a valid postal code (4–10 digits)"),
      
      landmark: z
      .string()
      .trim()
      .min(4, "Landmark must be at least 4 characters")
      .max(100, "Landmark cannot exceed 100 characters"),

    primary: z.boolean(),
  })