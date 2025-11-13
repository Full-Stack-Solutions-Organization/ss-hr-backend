import mongoose, { Document, Schema, Types } from "mongoose";
import { Package, packageSchema, PackageType } from "../../zod/common.zod";
import { REGEX_DESCRIPTION, REGEX_FEATURE, REGEX_TEXT_DOT_AMP } from "../../zod/regex";

export interface IPackage extends Document {
  _id: Types.ObjectId;
  packageName: string;
  description: string;
  priceIN: string;
  priceUAE: string;
  packageType: PackageType;
  packageDuration: number;
  features: string[];
  food: boolean;
  accommodation: boolean;
  travelCard: boolean;
  utilityBills: boolean;
  airportPickup: boolean;
  jobGuidance: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>({
  packageName: {
    type: String,
    required: [true, "Package name is required"],
    minLength: [2, "Package name must be at least 2 characters"],
    maxlength: [100, "Package name must be at most 100 characters"],
    match: [REGEX_TEXT_DOT_AMP, "Package name can only contain letters, numbers, spaces, dot, & and -"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minLength: [10, "Description must be at least 10 characters"],
    maxlength: [1000, "Description must be at most 1000 characters"],
    match: [REGEX_DESCRIPTION, "Description contains invalid characters"],
    trim: true,
  },
  priceIN: {
    type: String,
    required: [true, "Price in INR is required"],
  },
  priceUAE: {
    type: String,
    required: [true, "Price in AED is required"],
  },
  packageType: {
    type: String,
    enum: Object.values(Package),
    required: [true, "Package type is required"],
  },
  packageDuration: {
    type: Number,
    required: [true, "Package duration is required"],
    min: [1, "Package duration must be at least 1 day"],
    max: [365, "Package duration cannot exceed 365 days"],
  },
  features: [{
    type: String,
    trim: true,
    minLength: [1, "Feature must be at least 1 character"],
    maxLength: [200, "Feature cannot exceed 200 characters"],
    match: [REGEX_FEATURE, "Feature contains invalid characters"],
  }],
  food: {
    type: Boolean,
    default: false,
  },
  accommodation: {
    type: Boolean,
    default: false,
  },
  travelCard: {
    type: Boolean,
    default: false,
  },
  utilityBills: {
    type: Boolean,
    default: false,
  },
  airportPickup: {
    type: Boolean,
    default: false,
  },
  jobGuidance: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

export const PackageModel = mongoose.model<IPackage>("Package", PackageSchema);
