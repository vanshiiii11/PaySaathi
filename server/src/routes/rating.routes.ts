import { Router } from 'express';
import { createRating, getUserRatings } from '../controllers/rating.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, createRating);
router.get('/users/:id', getUserRatings);

export default router;
