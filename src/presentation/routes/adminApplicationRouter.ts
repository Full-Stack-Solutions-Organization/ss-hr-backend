import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminApplicationController } from "../controllers/adminApplicationController";

const router = Router();

router.get("/", authMiddleware, adminApplicationController.fetchAllApplications);

router.get("/:id", authMiddleware, adminApplicationController.fetchApplication);

router.patch("/:id", authMiddleware, adminApplicationController.updateApplicationStatus);

export default router;