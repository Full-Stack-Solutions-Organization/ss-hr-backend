import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { CareerDataRepositoryImpl } from "../../infrastructure/database/careerData/careerDataRepositoryImpl";
import { CommonCareerDataType, CreateCareerDataRequest, UpdateCareerDataRequest } from "../../infrastructure/dtos/user.dto";

export class UserCreateCareerDataUseCase {
    constructor(
        private careerDataRepositoryImpl: CareerDataRepositoryImpl,
    ) { }

    async execute(payload: CreateCareerDataRequest): Promise<ApiResponse<CommonCareerDataType>> {
        try {
            const careerData = await this.careerDataRepositoryImpl.createCareerData(payload);
            if (!careerData) throw new Error("Failed to save data");

            const { userId, createdAt, ...result } = careerData;

            return { success: true, message: "Data saved successfully", data: result }
        } catch (error) {
            throw handleUseCaseError(error || "Failed to create career data");
        }
    }
}

export class UserUpdateCareerDataUseCase {
    constructor(
        private careerDataRepositoryImpl: CareerDataRepositoryImpl,
    ) { }

    async execute(payload: UpdateCareerDataRequest): Promise<ApiResponse<CommonCareerDataType>> {
        try {

            const updatedCareerData = await this.careerDataRepositoryImpl.updateCareerData(payload);
            if (!updatedCareerData) throw new Error("Failed to update data");

            const { userId, createdAt, ...result } = updatedCareerData;

            return { success: true, message: "Data updated successfully", data: result }
        } catch (error) {
            throw handleUseCaseError(error || "Failed to update career data");
        }
    }
}