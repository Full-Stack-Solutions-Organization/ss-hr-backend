import { Types } from "mongoose";
import { Gender, LimitedRole } from "../../infrastructure/zod/common.zod";

export class User {
  constructor(
    public _id: Types.ObjectId,
    public serialNumber: string,
    public fullName: string,
    public email: string,
    public password: string,
    public role: LimitedRole,
    public phone: string,
    public phoneTwo: string,
    public profileImage: string,
    public isBlocked: boolean,
    public isVerified: boolean,
    public verificationToken: string,
    public googleId: string,
    public gender: Gender,
    public nationality: string,
    public dob: Date,
    public linkedInUsername: string,
    public portfolioUrl: string,
    public resume: string,
    public professionalStatus: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {

  }
}




