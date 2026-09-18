import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { success, error, paginated } from '../utils/response';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { threadId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const thread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      include: { exchange: true }
    });
    
    if (!thread) return error(res, 'Thread not found', 404);
    
    if (thread.exchange.requesterId !== req.user!.id && thread.exchange.partnerId !== req.user!.id) {
      return error(res, 'Unauthorized', 403);
    }
    
    const skip = (page - 1) * limit;
    
    const [total, messages] = await Promise.all([
      prisma.message.count({ where: { threadId } }),
      prisma.message.findMany({
        where: { threadId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })
    ]);
    
    return paginated(res, messages.reverse(), total, page, limit);
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};
