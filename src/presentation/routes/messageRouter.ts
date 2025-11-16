import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { messageController } from '../controllers/messageController';

const router = Router();

router.get('/:toUserId',authMiddleware, messageController.getMessages);

router.post('/send/:toUserId',authMiddleware, messageController.sendMessage);

export default router;