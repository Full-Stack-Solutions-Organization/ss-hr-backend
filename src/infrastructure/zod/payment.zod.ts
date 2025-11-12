import { z } from "zod";
import { objectIdField } from "./zodUtilities";
import { adminNotes, customerSerialNumber, paidAmount, paymentDate, s3FileKey, totalAmount, balanceAmount, paymentMethodSchema, paymentStatusSchema } from "./common.zod";

// admin create payment zod schema
export const createPaymentSchema = z.object({
  customerSerialNumber,
  packageId: objectIdField("package Id"),
  totalAmount,
  paidAmount,
  balanceAmount,
  paymentMethod: paymentMethodSchema,
  paymentDate,
  paymentProof: s3FileKey,
  adminNotes,
  paymentStatus: paymentStatusSchema
}).refine((data) => data.paidAmount <= data.totalAmount, {
  message: "Paid amount cannot exceed total amount",
  path: ["paidAmount"],
});


