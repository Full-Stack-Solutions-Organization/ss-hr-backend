import { Types } from "mongoose";
import { Job } from "../../domain/entities/job";
import { User } from "../../domain/entities/user";
import { CareerData } from "../../domain/entities/careerData";
import { Application } from "../../domain/entities/application";

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

// User profile data
export type UseUpdateProfileRequest = Pick<User, "_id" | "fullName" | "phone" | "phoneTwo" | "gender" | "nationality" | "dob" | "professionalStatus"> & Partial<Pick<User, "linkedInUsername" | "portfolioUrl">>;
export type UseUpdateProfileResponse = Pick<User, "fullName" | "phone" | "phoneTwo" | "gender" | "nationality" | "dob" | "linkedInUsername" | "portfolioUrl" | "professionalStatus">;


// User Career data
export type CreateCareerDataRequest = Partial<Pick<CareerData, "currentSalary" | "expectedSalary" | "currentCompany" | "currentDesignation" | "currentJobType" | "experience" | "immediateJoiner" | "industry" | "noticePeriod" | "preferredJobTypes" | "preferredWorkModes">> & {
  userId: User["_id"];
};
export type UpdateCareerDataRequest = Partial<Pick<CareerData, "currentSalary" | "expectedSalary" | "currentCompany" | "currentDesignation" | "currentJobType" | "experience" | "immediateJoiner" | "industry" | "noticePeriod" | "preferredJobTypes" | "preferredWorkModes">> & {
  _id: CareerData["_id"];
};
export type CommonCareerDataType = Omit<CareerData, "userId" | "createdAt">;

// user jobs
export type UserFetchAllJobsResponse = Array<Pick<Job, "_id" | "salary" | "designation" | "vacancy" | "createdAt"> & {
  applied: boolean;
}>;

export type UserFetchJobDetailsResponse = Omit<Job, "updatedAt" | "companyName">;

// User Application
export type UserCreateApplicationRequest = Pick<Application, "jobId" | "userId">;
export type UserCreateOrUpdateApplicationResponse = Pick<Application, "jobId" | "status">;

export type UserUpdateApplicationRequest = Pick<Application, "_id" | "status"> & {
  userId: User["_id"]
};

export type UserFetchApplicationsJobFields = Pick<Job, "_id" | "designation">; 

export type UserFetchAllApplicationsResponse = Array<{
  _id: Application["_id"];
  updatedAt: Application["updatedAt"];
  status: Application["status"];
} & UserFetchApplicationsJobFields>;

