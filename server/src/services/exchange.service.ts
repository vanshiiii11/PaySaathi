import { prisma } from '../lib/prisma';
import { ExchangeDirection, ExchangeStatus, Prisma } from '@prisma/client';
import { sendPushToUser } from './push.service';

export const createExchange = async (
  requesterId: string,
  partnerId: string,
  direction: ExchangeDirection,
  amount: number,
  note?: string,
  meetingPoint?: string
) => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5-minute expiry per spec

  const exchange = await prisma.exchange.create({
    data: {
      requesterId,
      partnerId,
      direction,
      amount,
      note,
      meetingPoint,
      expiresAt,
    }
  });

  return exchange;
};

export const updateExchangeStatus = async (exchangeId: string, status: ExchangeStatus, actingUserId: string) => {
  const data: Prisma.ExchangeUpdateInput = { status };
  
  if (status === ExchangeStatus.COMPLETED) {
    data.completedAt = new Date();
  }

  const exchange = await prisma.exchange.update({
    where: { id: exchangeId },
    data
  });
  
  if (status === ExchangeStatus.COMPLETED) {
    await prisma.user.updateMany({
      where: { id: { in: [exchange.requesterId, exchange.partnerId] } },
      data: { exchangeCount: { increment: 1 } }
    });
  }

  return exchange;
};

export const getExchangeHistory = async (userId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const [total, exchanges] = await Promise.all([
    prisma.exchange.count({
      where: { OR: [{ requesterId: userId }, { partnerId: userId }] }
    }),
    prisma.exchange.findMany({
      where: { OR: [{ requesterId: userId }, { partnerId: userId }] },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        requester: { select: { id: true, name: true, avatarUrl: true } },
        partner: { select: { id: true, name: true, avatarUrl: true } }
      }
    })
  ]);
  
  return { total, exchanges };
};

export const checkAndExpireExchanges = async () => {
  const now = new Date();
  const expired = await prisma.exchange.updateMany({
    where: {
      status: ExchangeStatus.PENDING,
      expiresAt: { lt: now }
    },
    data: {
      status: ExchangeStatus.EXPIRED
    }
  });
  return expired.count;
};

export const autoSuspendCheck = async (userId: string) => {
  const threshold = parseInt(process.env.REPORT_AUTO_SUSPEND_THRESHOLD || '5', 10);
  
  const reportCount = await prisma.report.count({
    where: { reportedId: userId }
  });
  
  if (reportCount >= threshold) {
    await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: true, isActive: false }
    });
    console.log(`User ${userId} automatically suspended due to ${reportCount} reports.`);
  }
};
