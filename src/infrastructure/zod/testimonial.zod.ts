import { z } from "zod";
import { clientName, companyName, designation, isVisible, s3FileKey, testimonial } from "./common.zod";

// admin create testimonial zod schema
export const createTestimonialSchema = z.object({
  clientName,
  designation,
  testimonial,
  isVisible: isVisible.optional(),
  clientPhoto: s3FileKey.optional(),
});

// admin update testimonial zod schema
export const updateTestimonialSchema = z.object({
  isVisible: isVisible.optional(),
  clientName: clientName.optional(),
  clientPhoto: s3FileKey.optional(),
  testimonial: testimonial.optional(),
  designation: designation.optional(),
});

