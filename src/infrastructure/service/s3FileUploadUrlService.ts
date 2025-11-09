import { aws_s3Config } from "../../config/env";
import { S3KeyGenerator } from "../helper/generateS3key";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export class S3FileUploadUrlService {

  constructor(
    private s3: S3Client,
    private s3KeyGenerator: S3KeyGenerator,
  ) { }

  async generatePresignedUrl({
    folder,
    userId,
    fileName,
    fileType,
  }: {
    folder: string;
    userId: string;
    fileName: string;
    fileType: string;
  }): Promise<{ uploadUrl: string; key: string }> {
    try {
      const key = this.s3KeyGenerator.generateS3Key({
        folder,
        userId,
        originalname: fileName,
      });

      const command = new PutObjectCommand({
        Bucket: aws_s3Config.bucketName,
        Key: key,
        ContentType: fileType,
      });

      const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 });
      return { uploadUrl, key };
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new Error("Failed to generate pre-signed URL");
    }
  }
}
