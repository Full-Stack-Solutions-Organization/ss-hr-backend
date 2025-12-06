import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";
import { ApplicationRepositoryImpl } from "../../infrastructure/database/application/applicationRepositoryImpl";
import { AdminFetchAllApplicationsResponse, AdminFetchApplicationDetailsRequest, AdminFetchApplicationDetailsResponse, AdminUpdateApplicationStatusRequest } from "../../infrastructure/dtos/admin.dtos";

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


export class AdminUpdateApplicationStatusUseCase {
    constructor(
        private applicationRepositoryImpl: ApplicationRepositoryImpl
    ) { }

    async execute(data: AdminUpdateApplicationStatusRequest): Promise<ApiResponse> {
        try {
            const updatedApplication = await this.applicationRepositoryImpl.adminUpdateApplicationStatus(data);
            if(!updatedApplication) throw new Error("Failed to update application status");
            return { success: true, message: "Application status updated sucessfully." };
        } catch (error) {
            throw handleUseCaseError(error || "Admin spplication status updating failed");
        }
    }
}

export class GetApplicationStatsUseCase {
    constructor(private applicationRepository: ApplicationRepositoryImpl) {}

    async execute() {
        try {
            const totalApplications = await this.applicationRepository.getTotalCount();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const successfulPlacements = await this.applicationRepository.getSuccessfulPlacementsCount(thirtyDaysAgo);
            
            return {
                success: true,
                message: "Application stats retrieved successfully",
                stats: {
                    totalApplications,
                    successfulPlacements
                }
            };
        } catch (error) {
            throw handleUseCaseError(error || "Failed to get application stats");
        }
    }
}

export class GetApplicationGraphDataUseCase {
    constructor(private applicationRepository: ApplicationRepositoryImpl) {}

    async execute() {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const graphData = await this.applicationRepository.getApplicationGraphData(thirtyDaysAgo);
            
            const applicationsLineGraphData = graphData.map((item: any) => ({
                date: item._id,
                applications: item.count,
                placed: item.placedCount
            }));

            return {
                success: true,
                message: "Application graph data retrieved successfully",
                data: {
                    applicationsLineGraphData
                }
            };
        } catch (error) {
            throw handleUseCaseError(error || "Failed to get application graph data");
        }
    }
}