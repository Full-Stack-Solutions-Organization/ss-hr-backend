import mongoose, { Document, Schema, Types } from "mongoose";

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
      trim: true,
    },
    addressLine2: {
        type: String,
        required: [true, "Address line 2 is required"],
        minlength: [3, "Address line 2 must be at least 3 characters"],
      maxlength: [100, "Address line 2 must be at most 100 characters"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      minlength: [2, "City must be at least 2 characters"],
      maxlength: [50, "City must be at most 50 characters"],
      match: [/^[A-Za-z\s]+$/, "Enter a valid city name (letters and spaces only)"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      minlength: [2, "State must be at least 2 characters"],
      maxlength: [50, "State must be at most 50 characters"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      minlength: [2, "District must be at least 2 characters"],
      maxlength: [50, "District must be at most 50 characters"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      minlength: [2, "Country must be at least 2 characters"],
      maxlength: [60, "Country must be at most 60 characters"],
      match: [/^[A-Za-z\s]+$/, "Enter a valid country name (letters and spaces only)"],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      match: [/^[0-9]{3,10}$/, "Enter a valid postal code (3–10 digits)"],
      trim: true,
    },
    landmark: {
      type: String,
      required: [true, "Landmark is required"],
      maxlength: [100, "Landmark must be at most 100 characters"],
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


