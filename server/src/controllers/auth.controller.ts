import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createOtpRecord, sendOtp, verifyOtp } from '../services/otp.service';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/jwt.service';
import { success, error } from '../utils/response';
import { normalizePhone } from '../utils/validate-phone';

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const normalizedPhone = normalizePhone(phone);
    
    const { code } = await createOtpRecord(normalizedPhone);
    await sendOtp(normalizedPhone, code);
    
    return success(res, { message: 'OTP sent successfully' });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const verifyOtpCode = async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;
    const normalizedPhone = normalizePhone(phone);
    
    const isValid = await verifyOtp(normalizedPhone, code);
    if (!isValid) {
      return error(res, 'Invalid or expired OTP', 400);
    }
    
    let user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
    let isNewUser = false;
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: normalizedPhone,
          name: `User_${normalizedPhone.slice(-4)}`
        }
      });
      isNewUser = true;
    }
    
    const accessToken = signAccessToken({ id: user.id, phone: user.phone });
    const refreshToken = signRefreshToken(user.id);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt
      }
    });
    
    return success(res, { user, accessToken, refreshToken, isNewUser });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });
    
    if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
      if (tokenRecord) {
        await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      }
      return error(res, 'Invalid or expired refresh token', 401);
    }
    
    try {
      const payload = verifyRefreshToken(refreshToken);
      if (payload.userId !== tokenRecord.userId) {
        throw new Error();
      }
    } catch {
      await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      return error(res, 'Invalid refresh token', 401);
    }
    
    const accessToken = signAccessToken({ id: tokenRecord.user.id, phone: tokenRecord.user.phone });
    
    return success(res, { accessToken });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      });
    }
    return success(res, { message: 'Logged out successfully' });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};
