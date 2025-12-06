import { Types } from "mongoose";
import { Application } from "../entities/application";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";
import { UserCreateApplicationRequest, UserFetchAllApplicationsResponse, UserUpdateApplicationRequest } from "../../infrastructure/dtos/user.dto";
import { AdminFetchAllApplicationsResponse, AdminFetchApplicationDetailsRequest, AdminFetchApplicationDetailsResponse, AdminUpdateApplicationStatusRequest } from "../../infrastructure/dtos/admin.dtos";

export interface IApplicationRepository {
    createApplication(data: UserCreateApplicationRequest): Promise<Application | null>;

    updateApplication(data: UserUpdateApplicationRequest): Promise<Application | null>;

    userFindAllApplications(data: ApiPaginationRequest, userId: Types.ObjectId): Promise<ApiResponse<UserFetchAllApplicationsResponse>>;

    adminFindAllApplications(data: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllApplicationsResponse>>;

    adminFetchApplicationDetails(data: AdminFetchApplicationDetailsRequest): Promise<AdminFetchApplicationDetailsResponse>;

    findApplicationByUserIdWithApplicationId(data: UserCreateApplicationRequest): Promise<Application | null>;

    adminUpdateApplicationStatus(data: AdminUpdateApplicationStatusRequest): Promise<Application | null>;

    getTotalCount(): Promise<number>;

    getSuccessfulPlacementsCount(startDate: Date): Promise<number>;

    getApplicationGraphData(startDate: Date): Promise<any>;
}