import mongoose, { Document, Schema, Types } from "mongoose";
import { JobType, WorkMode } from "../../../domain/entities/careerData";

export interface ICareerData extends Document {
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    currentSalary: number,
    expectedSalary: number,
    immediateJoiner: boolean,
    noticePeriod: number,
    experience: string,
    currentDesignation: string,
    currentCompany: string,
    industry: string,
    currentJobType: JobType,
    preferredJobTypes: JobType[],
    preferredWorkModes: WorkMode[],
    resume: string,
    createdAt: Date,
    updatedAt: Date,
}

const CareerDataSchema = new Schema<ICareerData>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        currentSalary: {
            type: Number,
            min: 0,
        },
        expectedSalary: {
            type: Number,
            min: 0,
        },
        immediateJoiner: {
            type: Boolean,
            required: true,
            default: false,
        },
        noticePeriod: {
            type: Number,
            min: 0,
        },
        experience: {
            type: String,
            trim: true,
        },
        currentDesignation: {
            type: String,
            trim: true,
        },
        currentCompany: {
            type: String,
            trim: true,
        },
        industry: {
            type: String,
            trim: true,
        },
        currentJobType: {
            type: String,
            enum: ["full-time", "part-time", "contract", "internship", "freelance"],
        },
        preferredJobTypes: [
            {
                type: String,
                enum: ["full-time", "part-time", "contract", "internship"],
            },
        ],
        preferredWorkModes: [
            {
                type: String,
                enum: ["onsite", "remote", "hybrid"],
            },
        ],
        resume: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const CareerDataModel = mongoose.model<ICareerData>("CareerData", CareerDataSchema);
