import { Router } from 'express';
import { create, update, list, get } from '../controllers/exchange.controller';
import { authMiddleware } from '../middleware/auth';
import { exchangeRequestLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', authMiddleware, exchangeRequestLimiter, create);
router.patch('/:id', authMiddleware, update);
router.get('/', authMiddleware, list);
router.get('/:id', authMiddleware, get);

export default router;
