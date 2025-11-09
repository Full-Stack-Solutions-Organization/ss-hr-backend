import { aws_s3Config } from "../../config/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export class S3FileGetUrlService {
    constructor(
        private s3: S3Client,
    ) { }

    async getFileUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: aws_s3Config.bucketName!,
            Key: key,
        });

        const url = await getSignedUrl(this.s3, command, { expiresIn: 300 });
        return url;
    }
}
