import { Types } from "mongoose";
import { DecodedUser } from "../../express";
import { Request, Response } from "express";
import { s3Client } from "../../config/aws_s3";
import { HandleError } from "../../infrastructure/error/error";
import { S3KeyGenerator } from "../../infrastructure/helper/generateS3key";
import { S3FileGetUrlService } from "../../infrastructure/service/s3FileGetUrlService";
import { RandomStringGenerator } from "../../infrastructure/helper/generateRandomString";
import { S3FileDeleteUrlService } from "../../infrastructure/service/s3FileDeleteService";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { S3FileUploadUrlService } from "../../infrastructure/service/s3FileUploadUrlService";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";
import { deleteFileZodSchema, PresignedUrlZodSchema, S3FileKeyZodSchmema } from "../../infrastructure/zod/s3.zod";
import { DeleteFileFromS3UseCase, GetFileSignedUrlUseCase, UploadFileToS3UseCase } from "../../application/commonUse-cases/s3UseCases";

const userRepositoryImpl = new UserRepositoryImpl();
const randomStringGenerator = new RandomStringGenerator();
const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();
const s3KeyGenerator = new S3KeyGenerator(randomStringGenerator);
const s3FileDeleteUrlService = new S3FileDeleteUrlService(s3Client);
const s3FileUploadUrlService = new S3FileUploadUrlService(s3Client, s3KeyGenerator);
const s3FileGetUrlService = new S3FileGetUrlService(s3Client, signedUrlRepositoryImpl);

const uploadFileToS3UseCase = new UploadFileToS3UseCase(s3FileUploadUrlService);
const getFileSignedUrlUseCase = new GetFileSignedUrlUseCase(s3FileGetUrlService);
const deleteFileFromS3UseCase = new DeleteFileFromS3UseCase(s3FileDeleteUrlService, userRepositoryImpl);

export class S3Controller {
    constructor(
        private uploadFileToS3UseCase: UploadFileToS3UseCase,
        private getFileSignedUrlUseCase: GetFileSignedUrlUseCase,
        private deleteFileFromS3UseCase: DeleteFileFromS3UseCase,
    ) {
        this.getUploadPresignedUrl = this.getUploadPresignedUrl.bind(this);
        this.getFileSignedUrl = this.getFileSignedUrl.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }

    async getUploadPresignedUrl(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = PresignedUrlZodSchema.parse(req.query);
            const result = await this.uploadFileToS3UseCase.execute(validatedData);
            res.status(200).json(result);
        } catch (error: any) {
            HandleError.handle(error, res);
        }
    };

    async getFileSignedUrl(req: Request, res: Response) {
        try {
            const validatedData = S3FileKeyZodSchmema.parse(req.query);
            const result = await this.getFileSignedUrlUseCase.execute(validatedData.s3FileKey);
            return res.json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    };

    async deleteFile(req: Request, res: Response) {
        try {
            const userId = (req.user as DecodedUser).userId;
            const validatedData = deleteFileZodSchema.parse(req.body);
            const result = await this.deleteFileFromS3UseCase.execute(new Types.ObjectId(userId), validatedData.folder);
            return res.json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    };
}

export const s3Controller = new S3Controller(
    uploadFileToS3UseCase,
    getFileSignedUrlUseCase,
    deleteFileFromS3UseCase
);