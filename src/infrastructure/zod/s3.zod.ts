import z from "zod";
import { enumField, objectIdField, stringField } from "./common.zod";

export const PresignedUrlZodSchema = z.object({
  folder: z.literal("resumes"),
  userId: objectIdField("userId"),
  fileName: stringField("filename", 1, 100),
  fileType: enumField("file type", [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]),
});

export const S3FileKeyZodSchmema = z.object({
  key: stringField("key", 6, 500, /^(resumes|profiles)\/[A-Za-z0-9._\-]+$/)
})