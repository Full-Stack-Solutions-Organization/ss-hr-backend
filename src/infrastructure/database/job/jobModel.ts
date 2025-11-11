import mongoose, { Document, Schema, Types } from "mongoose";
import { REGEX_BENEFITS, REGEX_INDUSTRY, REGEX_LONG_TEXT, REGEX_NATIONALITY, REGEX_SKILLS, REGEX_TEXT_DOT_AMP } from "../../zod/regex";

export interface IJob extends Document {
  _id: Types.ObjectId;
  companyName: string;
  industry: string;
  designation: string;
  vacancy: number;
  salary: number;
  benifits: string;
  skills: string;
  jobDescription: string;
  nationality: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      minlength: [2, "Company name must be at least 2 characters"],
      maxlength: [100, "Company name must be at most 100 characters"],
      match: [REGEX_TEXT_DOT_AMP, "Company name contains invalid characters"],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
      minlength: [2, "Industry must be at least 2 characters"],
      maxlength: [100, "Industry must be at most 100 characters"],
      match: [REGEX_INDUSTRY, "Industry contains invalid characters"],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      minlength: [2, "Designation must be at least 2 characters"],
      maxlength: [100, "Designation must be at most 100 characters"],
      match: [REGEX_TEXT_DOT_AMP, "Designation contains invalid characters"],
      trim: true,
    },
    vacancy: {
      type: Number,
      required: [true, "Vacancy count is required"],
      min: [1, "Vacancy must be at least 1"],
      max: [1000, "Vacancy cannot exceed 1000"],
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    benifits: {
      type: String,
      minlength: [1, "Benefits must be at least 1 character"],
      maxlength: [1500, "Benefits must be at most 1500 characters"],
      match: [REGEX_BENEFITS, "Benefits contain invalid characters"],
    },
    skills: {
      type: String,
      minlength: [1, "Skills must be at least 1 character"],
      maxlength: [1000, "Skills must be at most 1000 characters"],
      match: [REGEX_SKILLS, "Skills contain invalid characters"],
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
      minlength: [10, "Job description must be at least 10 characters"],
      maxlength: [5000, "Job description must be at most 5000 characters"],
      match: [REGEX_LONG_TEXT, "Job description contains invalid characters"],
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
      minlength: [2, "Nationality must be at least 2 characters"],
      maxlength: [60, "Nationality must be at most 60 characters"],
      match: [REGEX_NATIONALITY, "Nationality contains invalid characters"],
    },
  },
  {
    timestamps: true,
  }
);

export const JobModel = mongoose.model<IJob>("Job", JobSchema);
