import mongoose, { Document, Schema, Types } from "mongoose";
import { ApplicationStatus, ApplicationStatusType } from "../../zod/common.zod";
import { CounterModel } from "../counter/counterModel";

export interface IApplication extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    jobId: Types.ObjectId;
    status: ApplicationStatusType;
    applicationUniqueId: string;
    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        jobId: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: [true, "Job ID is required"],
        },
        status: {
            type: String,
            enum: Object.values(ApplicationStatus),
            required: [true, "Status is required"],
            default: ApplicationStatus.applied,
        },
        applicationUniqueId: {
            type: String,
            unique: true,
        }
    },
    {
        timestamps: true,
    }
);

ApplicationSchema.pre<IApplication>("save", async function (next) {
  if (!this.applicationUniqueId) {
    try {
      const counter = await CounterModel.findOneAndUpdate(
        { name: "job" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } 
      );

      const seqNumber = counter.seq.toString().padStart(6, "0");
      this.applicationUniqueId = `SHA-${seqNumber}`;
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

export const ApplicationModel = mongoose.model<IApplication>(
    "Application",
    ApplicationSchema
);
