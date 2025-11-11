import { z } from "zod";
import { Gender, Role } from '../../domain/entities/user';
import { PackageType } from "../../domain/entities/package";
import { JobType, WorkMode } from "../../domain/entities/careerData";
import { PaymentMethod, PaymentStatus } from "../../domain/entities/payment";
import { REGEX_PROFESSIONAL_STATUS, REGEX_PLACE, REGEX_COUNTRY, REGEX_FEATURE, REGEX_FULL_NAME, REGEX_LONG_TEXT, REGEX_NATIONALITY, REGEX_PASSWORD, REGEX_PHONE, REGEX_POSTAL, REGEX_PRICE, REGEX_S3_FILEKEY, REGEX_TEXT_DOT_AMP, REGEX_URL, REGEX_USERNAME, REGEX_CLIENT_NAME, REGEX_TESTIMONIAL, REGEX_ENTITY_ID, REGEX_DESCRIPTION, REGEX_INDUSTRY, REGEX_BENEFITS, REGEX_SKILLS, REGEX_EXPERIENCE, REGEX_COMPANY_NAME, REGEX_ADDRESSLINE, REGEX_LANDMARK } from "./regex";
import { booleanField, dateField, enumField, jsonArrayParser, numberField, objectIdField, stringArrayField, stringField } from "./zodUtilities";

//*** Zod Schema Fields & Reusable Validators */
export const fullName = stringField("fullName", 4, 30, REGEX_FULL_NAME);
export const password = stringField("password", 8, 50, REGEX_PASSWORD);
export const email = z.string().email("Invalid email format");
export const phone = stringField("phone", 7, 20, REGEX_PHONE);
export const phoneTwo = stringField("phoneTwo", 7, 20, REGEX_PHONE);
export const gender = z.nativeEnum(Gender);
export const nationality = stringField("nationality", 2, 60, REGEX_NATIONALITY);
export const linkedInUsername = stringField("linkedInUsername", 5, 40, REGEX_USERNAME);
export const portfolioUrl = stringField("portfolioUrl", 9, 200, REGEX_URL);
export const professionalStatus = stringField("professionalStatus",2,100,REGEX_PROFESSIONAL_STATUS,"Professional status can only contain letters, numbers, spaces, dots, hyphens, and ampersands");

export const role = enumField("role", [
  Role.Admin,
  Role.SuperAdmin,
  Role.SystemAdmin,
  Role.User
]);
export const limitedRole = enumField("role", [
  Role.Admin,
  Role.SuperAdmin,
  Role.User
]);
export const otp = z.string().length(6, "OTP must be exactly 6 digits");
export const verificationToken = z.string();

export const addressLine1 = stringField("addressLine1", 3, 100,REGEX_ADDRESSLINE);
export const addressLine2 = stringField("addressLine2", 1, 100,REGEX_ADDRESSLINE);
export const city = stringField("city", 2, 50, REGEX_PLACE);
export const state = stringField("state", 2, 50,REGEX_PLACE);
export const district = stringField("district", 2, 50,REGEX_PLACE);
export const country = stringField("country", 2, 60, REGEX_COUNTRY);
export const postalCode = stringField("postalCode", 3, 10, REGEX_POSTAL);
export const landmark = stringField("landmark", 4, 100,REGEX_LANDMARK);
export const primary = booleanField("primary");

export const jobType = z.nativeEnum(JobType);
export const workMode = z.nativeEnum(WorkMode);
export const currentSalary = numberField("currentSalary", 0, 100000000);
export const expectedSalary = numberField("expectedSalary", 0, 100000000);
export const immediateJoiner = booleanField("immediateJoiner");
export const experience = stringField("experience", 1, 100, REGEX_EXPERIENCE);
export const currentDesignation = stringField("currentDesignation", 2, 100,REGEX_TEXT_DOT_AMP);
export const currentCompany = stringField("currentCompany", 2, 100, REGEX_COMPANY_NAME);
export const currentJobType = jobType;
export const preferredJobTypes = jsonArrayParser(jobType);
export const preferredWorkModes = jsonArrayParser(workMode);
export const noticePeriod = z
  .coerce.number()
  .or(z.nan())
  .refine((val) => val == null || val >= 0, "Notice period must be positive");

