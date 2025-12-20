import { z } from 'zod';
import { addressLine1, addressLine2, applicationStatusSchema, city, country, currentCompany, currentDesignation, currentSalary, district, email, expectedSalary, experience, fullName, gender, immediateJoiner, industry, jobtypeSchema, landmark, linkedInUsername, nationality, noticePeriod, password, phone, phoneTwo, portfolioUrl, postalCode, preferredJobTypes, preferredWorkModes, primary, professionalStatus, state, status } from './common.zod';

// user update Profile details zod schema
export const updateUserInfoSchema = z.object({
  fullName,
  email,
  phone,
  gender,
  nationality,
  linkedInUsername: linkedInUsername.optional(),
  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format.",
    })
    .refine((val) => {
      const dob = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const hasNotHadBirthdayThisYear =
        today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

      if (hasNotHadBirthdayThisYear) age--;

      return age >= 18;
    }, {
      message: "You must be at least 18 years old",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "DOB cannot be in the future",
    }),
  professionalStatus,
});

// User create Address zod schema
export const createAddressZodSchema = z.object({
  addressLine1,
  addressLine2,
  city,
  state,
  district,
  country,
  postalCode,
  landmark,
  primary,
});

// User create Career Data zod schema
export const createCareerDataSchema = z
  .object({
    currentSalary,
    expectedSalary,
    immediateJoiner,
    noticePeriod,
    experience,
    currentJobType: jobtypeSchema,
    currentDesignation: currentDesignation.optional(),
    currentCompany: currentCompany.optional(),
    industry: industry.optional(),
    preferredJobTypes: preferredJobTypes.optional(),
    preferredWorkModes: preferredWorkModes.optional(),
  })
  .superRefine((data, ctx) => {
    if (
      !data.immediateJoiner &&
      (data.noticePeriod == null || Number.isNaN(data.noticePeriod))
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["noticePeriod"],
        message: "Notice period is required if you are not an immediate joiner",
      });
    }
  });

// user update application zod schema
export const updateApplicationZodSchmea = z.object({
  status: applicationStatusSchema
});

export const adminCreateUserZodSchema = z.object({
  fullName,
  email,
  password,
  phone,
  phoneTwo
});