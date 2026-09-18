import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/jwt.service';
import { error } from '../utils/response';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Unauthorized', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.id, phone: payload.phone };
    next();
  } catch (err) {
    return error(res, 'Unauthorized', 401);
  }
};
