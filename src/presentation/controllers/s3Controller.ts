import { Request, Response } from "express";
import { S3Client } from "@aws-sdk/client-s3";
import { HandleError } from "../../infrastructure/error/error";
import { S3KeyGenerator } from "../../infrastructure/helper/generateS3key";
import { S3FileGetUrlService } from "../../infrastructure/service/s3FileGetUrlService";
import { RandomStringGenerator } from "../../infrastructure/helper/generateRandomString";
import { S3FileUploadUrlService } from "../../infrastructure/service/s3FileUploadUrlService";

const s3Client = new S3Client();
const randomStringGenerator = new RandomStringGenerator();
const s3KeyGenerator = new S3KeyGenerator(randomStringGenerator);

const s3FileUploadUrlService = new S3FileUploadUrlService(s3Client, s3KeyGenerator);
const s3FileGetUrlService = new S3FileGetUrlService(s3Client);

export class S3Controller {
    constructor(
        private s3FileUploadUrlService: S3FileUploadUrlService,
        private s3FileGetUrlService: S3FileGetUrlService,
    ) {
        this.getPresignedUrl = this.getPresignedUrl.bind(this);
        this.getResumeUrlController = this.getResumeUrlController.bind(this);
    }

    getPresignedUrl = async (req: Request, res: Response): Promise<void> => {
        try {
            const { folder, userId, fileName, fileType } = req.query;

            if (!folder || !userId || !fileName || !fileType) {
                res.status(400).json({ message: "Missing required query parameters" });
                return;
            }

            const result = await this.s3FileUploadUrlService.generatePresignedUrl({
                folder: folder as string,
                userId: userId as string,
                fileName: fileName as string,
                fileType: fileType as string,
            });

            res.status(200).json(result);
        } catch (error: any) {
            console.error("Error generating pre-signed URL:", error);
            HandleError.handle(error, res);
        }
    };

     async getResumeUrlController (req: Request, res: Response) {
        try {
            const { key } = req.query;
            if (!key) return res.status(400).json({ message: "Missing file key" });

            const url = await s3FileGetUrlService.getFileUrl(key as string);
            return res.json({ url });
        } catch (error) {
            console.error("Error generating file URL:", error);
            return res.status(500).json({ message: "Failed to generate file URL" });
        }
    };
}

export const s3Controller = new S3Controller(s3FileUploadUrlService, s3FileGetUrlService)