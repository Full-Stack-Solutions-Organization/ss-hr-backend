import { Types } from "mongoose";
import { Application } from "../entities/application";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";
import { UserCreateApplicationRequest, UserFetchAllApplicationsResponse, UserUpdateApplicationRequest } from "../../infrastructure/dtos/user.dto";

export interface IApplicationRepository {
    createApplication(data: UserCreateApplicationRequest): Promise<Application | null>;

    updateApplication(data: UserUpdateApplicationRequest): Promise<Application | null>;

    userFindAllApplications(data: ApiPaginationRequest, userId: Types.ObjectId): Promise<ApiResponse<UserFetchAllApplicationsResponse>>;
}