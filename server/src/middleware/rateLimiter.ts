import rateLimit from 'express-rate-limit';

export const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  message: { success: false, error: { message: 'Too many OTP requests, please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  message: { success: false, error: { message: 'Too many requests, please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const reportRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { success: false, error: { message: 'Too many reports filed, please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const exchangeRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { success: false, error: { message: 'Too many exchange requests, please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false,
});
