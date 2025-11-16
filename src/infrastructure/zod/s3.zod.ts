import z from "zod";
import { folderNameSchema, s3FileKey } from "./common.zod";
import { enumField, objectIdField, stringField } from "./zodUtilities";

export const PresignedUrlZodSchema = z.object({
  folder: folderNameSchema,
  userId: objectIdField("userId"),
  fileName: stringField("filename", 1, 100),
  fileType: enumField("fileType", [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg"
]),
});

export const S3FileKeyZodSchmema = z.object({s3FileKey});

export const deleteFileZodSchema = z.object({
  folder: folderNameSchema,
});