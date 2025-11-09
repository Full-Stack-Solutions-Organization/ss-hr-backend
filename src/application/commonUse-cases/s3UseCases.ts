import { ApiResponse, CommonResponse, UploadFilePresignedUrl, UploadFilePresignedUrlRequest } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { S3FileDeleteUrlService } from "../../infrastructure/service/s3FileDeleteService";
import { S3FileGetUrlService } from "../../infrastructure/service/s3FileGetUrlService";
import { S3FileUploadUrlService } from "../../infrastructure/service/s3FileUploadUrlService";

export class UploadFileToS3UseCase {
    constructor(
        private s3FileUploadUrlService: S3FileUploadUrlService,
    ) { }

    async execute(data: UploadFilePresignedUrlRequest): Promise<ApiResponse<UploadFilePresignedUrl>> {
        try {

            const { fileName, fileType, folder, userId } = data;
            if(!fileName || !fileType || !folder || !userId) throw new Error("Invalid request");

            const { uploadUrl, key } = await this.s3FileUploadUrlService.generatePresignedUrl({fileName, fileType, folder, userId})
            
            return { success: true, message: "Presigned url", data: {
                key,
                uploadUrl
            }};

        } catch (error) {
            throw handleUseCaseError(error || "Failed to upload file.");
        }
    }
}

export class DeleteFileFromS3UseCase {
    constructor(
        private s3FileDeleteUrlService: S3FileDeleteUrlService,
    ) { }

    async execute(key: string): Promise<CommonResponse> {
        try {
            if (!key) throw new Error("No key found");

            return await this.s3FileDeleteUrlService.deleteFile(key);

        } catch (error) {
            throw handleUseCaseError(error || "Failed to delete file.");
        }
    }
};

export class GetFileSignedUrlUseCase {
    constructor(
        private s3FileGetUrlService: S3FileGetUrlService
    ) { }

    async execute(key: string): Promise<ApiResponse> {
        try {
            if (!key) throw new Error("Noe key found");

            const signedUrl = await this.s3FileGetUrlService.getFileUrl(key);

            return { success: true, message: "Signed Url", data: signedUrl };

        } catch (error) {
            throw handleUseCaseError(error || "Failed to generated signed url.");
        }
    }
}