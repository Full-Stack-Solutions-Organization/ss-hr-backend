import { Schema, model } from "mongoose";

export interface ICompany {
  _id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const CompanyModel = model<ICompany>("Company", companySchema);
