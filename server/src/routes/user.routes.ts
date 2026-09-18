import { Router } from 'express';
import { getMe, updateMe, updateStatus, uploadAvatar, getPublicProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);
router.post('/me/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
router.patch('/me/status', authMiddleware, updateStatus);
router.get('/:id', getPublicProfile);

export default router;
