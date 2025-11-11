import { z } from 'zod';
import { addressLine1, addressLine2, city, country, currentCompany, currentDesignation, currentJobType, currentSalary, district, email, expectedSalary, experience, fullName, genderSchema, immediateJoiner, industry, landmark, linkedInUsername, nationality, noticePeriod, phone, phoneTwo, portfolioUrl, postalCode, preferredJobTypes, preferredWorkModes, primary, professionalStatus, state, status } from './common.zod';

// user update Profile details zod schema
export const updateUserInfoSchema = z.object({
  fullName,
  email,
  phone,
  phoneTwo,
  genderSchema,
  nationality,
  linkedInUsername,
  portfolioUrl,
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

// User create Address zod schema
export const updateAddressZodSchema = z.object({
  addressLine1: addressLine1.optional(),
  addressLine2: addressLine2.optional(),
  city: city.optional(),
  state: state.optional(),
  district: district.optional(),
  country: country.optional(),
  postalCode: postalCode.optional(),
  landmark: landmark.optional(),
  primary: primary.optional(),
});


// User create Career Data zod schema
export const createCareerDataSchema = z
  .object({
    currentSalary,
    expectedSalary,
    immediateJoiner,
    noticePeriod,
    experience,
    currentDesignation,
    currentCompany,
    industry,
    currentJobType,
    preferredJobTypes,
    preferredWorkModes,
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

// User update Career Data zod schema
export const updateCareerDataSchema = z
  .object({
    currentSalary: currentSalary.optional(),
    expectedSalary: expectedSalary.optional(),
    immediateJoiner: immediateJoiner.optional(),
    noticePeriod: noticePeriod.optional(),
    experience: experience.optional(),
    currentDesignation: currentDesignation.optional(),
    currentCompany: currentCompany.optional(),
    industry: industry.optional(),
    currentJobType: currentJobType.optional(),
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
  status
});