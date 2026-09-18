import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { success, error } from '../utils/response';
import { uploadAvatar as uploadAvatarService } from '../services/upload.service';

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });
    return success(res, { user });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const { name, bio, expoPushToken } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, bio, expoPushToken }
    });
    
    return success(res, { user });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { isActive, intent, minAmount, maxAmount, radiusKm, locationLat, locationLng } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        isActive,
        intent,
        minAmount,
        maxAmount,
        radiusKm,
        locationLat,
        locationLng,
        lastSeenAt: new Date()
      }
    });
    
    return success(res, { user });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return error(res, 'No file uploaded', 400);
    }
    
    const avatarUrl = await uploadAvatarService(req.file.path, req.user!.id);
    
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatarUrl }
    });
    
    return success(res, { user });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        bio: true,
        isVerified: true,
        rating: true,
        ratingCount: true,
        exchangeCount: true,
        createdAt: true,
        intent: true,
        minAmount: true,
        maxAmount: true,
      }
    });
    
    if (!user) {
      return error(res, 'User not found', 404);
    }
    
    return success(res, { user });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};
