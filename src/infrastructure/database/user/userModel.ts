import mongoose, { Document, Schema, Types } from "mongoose";
import { Gender, GenderType, LimitedRole, LimitedRoleType } from "../../zod/common.zod";
import { REGEX_EMAIL, REGEX_FULL_NAME, REGEX_HASHED_PASSWORD, REGEX_NATIONALITY, REGEX_PHONE, REGEX_PROFESSIONAL_STATUS, REGEX_S3_FILEKEY, REGEX_URL, REGEX_USERNAME } from "../../zod/regex";

export interface IUser extends Document {
  _id: Types.ObjectId;
  serialNumber: string;
  fullName: string;
  email: string;
  password: string;
  role: LimitedRoleType;
  phone: string;
  phoneTwo: string;
  profileImage: string;
  isVerified: boolean;
  isBlocked: boolean;
  verificationToken: string;
  googleId: string;
  gender: GenderType,
  dob: Date,
  nationality: string,
  linkedInUsername: string,
  portfolioUrl: string,
  resume: string,
  professionalStatus: string,
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    serialNumber: {
      type: String,
      unique: true,
      required: [true, "Serial number is required"],
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [4, "Full name must be at least 4 characters"],
      maxlength: [30, "Full name must be at most 30 characters"],
      trim: true,
      match: [REGEX_FULL_NAME, "Enter a valid full name"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [REGEX_EMAIL, "Enter a valid email address"],
    },

    password: {
      type: String,
      required: function (this: IUser) {
        return !this.googleId;
      },
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [100, "Password must be at most 100 characters"],
      match: [REGEX_HASHED_PASSWORD, "Invalid password"],
    },

    role: {
      type: String,
      enum: {
        values: Object.values(LimitedRole),
        message: "Gender must be male, female, or other",
      },
      required: [true, "Role is required"],
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      default: null,
      minlength: [7, "Phone number must be at least 7 characters"],
      maxlength: [20, "Phone number must be at most 20 characters"],
      match: [REGEX_PHONE, "Enter a valid phone number"],
    },

    phoneTwo: {
      type: String,
      default: null,
      minlength: [7, "Phone number must be at least 7 characters"],
      maxlength: [20, "Phone number must be at most 20 characters"],
      match: [REGEX_PHONE, "Enter a valid phone number"],
    },

    profileImage: {
      type: String,
      default: null,
      minlength: [1, "s3 key must be at least 1 character"],
      maxlength: [500, "s3 key must be at most 500 characters"],
      match: [REGEX_S3_FILEKEY, "Enter a valid s3 key for profile image"]
    },

    verificationToken: {
      type: String,
      default: null,
      minlength: [1, "verificationToken must be at least 1 character"],
      maxlength: [500, "verificationToken must be at most 500 characters"],
    },

    googleId: {
      type: String,
      default: null,
      sparse: true,
      minlength: [1, "googleId must be at least 1 character"],
      maxlength: [500, "googleId must be at most 500 characters"],
    },

    gender: {
      type: String,
      enum: {
        values: Object.values(Gender),
        message: "Gender must be male, female, or other",
      },
      default: null,
    },

    nationality: {
      type: String,
      minlength: [2, "Nationality must be at least 2 characters"],
      maxlength: [60, "Nationality must be at most 60 characters"],
      match: [REGEX_NATIONALITY, "Enter a valid nationality"],
      default: null,
    },

    linkedInUsername: {
      type: String,
      trim: true,
      minlength: [5, "LinkedIn username must be at least 5 characters"],
      maxlength: [40, "LinkedIn username must be at most 40 characters"],
      match: [REGEX_USERNAME, "Enter a valid LinkedIn username"],
      default: null,
    },

    portfolioUrl: {
      type: String,
      trim: true,
      minlength: [9, "Portfolio URL must be at least 9 characters"],
      maxlength: [250, "Portfolio URL must be at most 250 characters"],
      match: [REGEX_URL, "Enter a valid portfolio URL (must start with http:// or https://)"],
      default: null,
    },

    dob: {
      type: Date,
      default: null,
    },

    resume: {
      type: String,
      trim: true,
      minlength: [1, "Resume URL must be at least 1 characters"],
      maxlength: [500, "Resume URL must be at most 500 characters"],
      match: [REGEX_S3_FILEKEY, "Invalid s3 file key for resume"],
      default: null,
    },

    professionalStatus: {
      type: String,
      trim: true,
      minlength: [4, "Professional status must be at least 4 characters"],
      maxlength: [50, "Professional status must be at most 50 characters"],
      match: [REGEX_PROFESSIONAL_STATUS, "Enter a valid professional status"],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


export const UserModel = mongoose.model<IUser>("User", UserSchema);
