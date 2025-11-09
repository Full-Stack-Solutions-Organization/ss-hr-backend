import { Router } from 'express';
import { upload } from '../../config/multerConfig';
import { authMiddleware } from '../middleware/authMiddleware';
import { userController } from '../controllers/userController';

const router = Router();

router.get('/chat/admins', authMiddleware, userController.getAdminsForChatSidebar);

router.patch('/prfileImage', authMiddleware, upload.single("profileImage"), userController.updateUserProfileImage );

router.get("/testimonials", authMiddleware, userController.getTestimonilas );

router.patch("/profile", authMiddleware, userController.updateProfileDetails);

router.post("/address", authMiddleware, userController.createAddress);

router.patch("/address/:id", authMiddleware, userController.updateAddress);

router.post("/career", authMiddleware, userController.createCareerData);

export default router;

