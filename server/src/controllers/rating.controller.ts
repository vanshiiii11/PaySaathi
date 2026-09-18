import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { success, error, paginated } from '../utils/response';
import { ExchangeStatus } from '@prisma/client';

export const createRating = async (req: Request, res: Response) => {
  try {
    const { exchangeId, stars, tags, comment } = req.body;
    const raterId = req.user!.id;
    
    const exchange = await prisma.exchange.findUnique({ where: { id: exchangeId } });
    if (!exchange) return error(res, 'Exchange not found', 404);
    
    if (exchange.status !== ExchangeStatus.COMPLETED) {
      return error(res, 'Exchange is not completed', 400);
    }
    
    if (exchange.requesterId !== raterId && exchange.partnerId !== raterId) {
      return error(res, 'Unauthorized', 403);
    }
    
    const rateeId = exchange.requesterId === raterId ? exchange.partnerId : exchange.requesterId;
    
    const existing = await prisma.rating.findUnique({
      where: { exchangeId_raterId: { exchangeId, raterId } }
    });
    
    if (existing) return error(res, 'You have already rated this exchange', 400);
    
    const rating = await prisma.rating.create({
      data: {
        exchangeId,
        raterId,
        rateeId,
        stars,
        tags: tags || [],
        comment
      }
    });
    
    const userRatings = await prisma.rating.aggregate({
      where: { rateeId },
      _avg: { stars: true },
      _count: { id: true }
    });
    
    await prisma.user.update({
      where: { id: rateeId },
      data: {
        rating: userRatings._avg.stars || 0,
        ratingCount: userRatings._count.id
      }
    });
    
    return success(res, { rating }, 201);
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};

export const getUserRatings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const [total, ratings] = await Promise.all([
      prisma.rating.count({ where: { rateeId: id } }),
      prisma.rating.findMany({
        where: { rateeId: id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { rater: { select: { id: true, name: true, avatarUrl: true } } }
      })
    ]);
    
    return paginated(res, ratings, total, page, limit);
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};
