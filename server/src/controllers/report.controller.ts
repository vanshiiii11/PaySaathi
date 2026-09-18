import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { success, error } from '../utils/response';
import { autoSuspendCheck } from '../services/exchange.service';

export const createReport = async (req: Request, res: Response) => {
  try {
    const { reportedId, reason, details, exchangeId } = req.body;
    const reporterId = req.user!.id;
    
    if (reporterId === reportedId) {
      return error(res, 'Cannot report yourself', 400);
    }
    
    const report = await prisma.report.create({
      data: {
        reporterId,
        reportedId,
        reason,
        details,
        exchangeId
      }
    });
    
    await autoSuspendCheck(reportedId);
    
    return success(res, { report }, 201);
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id: blockeeId } = req.params;
    const blockerId = req.user!.id;
    
    if (blockerId === blockeeId) return error(res, 'Cannot block yourself', 400);
    
    await prisma.block.upsert({
      where: { blockerId_blockeeId: { blockerId, blockeeId } },
      update: {},
      create: { blockerId, blockeeId }
    });
    
    return success(res, { message: 'User blocked' });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  try {
    const { id: blockeeId } = req.params;
    const blockerId = req.user!.id;
    
    await prisma.block.deleteMany({
      where: { blockerId, blockeeId }
    });
    
    return success(res, { message: 'User unblocked' });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};
