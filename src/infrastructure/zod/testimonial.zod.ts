import { z } from "zod";
import { clientName, designation, isVisible, s3FileKey, testimonial } from "./common.zod";

// admin create testimonial zod schema
export const createTestimonialSchema = z.object({
  clientName,
  designation,
  testimonial,
  isVisible: isVisible.optional(),
  clientPhoto: s3FileKey.optional(),
});