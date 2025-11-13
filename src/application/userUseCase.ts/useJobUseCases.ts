import { Types } from "mongoose";
import { UserFetchAllJobsResponse, UserFetchJobDetailsResponse } from "../../infrastructure/dtos/user.dto";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { JobRepositoryImpl } from "../../infrastructure/database/job/jobRepositoryImpl";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";

export class UserGetAllJobsUseCase {
    constructor(
        private jobRepositoryImpl: JobRepositoryImpl,
    ) { }

    async execute(payload: ApiPaginationRequest, userId: Types.ObjectId): Promise<ApiResponse<UserFetchAllJobsResponse>> {
        try {
            const result = await this.jobRepositoryImpl.userFindAllJobs(payload, userId);
            if (!result) throw new Error("Failed to find jobs");
            return {
                success: true,
                message: "Jobs",
                currentPage: result.currentPage,
                data: result.data,
                totalCount: result.totalCount,
                totalPages: result.totalPages,
            };
        } catch (error) {
            console.log("UserGetAllJobsUseCase error : ", error);
            throw handleUseCaseError(error || "Failed to get all jobs");
        }
    }
}


export class UserGetJobByIdUseCase {
  constructor(private jobRepository: JobRepositoryImpl) { }

  async execute(jobId: Types.ObjectId ): Promise<ApiResponse<UserFetchJobDetailsResponse>> {
    try {

      if (!jobId) {
        throw new Error("Job ID is required");
      }

      const job = await this.jobRepository.findJobById(jobId, true);
      if (!job) throw new Error("Job not found");

      return {
        success: true,
        message: "Job retrieved successfully",
        data: job
      };
    } catch (error) {
      throw handleUseCaseError(error || "Unexpected error in GetJobByIdUseCase");
    }
  }
}