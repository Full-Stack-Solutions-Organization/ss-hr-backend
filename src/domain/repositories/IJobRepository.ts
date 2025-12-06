
import { Types } from "mongoose";
import { Job } from "../entities/job";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";
import { UserFetchAllJobsResponse, UserFetchJobDetailsResponse } from "../../infrastructure/dtos/user.dto";
import { AdminCreateNewJob, AdminFetchAllJobs, AdminFetchJobDetailsResponse } from "../../infrastructure/dtos/adminJob.dtos";

export interface IJobRepository {
  createJob(payload: AdminCreateNewJob): Promise<Job | null>;

  adminFindAllJobs({page,limit}: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllJobs>>;
  
  findJobById(jobId: Types.ObjectId, admin: boolean): Promise<AdminFetchJobDetailsResponse | UserFetchJobDetailsResponse | null>;
  
  updateJob(jobId: Types.ObjectId, updatedData: AdminCreateNewJob): Promise<Job | null>;
  
  deleteJob(jobId: Types.ObjectId): Promise<boolean>;

  userFindAllJobs({page,limit}: ApiPaginationRequest, userId: Types.ObjectId): Promise<ApiResponse<UserFetchAllJobsResponse>>

  countJobs(): Promise<number>;
  
  // findJobsByCompanyName(companyName: string): Promise<Job[]>;
}