export const companyName = stringField("companyName", 2, 100, REGEX_TEXT_DOT_AMP);
export const designation = stringField("designation", 2, 100, REGEX_TEXT_DOT_AMP);
export const industry = stringField("industry", 2, 100, REGEX_INDUSTRY);
export const jobDescription = stringField("jobDescription", 10, 5000, REGEX_LONG_TEXT);
export const benifits = stringField("benefits", 2, 1000, REGEX_BENEFITS);
export const salary = numberField("salary", 1, 1000);
export const skills = stringField("skills", 2, 500, REGEX_SKILLS);
export const vacancy = numberField("vacancy", 1, 1000);

export const packageName = stringField("packageName", 2, 100, REGEX_TEXT_DOT_AMP);
export const description = stringField("description", 10, 1000, REGEX_DESCRIPTION);
export const priceIN = numberField("priceIN", 1, 100000000);
export const priceUAE = numberField("priceUAE", 1, 100000000);
export const packageType = enumField("packageType", [
  PackageType.jobPackage,
  PackageType.tourPackage
]);
export const packageDuration = numberField("packageDuration", 1, 365);
export const features = stringArrayField("features", 1, 10, 1, 200, REGEX_FEATURE);

export const food = booleanField("food");
export const accommodation = booleanField("accommodation");
export const travelCard = booleanField("travelCard");
export const utilityBills = booleanField("utilityBills");
export const airportPickup = booleanField("airportPickup");
export const jobGuidance = booleanField("jobGuidance");

export const customerSerialNumber = stringField("customerId", 1, 100, REGEX_ENTITY_ID);
export const totalAmount = numberField("totalAmount", 0, 100000000);
export const paidAmount = numberField("paidAmount", 0, 100000000);
export const balanceAmount = numberField("balanceAmount", 0, 100000000);
export const paymentMethod = enumField("paymentMethod", [
  PaymentMethod.bankTransfer,
  PaymentMethod.cash,
  PaymentMethod.googlePay
]);
export const paymentStatus = enumField("paymentStatus", [
  PaymentStatus.fullyPaid,
  PaymentStatus.partiallyPaid,
  PaymentStatus.pending
]);
export const paymentDate = stringField("paymentDate", 1, 40, /^.{1,40}$/);
export const adminNotes = stringField("adminNotes", 0, 500, /^.{0,500}$/s);

export const s3FileKey = stringField("s3FileKey", 6, 500, REGEX_S3_FILEKEY);

export const status = booleanField("status");
export const isVisible = booleanField("isVisible");

export const clientName = stringField("clientName",2,100,REGEX_CLIENT_NAME,"Client name must contain only letters and spaces, 2–100 characters");
export const testimonial = stringField("testimonial",20,1000,REGEX_TESTIMONIAL,"Testimonial must be between 20 and 1000 characters");







//*** Reuable full zod schemas */
// Date zod validation alone for the date coming in req.query
export const DateZodSchema = z.object({
    date: dateField,
});

// Stripe Payment Schema
export const SaveStripePaymentZodSchema = z.object({
    sessionId: stringField("Stripe session Id",5,200,/^cs_test_[a-zA-Z0-9]{5,200}$/,"Invalid session ID")
});

// Validating the page and limit in the request query zod schema
export const RequestQueryCommonZodSchema = z.object({
  page: stringField("Request query parameter page")
    .transform(Number)
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Page must be a valid positive number",
    }),
    
  limit: stringField("Request query parameter limit")
    .transform(Number)
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Limit must be a valid positive number",
    }),
});

// ObjectId validation
export const ValidateObjectId = (id: string, name: string) => {
  const schema = z.object({
    id: objectIdField(name),
  });
  return schema.parse({ id });
}

// Pagination req.query validation
export const paginationReqQuery = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
});

