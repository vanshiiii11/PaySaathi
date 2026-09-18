import { Router } from 'express';
import { createReport, blockUser, unblockUser } from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth';
import { reportRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', authMiddleware, reportRateLimiter, createReport);
router.post('/users/:id/block', authMiddleware, blockUser);
router.delete('/users/:id/block', authMiddleware, unblockUser);

export default router;
