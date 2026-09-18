import { Request, Response } from 'express';
import { createExchange, getExchangeHistory, updateExchangeStatus } from '../services/exchange.service';
import { prisma } from '../lib/prisma';
import { success, error, paginated } from '../utils/response';
import { ExchangeStatus } from '@prisma/client';
import { sendPushToUser } from '../services/push.service';

export const create = async (req: Request, res: Response) => {
  try {
    const { partnerId, direction, amount, note, meetingPoint } = req.body;
    const requesterId = req.user!.id;
    
    if (requesterId === partnerId) {
      return error(res, 'Cannot create exchange with yourself', 400);
    }
    
    const users = await prisma.user.findMany({
      where: { id: { in: [requesterId, partnerId] } }
    });
    
    if (users.length !== 2) {
      return error(res, 'User not found', 404);
    }
    
    const suspended = users.find(u => u.isSuspended);
    if (suspended) {
      return error(res, 'Action not allowed', 403);
    }
    
    const existing = await prisma.exchange.findFirst({
      where: {
        status: ExchangeStatus.PENDING,
        OR: [
          { requesterId, partnerId },
          { requesterId: partnerId, partnerId: requesterId }
        ]
      }
    });
    
    if (existing) {
      return error(res, 'An active pending exchange already exists with this user', 400);
    }
    
    const exchange = await createExchange(requesterId, partnerId, direction, amount, note, meetingPoint);
    
    await sendPushToUser(partnerId, 'New Exchange Request', `You have a new exchange request for ${amount}`);
    
    return success(res, { exchange }, 201);
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;
    
    const exchange = await prisma.exchange.findUnique({ where: { id } });
    if (!exchange) return error(res, 'Exchange not found', 404);
    
    if (exchange.requesterId !== userId && exchange.partnerId !== userId) {
      return error(res, 'Unauthorized', 403);
    }
    
    const allowedTransitions: Record<ExchangeStatus, ExchangeStatus[]> = {
      PENDING: [ExchangeStatus.ACCEPTED, ExchangeStatus.DECLINED, ExchangeStatus.CANCELLED],
      ACCEPTED: [ExchangeStatus.COMPLETED, ExchangeStatus.CANCELLED],
      DECLINED: [],
      EXPIRED: [],
      COMPLETED: [],
      CANCELLED: []
    };
    
    if (!allowedTransitions[exchange.status].includes(status)) {
      return error(res, `Cannot transition from ${exchange.status} to ${status}`, 400);
    }
    
    const updated = await updateExchangeStatus(id, status, userId);
    
    const otherUserId = exchange.requesterId === userId ? exchange.partnerId : exchange.requesterId;
    await sendPushToUser(otherUserId, 'Exchange Status Updated', `Exchange status is now ${status}`);
    
    return success(res, { exchange: updated });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const { total, exchanges } = await getExchangeHistory(req.user!.id, page, limit);
    
    return paginated(res, exchanges, total, page, limit);
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const get = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exchange = await prisma.exchange.findUnique({
      where: { id },
      include: {
        requester: { select: { id: true, name: true, avatarUrl: true } },
        partner: { select: { id: true, name: true, avatarUrl: true } }
      }
    });
    
    if (!exchange) return error(res, 'Exchange not found', 404);
    
    if (exchange.requesterId !== req.user!.id && exchange.partnerId !== req.user!.id) {
      return error(res, 'Unauthorized', 403);
    }
    
    return success(res, { exchange });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};
