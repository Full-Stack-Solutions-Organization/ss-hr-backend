import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { userController } from '../controllers/userController';
import { userProfileController } from '../controllers/userProfileController';

const router = Router();

router.patch('/prfileImage', authMiddleware, userProfileController.updateUserProfileImage );

router.patch("/profile", authMiddleware, userProfileController.updateProfileDetails);

router.post("/address", authMiddleware, userProfileController.createAddress);

router.patch("/address/:id", authMiddleware, userProfileController.updateAddress);

router.post("/career", authMiddleware, userProfileController.createCareerData);

router.patch("/career/:id", authMiddleware, userProfileController.updateCareerData);

router.patch('/resume', authMiddleware, userProfileController.updateResumeKey);

router.get('/chat/admins', authMiddleware, userController.getAdminsForChatSidebar);

router.get("/testimonials", authMiddleware, userController.getTestimonilas );

router.get('/jobs', authMiddleware, userController.getAllJobs);

router.post('/apply-job/:id', authMiddleware, userController.applyJob);

router.patch('/cancel-job/:id', authMiddleware, userController.cancelJobApplication);

router.get('/applications', authMiddleware, userController.getApplications);

export default router;

