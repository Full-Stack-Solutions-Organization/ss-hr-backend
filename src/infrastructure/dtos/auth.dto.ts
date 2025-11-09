import { Types } from "mongoose";
import { Gender, User } from "../../domain/entities/user";
import { ApiResponse, CommonResponse } from "./common.dts";
import { CommonCareerDataType } from "./user.dto";
import { Address } from "../../domain/entities/address";

// Register usecase
export type RegisterRequest = Pick<User, "fullName" | "email" | "password" | "role">
export interface RegisterResponse extends CommonResponse {
  user: Pick<User, "verificationToken" | "role"> & {
    token: string;
  }
}

// Verify Otp
export interface OTPVerificationRequest {
    otp: string;
    verificationToken: string;
    role: string;
}

// Resend otp
export interface ResendOtpResponse extends ApiResponse {
  user: {
    verificationToken: string, 
    role: string 
  }
}
export interface ResendOtpRequest {
    role: string;
    verificationToken?: string;
    email?: string;
}

// Login
export interface LoginRequest {
    email: string;
    password: string;
    role: string;
}
export interface LoginResponse extends CommonResponse {
    user: { 
        _id?: Types.ObjectId;
        fullName: string, 
        email?: string,
        profileImage: string | null, 
        role: string, 
        phone?: string;
        phoneTwo?: string;
        gender?: Gender;
        nationality?: string;
        dob?: Date;
        linkedInUrl?: string | undefined;
        portfolioUrl?: string | undefined;
      } ,
    token: string;
    address?:  Address | null;
    careerData?: CommonCareerDataType | null;
}


// Check Auth
export interface CheckUserStatusRequest {
    id: Types.ObjectId;
    role: string;
}
export interface CheckUserStatusResponse extends CommonResponse {
    status: number;
}



