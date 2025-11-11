import mongoose, { Document, Schema, Types } from "mongoose";
import { JobType, WorkMode } from "../../../domain/entities/careerData";
import { REGEX_COMPANY_NAME, REGEX_EXPERIENCE, REGEX_INDUSTRY, REGEX_TEXT_DOT_AMP } from "../../zod/regex";

export interface ICareerData extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  currentSalary: number;
  expectedSalary: number;
  immediateJoiner: boolean;
  noticePeriod: number;
  experience: string;
  currentDesignation: string;
  currentCompany: string;
  industry: string;
  currentJobType: JobType;
  preferredJobTypes: JobType[];
  preferredWorkModes: WorkMode[];
  createdAt: Date;
  updatedAt: Date;
}

const CareerDataSchema = new Schema<ICareerData>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    currentSalary: {
      type: Number,
      min: [0, "Current salary must be at least 0"],
      max: [100000000, "Current salary cannot exceed 100,000,000"],
    },

    expectedSalary: {
      type: Number,
      min: [0, "Expected salary must be at least 0"],
      max: [100000000, "Expected salary cannot exceed 100,000,000"],
    },

    immediateJoiner: {
      type: Boolean,
      required: [true, "Immediate joiner field is required"],
      default: false,
    },

    noticePeriod: {
      type: Number,
      min: [0, "Notice period must be positive"],
      max: [400, "Notice period cannot exceed 400 days"],
    },

    experience: {
      type: String,
      trim: true,
      minlength: [2, "Experience must be at least 2 characters"],
      maxlength: [500, "Experience cannot exceed 500 characters"],
      match: [REGEX_EXPERIENCE, "Experience contains invalid characters"],
    },

    currentDesignation: {
      type: String,
      trim: true,
      minlength: [2, "Designation must be at least 2 characters"],
      maxlength: [200, "Designation cannot exceed 200 characters"],
      match: [REGEX_TEXT_DOT_AMP, "Designation contains invalid characters"],
    },

    currentCompany: {
      type: String,
      trim: true,
      minlength: [2, "Company name must be at least 2 characters"],
      maxlength: [100, "Company name cannot exceed 100 characters"],
      match: [REGEX_COMPANY_NAME, "Company name contains invalid characters"],
    },

    industry: {
      type: String,
      trim: true,
      minlength: [2, "Industry must be at least 2 characters"],
      maxlength: [100, "Industry cannot exceed 100 characters"],
      match: [REGEX_INDUSTRY, "Industry contains invalid characters"],
    },

    currentJobType: {
      type: String,
      enum: {
        values: Object.values(JobType),
        message:
          "Invalid job type. Must be one of: full-time, part-time, contract, internship",
      },
    },

    preferredJobTypes: [
      {
        type: String,
        enum: {
          values: Object.values(JobType),
          message:
            "Invalid job type in preferred list. Must be one of: full-time, part-time, contract, internship",
        },
      },
    ],

    preferredWorkModes: [
      {
        type: String,
        enum: {
          values: Object.values(WorkMode),
          message: "Invalid work mode. Must be one of: onsite, remote, hybrid",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

CareerDataSchema.pre("validate", function (next) {
  if (!this.immediateJoiner && (this.noticePeriod === undefined || this.noticePeriod === null)) {
    this.invalidate(
      "noticePeriod",
      "Notice period is required if you are not an immediate joiner"
    );
  }
  next();
});

export const CareerDataModel = mongoose.model<ICareerData>("CareerData", CareerDataSchema);
