import { Router } from 'express';
import { requestOtp, verifyOtpCode, refresh, logout } from '../controllers/auth.controller';
import { otpRateLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

router.post('/otp/send', otpRateLimiter, validate(z.object({ phone: z.string() })), requestOtp);
router.post('/otp/verify', validate(z.object({ phone: z.string(), code: z.string() })), verifyOtpCode);
router.post('/refresh', validate(z.object({ refreshToken: z.string() })), refresh);
router.post('/logout', validate(z.object({ refreshToken: z.string().optional() })), logout);

export default router;
