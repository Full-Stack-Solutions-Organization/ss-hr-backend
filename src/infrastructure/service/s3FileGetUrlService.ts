import { aws_s3Config } from "../../config/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { SignedUrlRepositoryImpl } from "../database/signedUrl/signedUrlRepositoryImpl";

export class S3FileGetUrlService {
  constructor(
    private s3: S3Client,
    private signedUrlRepositoryImpl: SignedUrlRepositoryImpl,
    private bucketName: string = aws_s3Config.bucketName!
  ) {}

  async getFileUrl(key: string, expires: number = 172800): Promise<string> {
    try {
      if (!key) throw new Error("File key is required");

      const existing = await this.signedUrlRepositoryImpl.findOneSignedUrl(key);
      if (existing && existing.expiresAt > new Date()) {
        console.log("Returning cached signed URL");
        return existing.url;
      }

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: expires });
      const expiresAt = new Date(Date.now() + expires * 1000);

      await this.signedUrlRepositoryImpl.findOneSignedUrlAndUpdate(key, signedUrl, expiresAt);

      console.log("Generated new signed URL");
      return signedUrl;
    } catch (error) {
      console.error("Error generating or fetching signed URL:", error);
      throw new Error("Failed to generate signed URL");
    }
  }
}
