import { Types } from "mongoose";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/addressRepositoryImpl";
import { ApplicationRepositoryImpl } from "../../infrastructure/database/application/applicationRepositoryImpl";
import { UserCreateApplicationRequest, UserCreateOrUpdateApplicationResponse, UserFetchAllApplicationsResponse, UserUpdateApplicationRequest } from "../../infrastructure/dtos/user.dto";

export class UserCreateApplicationUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private addressRepositoryImpl: AddressRepositoryImpl,
        private applicationRepositoryImpl: ApplicationRepositoryImpl,
    ) { }

    async execute(data: UserCreateApplicationRequest): Promise<ApiResponse<UserCreateOrUpdateApplicationResponse>> {
        try {

            const userDetails = await this.userRepositoryImpl.findUserById(data.userId);

            if(userDetails?.isBlocked) {
                throw new Error("Your account has been blocked.");
            }
            
            if(!userDetails?.isVerified) {
                throw new Error("You account is not verified");
            }

            if(!userDetails?.phone || !userDetails.phoneTwo || !userDetails.resume || userDetails.gender || 
                !userDetails.nationality || !userDetails.dob || !userDetails.professionalStatus) {
                    throw new Error("Please complete your profile details before applying to jobs.");
                }


            
            const userAddress = await this.addressRepositoryImpl.findAddressesByUserId(data.userId);
            if(!userAddress) throw new Error("Please save your address before applying to jobs.");

            const application = await this.applicationRepositoryImpl.createApplication(data);
            if (!application) throw new Error("Failed to save application");

            return {
                success: true, message: "Your application has been saved.", data: {
                    jobId: application.jobId,
                    status: application.status
                }
            };

        } catch (error) {
            console.log("UserCreateApplicationUseCase error : ", error);
            throw handleUseCaseError(error || "Failed to save application");
        }
    }
}

export class UserUpdateApplicationUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private addressRepositoryImpl: AddressRepositoryImpl,
        private applicationRepositoryImpl: ApplicationRepositoryImpl,
    ) { }

    async execute(data: UserUpdateApplicationRequest): Promise<ApiResponse<UserCreateOrUpdateApplicationResponse>> {
        try {

            const userDetails = await this.userRepositoryImpl.findUserById(data.userId);

            if(userDetails?.isBlocked) {
                throw new Error("Your account has been blocked.");
            }
            
            if(!userDetails?.isVerified) {
                throw new Error("You account is not verified");
            }

            if(!userDetails?.phone || !userDetails.phoneTwo || !userDetails.resume || userDetails.gender || 
                !userDetails.nationality || !userDetails.dob || !userDetails.professionalStatus) {
                    throw new Error("Please complete your profile details before applying to jobs.");
                }


            
            const userAddress = await this.addressRepositoryImpl.findAddressesByUserId(data.userId);
            if(!userAddress) throw new Error("Please save your address before applying to jobs.");

            const updatedApplication = await this.applicationRepositoryImpl.updateApplication(data);
            if (!updatedApplication) throw new Error("Failed to update application");

            return {
                success: true, message: `Your application has been ${updatedApplication.status ? "saved" : "cancelled"}.`, data: {
                    jobId: updatedApplication.jobId,
                    status: updatedApplication.status,
                }
            };

        } catch (error) {
            console.log("Error : ", error);
            console.log("UserCreateApplicationUseCase error : ", error);
            throw handleUseCaseError(error || "Failed to update application");
        }
    }
}

export class UserFetchAllApplicationsUseCase {
    constructor(
        private applicationRepositoryImpl: ApplicationRepositoryImpl,
    ) { }

    async execute(data: ApiPaginationRequest, userId: Types.ObjectId): Promise<ApiResponse<UserFetchAllApplicationsResponse>> {
        try {
            const result = await this.applicationRepositoryImpl.userFindAllApplications(data, userId);
            if(!result) throw new Error("Failed to fetch applications");
            return{
                success: true,
                message: "Applications",
                currentPage: result.currentPage,
                data: result.data,
                totalCount: result.totalCount,
                totalPages: result.totalPages,
            }
        } catch (error) {
            console.log("UserFetchAllApplicationsUseCase error : ", error);
            throw handleUseCaseError(error || "Failed to fetch applications");
        }
    }
}