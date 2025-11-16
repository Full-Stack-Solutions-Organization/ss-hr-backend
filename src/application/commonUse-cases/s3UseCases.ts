import { User } from "../../domain/entities/user";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { S3FileGetUrlService } from "../../infrastructure/service/s3FileGetUrlService";
import { S3FileDeleteUrlService } from "../../infrastructure/service/s3FileDeleteService";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { S3FileUploadUrlService } from "../../infrastructure/service/s3FileUploadUrlService";
import { ApiResponse, CommonResponse, FolderNames, UploadFilePresignedUrl, UploadFilePresignedUrlRequest } from "../../infrastructure/dtos/common.dts";

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
        private userRepositoryImpl: UserRepositoryImpl,
    ) { }

    async execute(_id: User["_id"], folderName: FolderNames): Promise<CommonResponse> {
        try {
            if (!_id) throw new Error("No user found");

            const user = await this.userRepositoryImpl.findUserById(_id);
            if(!user) throw new Error("No user found");

            const fileToDelete : string = folderName === FolderNames.resumes ? user.resume : user.profileImage;

            return await this.s3FileDeleteUrlService.deleteFile(fileToDelete);

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