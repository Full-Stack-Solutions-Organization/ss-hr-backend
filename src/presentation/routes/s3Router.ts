import express from "express";
import { s3Controller } from "../controllers/s3Controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/presigned-upload-url", authMiddleware, s3Controller.getUploadPresignedUrl);

router.get("/presigned-get-url", authMiddleware, s3Controller.getFileSignedUrl);

router.delete("/", authMiddleware, s3Controller.deleteFile);

export default router;
