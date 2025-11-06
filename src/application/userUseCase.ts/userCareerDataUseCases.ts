import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { FileUploadService } from "../../infrastructure/service/fileUpload";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { CommonCareerDataType, CreateCareerDataRequest } from "../../infrastructure/dtos/user.dto";
import { CareerDataRepositoryImpl } from "../../infrastructure/database/careerData/careerDataRepositoryImpl";

export class UserCreateCareerDataUseCase {
    constructor(
        private careerDataRepositoryImpl: CareerDataRepositoryImpl,
        private fileUploadService: FileUploadService,
        private signedUrlService: SignedUrlService
    ) { }

    async execute(payload: CreateCareerDataRequest): Promise<ApiResponse<CommonCareerDataType>> {
        try {

            if (!payload.resume) throw new Error("Resume is required");

            let resumeUrl: string = "";
            resumeUrl = await this.fileUploadService.uploadFile({
                folder: "ss-hr-users-resumes",
                userId: "user",
                file: payload.resume as Express.Multer.File,
            });
            payload.resume = resumeUrl

            const careerData = await this.careerDataRepositoryImpl.createCareerData(payload);
            if (!careerData) throw new Error("Failed to save data");

            const { userId, createdAt, ...result } = careerData;

            const signedUrl = await this.signedUrlService.generateSignedUrl(
                careerData.resume as string
            );

            result.resume = signedUrl;

            return { success: true, message: "Data saved successfully", data: result }
        } catch (error) {
            console.log("UserCreateCareerDataUseCase error : ", error);
            throw handleUseCaseError(error || "Failed to create career data");
        }
    }
}