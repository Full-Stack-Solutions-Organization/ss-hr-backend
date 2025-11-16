import mongoose, { Document, Schema, Types } from "mongoose";
import { REGEX_ADDRESSLINE, REGEX_COUNTRY, REGEX_LANDMARK, REGEX_PLACE, REGEX_POSTAL } from "../../zod/regex";

export interface IAddress extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  district: string;
  country: string;
  postalCode: string;
  landmark: string;
  primary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    addressLine1: {
      type: String,
      required: [true, "Address line 1 is required"],
      minlength: [3, "Address line 1 must be at least 3 characters"],
      maxlength: [100, "Address line 1 must be at most 100 characters"],
      match: [REGEX_ADDRESSLINE, "Address line 1 contains invalid characters"],
      trim: true,
    },
    addressLine2: {
      type: String,
      required: [true, "Address line 2 is required"],
      minlength: [3, "Address line 2 must be at least 3 characters"],
      maxlength: [100, "Address line 2 must be at most 100 characters"],
      match: [REGEX_ADDRESSLINE, "Address line 2 contains invalid characters"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      minlength: [2, "City must be at least 2 characters"],
      maxlength: [50, "City must be at most 50 characters"],
      match: [REGEX_PLACE, "City contains invalid characters"],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      minlength: [2, "State must be at least 2 characters"],
      maxlength: [50, "State must be at most 50 characters"],
      match: [REGEX_PLACE, "State contains invalid characters"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      minlength: [2, "District must be at least 2 characters"],
      maxlength: [50, "District must be at most 50 characters"],
      match: [REGEX_PLACE, "District contains invalid characters"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      minlength: [2, "Country must be at least 2 characters"],
      maxlength: [60, "Country must be at most 60 characters"],
      match: [REGEX_COUNTRY, "Country contains invalid characters"],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      minlength: [3, "Postal code must be at least 3 characters"],
      maxlength: [10, "Postal code must be at most 10 characters"],
      match: [REGEX_POSTAL, "Postal code must be 3–10 digits"],
      trim: true,
    },
    landmark: {
      type: String,
      required: [true, "Landmark is required"],
      minlength: [4, "Landmark must be at least 4 characters"],
      maxlength: [100, "Landmark must be at most 100 characters"],
      match: [REGEX_LANDMARK, "Landmark contains invalid characters"],
      trim: true,
    },
    primary: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AddressModel = mongoose.model<IAddress>("Address", AddressSchema);
