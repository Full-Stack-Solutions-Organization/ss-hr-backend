import { z } from "zod";
import { objectIdField } from "./zodUtilities";
import { adminNotes, customerSerialNumber, paidAmount, paymentDate, paymentMethod, s3FileKey, totalAmount, balanceAmount, paymentStatus } from "./common.zod";

// admin create payment zod schema
export const createPaymentSchema = z.object({
  customerSerialNumber,
  packageId: objectIdField("package Id"),
  totalAmount,
  paidAmount,
  balanceAmount,
  paymentMethod,
  paymentDate,
  paymentProof: s3FileKey,
  adminNotes,
  paymentStatus
}).refine((data) => data.paidAmount <= data.totalAmount, {
  message: "Paid amount cannot exceed total amount",
  path: ["paidAmount"],
});

// admin update payment zod schema
export const updatePaymentSchema = z.object({
  customerSerialNumber: customerSerialNumber.optional(),
  packageId: objectIdField("package Id").optional(),
  totalAmount: totalAmount.optional(),
  paidAmount: paidAmount.optional(),
  balanceAmount: balanceAmount.optional(),
  paymentMethod: paymentMethod.optional(),
  paymentDate: paymentDate.optional(),
  paymentProof: s3FileKey,
  adminNotes: adminNotes.optional(),
  paymentStatus: paymentStatus.optional(),
}).refine((data) => {
  if (data.paidAmount !== undefined && data.totalAmount !== undefined) {
    return data.paidAmount <= data.totalAmount;
  }
  return true;
}, {
  message: "Paid amount cannot exceed total amount",
  path: ["paidAmount"],
});

