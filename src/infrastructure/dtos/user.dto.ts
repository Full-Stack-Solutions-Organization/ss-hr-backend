import { Types } from "mongoose";
import { User } from "../../domain/entities/user";
import { CareerData } from "../../domain/entities/careerData";

export interface CreateUserByAdminRequest {
  fullName: string;
  email: string;
  password: string;
  role: User["role"];
  phone?: string;
  phoneTwo?: string;
}

export interface CreateUserByAdminResponse {
  success: boolean;
  message: string;
  user: {
    _id: Types.ObjectId;
    serialNumber: string;
    fullName: string;
    email: string;
    role: User["role"];
  };
}

export interface UpdateUserRequest {
  _id: Types.ObjectId;
  fullName?: string;
  email?: string;
  phone?: string;
  phoneTwo?: string;
  isBlocked?: boolean;
  isVerified?: boolean;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  user?: {
    _id: Types.ObjectId;
    serialNumber: string;
    fullName: string;
    email: string;
    role: User["role"];
    isBlocked: boolean;
    isVerified: boolean;
  };
}

export interface DeleteUserRequest {
  userId: Types.ObjectId;
}

export interface GetUserByIdRequest {
  userId: Types.ObjectId;
}

export interface GetUserByIdResponse {
  success: boolean;
  message: string;
  user: {
    _id: Types.ObjectId;
    serialNumber: string;
    fullName: string;
    email: string;
    role: User["role"];
    phone: string;
    phoneTwo: string;
    profileImage: string;
    isBlocked: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}


export type UseUpdateProfileRequest = Pick<User, "_id" | "fullName" | "phone" | "phoneTwo" | "gender" | "nationality" | "dob" | "linkedInUsername" | "portfolioUrl" | "professionalStatus">;
export type UseUpdateProfileResponse = Pick<User, "fullName" | "phone" | "phoneTwo" | "gender" | "nationality" | "dob" | "linkedInUsername" | "portfolioUrl" | "professionalStatus">;


export type CreateCareerDataRequest = Partial<Pick<CareerData, "currentSalary" | "expectedSalary" | "currentCompany" | "currentDesignation" | "currentJobType" | "experience" | "immediateJoiner" | "industry" | "noticePeriod" | "preferredJobTypes" | "preferredWorkModes">> & {
 userId:  User["_id"];
};
export type UpdateCareerDataRequest = Partial<Pick<CareerData, "currentSalary" | "expectedSalary" | "currentCompany" | "currentDesignation" | "currentJobType" | "experience" | "immediateJoiner" | "industry" | "noticePeriod" | "preferredJobTypes" | "preferredWorkModes" >>  & {
 _id: CareerData["_id"];
};
export type CommonCareerDataType = Omit<CareerData, "userId" | "createdAt">;
