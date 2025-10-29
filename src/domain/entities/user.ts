import { Types } from "mongoose";

export enum Role {
  User = "user",
  Admin = "admin",
  SuperAdmin = "superAdmin",
  SystemAdmin = "systemAdmin",
}

export class User {
  constructor(
    public _id: Types.ObjectId,
    public serialNumber : string,
    public fullName: string,
    public email: string,
    public password: string,
    public role: Role,
    public phone: string,
    public phoneTwo: string,
    public profileImage: string,
    public isBlocked: boolean,
    public isVerified: boolean,
    public verificationToken: string,
    public googleId: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {

  }
}




