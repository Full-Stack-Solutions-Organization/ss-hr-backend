import { Application } from "../../../domain/entities/application";
import { ApplicationModel, IApplication } from "./applicationModel";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepository";
import { UserCreateApplicationRequest, UserFetchAllApplicationsResponse, UserFetchApplicationsJobFields, UserUpdateApplicationRequest } from "../../dtos/user.dto";
import { Types } from "mongoose";
import { ApiPaginationRequest, ApiResponse } from "../../dtos/common.dts";

export class ApplicationRepositoryImpl implements IApplicationRepository {

    private mapToEntity(application: IApplication): Application {
        return new Application(
            application._id,
            application.jobId,
            application.userId,
            application.status,
            application.createdAt,
            application.updatedAt,
        );
    }

    async createApplication(data: UserCreateApplicationRequest): Promise<Application | null> {
        try {
            const application = await ApplicationModel.create({ userId: data.userId, jobId: data.jobId, status: true });
            return application ? this.mapToEntity(application) : null;
        } catch (error) {
            throw new Error("Failed to create application");
        }
    }

    async updateApplication(data: UserUpdateApplicationRequest): Promise<Application | null> {
        try {
            const updatedApplication = await ApplicationModel.findOneAndUpdate(
                { _id: data._id },
                { $set: { status: data.status } },
                { new: true }
            );
            return updatedApplication ? this.mapToEntity(updatedApplication) : null;
        } catch (error) {
            throw new Error("Failed to update application");
        }
    }

    async userFindAllApplications(data: ApiPaginationRequest, userId: Types.ObjectId): Promise<ApiResponse<UserFetchAllApplicationsResponse>> {
        try {
            const { page, limit } = data;
            const [applications, totalCount] = await Promise.all([
                ApplicationModel.find({ userId })
                    .populate<{jobId: UserFetchApplicationsJobFields}>("jobId")
                    .skip((page - 1) * limit)
                    .limit(limit),
                ApplicationModel.countDocuments({ userId })
            ]);

            const totalPages = Math.ceil(totalCount / limit);

            return {
                data: applications.map(application => ({
                    _id: application._id,
                    updatedAt: application.updatedAt,
                    status: application.status,
                    jobId: application.jobId._id,
                    designation: application.jobId.designation,
                })),
                totalPages,
                currentPage: page,
                totalCount
            };
        } catch (error) {
            throw new Error("Failed to fetch applications")
        }
    }

}