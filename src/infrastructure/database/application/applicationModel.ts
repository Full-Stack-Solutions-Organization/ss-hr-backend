import mongoose, { Document, Schema, Types } from "mongoose";

export interface IApplication extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    jobId: Types.ObjectId;
    status: boolean;
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
            type: Boolean,
            required: [true, "Status is required"],
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const ApplicationModel = mongoose.model<IApplication>(
    "Application",
    ApplicationSchema
);
