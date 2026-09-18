import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

export const signAccessToken = (payload: { id: string; phone: string }): string => {
  return jwt.sign(payload, accessSecret, { expiresIn: '15m' });
};

export const signRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): { id: string; phone: string } => {
  return jwt.verify(token, accessSecret) as { id: string; phone: string };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, refreshSecret) as { userId: string };
};
