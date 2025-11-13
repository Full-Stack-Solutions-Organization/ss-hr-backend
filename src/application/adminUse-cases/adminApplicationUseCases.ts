import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";
import { ApplicationRepositoryImpl } from "../../infrastructure/database/application/applicationRepositoryImpl";
import { AdminFetchAllApplicationsResponse, AdminFetchApplicationDetailsRequest, AdminFetchApplicationDetailsResponse } from "../../infrastructure/dtos/admin.dtos";

export class AdminFetchAllApplicationsUseCase {
    constructor(
        private applicationRepositoryImpl: ApplicationRepositoryImpl
    ) { }

    async execute(data: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllApplicationsResponse>> {
        try {
            const result = await this.applicationRepositoryImpl.adminFindAllApplications(data);
            if (!result) throw new Error("Failed to fetch applications")

            return {
                success: true,
                message: "Applications retrieved successfully",
                data: result.data,
                currentPage: result.currentPage,
                totalCount: result.totalCount,
                totalPages: result.totalPages,
            }
        } catch (error) {
            throw handleUseCaseError(error || "Failed to fetch applications");
        }
    }
} 


export class AdminFetchApplicationDetailsUseCase {
    constructor(
        private applicationRepositoryImpl: ApplicationRepositoryImpl,
        private signedUrlService: SignedUrlService
    ) { }

    async execute(data: AdminFetchApplicationDetailsRequest): Promise<ApiResponse<AdminFetchApplicationDetailsResponse>> {
        try {
            const result = await this.applicationRepositoryImpl.adminFetchApplicationDetails(data);
            if(!result) throw new Error("Failed to fetch application details");

            if(result.userId.profileImage) {
                result.userId.profileImage = await this.signedUrlService.generateSignedUrl(result.userId.profileImage);
            }
            if(result.userId.resume) {
                result.userId.resume = await this.signedUrlService.generateSignedUrl(result.userId.resume);
            }
            return { success: true, message: "Application details", data: result };
        } catch (error) {
            throw handleUseCaseError(error || "Failed to fetch application details");
        }
    }
}

