import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { CommonCareerDataType, CreateCareerDataRequest } from "../../infrastructure/dtos/user.dto";
import { CareerDataRepositoryImpl } from "../../infrastructure/database/careerData/careerDataRepositoryImpl";

export class UserCreateCareerDataUseCase {
    constructor(
        private careerDataRepositoryImpl: CareerDataRepositoryImpl,
    ) { }

    async execute(payload: CreateCareerDataRequest): Promise<ApiResponse<CommonCareerDataType>> {
        try {

            if (!payload.resume) throw new Error("Resume is required");

            const careerData = await this.careerDataRepositoryImpl.createCareerData(payload);
            if (!careerData) throw new Error("Failed to save data");

            const { userId, createdAt, ...result } = careerData;

            return { success: true, message: "Data saved successfully", data: result }
        } catch (error) {
            console.log("UserCreateCareerDataUseCase error : ", error);
            throw handleUseCaseError(error || "Failed to create career data");
        }
    }
}