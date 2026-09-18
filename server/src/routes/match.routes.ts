import { Router } from 'express';
import { getNearby } from '../controllers/match.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/nearby', authMiddleware, getNearby);

export default router;
