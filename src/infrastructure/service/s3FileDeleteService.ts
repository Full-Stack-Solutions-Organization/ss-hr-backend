import { CommonResponse } from "../dtos/common.dts";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export class S3FileDeleteUrlService {

  constructor(
    private s3: S3Client,
  ) { }

  async deleteFile(key: string): Promise<CommonResponse> {
    try {
      
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
      });

      await this.s3.send(command);
      return { success: true, message: "File deleted successfully!" };
    } catch (error) {
      throw new Error("Failed to generate pre-signed URL");
    }
  }
}
