import express from "express";
import { s3Controller } from "../controllers/s3Controller";

const router = express.Router();

router.get("/upload-url", s3Controller.getPresignedUrl);
router.get("/resume-url", s3Controller.getResumeUrlController);

export default router;
