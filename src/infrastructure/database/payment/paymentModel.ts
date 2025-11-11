import mongoose, { Document, Schema, Types } from "mongoose";
import { REGEX_S3_FILEKEY, REGEXT_NOTE_TEXT } from "../../zod/regex";
import { PaymentMethod, PaymentStatus } from "../../../domain/entities/payment";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  packageId: Types.ObjectId;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  paymentProof: string;
  adminNotes: string;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    packageId: {
      type: Schema.Types.ObjectId,
      required: [true, "Package ID is required"],
      ref: "Package",
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
      max: [100000000, "Total amount cannot exceed 100,000,000"],
    },
    paidAmount: {
      type: Number,
      required: [true, "Paid amount is required"],
      min: [0, "Paid amount cannot be negative"],
      max: [100000000, "Paid amount cannot exceed 100,000,000"],
      default: 0,
    },
    balanceAmount: {
      type: Number,
      required: [true, "Balance amount is required"],
      min: [0, "Balance amount cannot be negative"],
      max: [100000000, "Balance amount cannot exceed 100,000,000"],
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: [true, "Payment method is required"],
    },
    paymentDate: {
      type: Date,
      required: [true, "Payment date is required"],
    },
    paymentProof: {
      type: String,
      required: [true, "Payment proof is required"],
      match: [REGEX_S3_FILEKEY, "Enter a valid S3 key for payment proof"],
      trim: true,
    },
    adminNotes: {
      type: String,
      maxlength: [500, "Admin notes must be at most 500 characters"],
      match: [REGEXT_NOTE_TEXT, "Admin notes contain invalid characters"],
      trim: true,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: [true, "Payment status is required"],
      default: PaymentStatus.pending,
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ packageId: 1 });
PaymentSchema.index({ paymentStatus: 1 });
PaymentSchema.index({ paymentDate: -1 });

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
