import { Router } from 'express';
import { getMessages } from '../controllers/chat.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/:threadId/messages', authMiddleware, getMessages);

export default router;
