import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export interface NearbyUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  rating: number;
  ratingCount: number;
  exchangeCount: number;
  intent: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  isVerified: boolean;
  distance_km: number;
  fuzzed_lat: number;
  fuzzed_lng: number;
}

export const getNearbyUsers = async (
  lat: number,
  lng: number,
  radiusKm: number,
  userId: string,
  direction?: string
): Promise<NearbyUser[]> => {
  let query = Prisma.sql`
    SELECT u.id, u.name, u."avatarUrl", u.rating, u."ratingCount", u."exchangeCount",
           u.intent, u."minAmount", u."maxAmount", u."isVerified",
           (6371 * acos(cos(radians(${lat})) * cos(radians(u."locationLat")) * 
            cos(radians(u."locationLng") - radians(${lng})) + 
            sin(radians(${lat})) * sin(radians(u."locationLat")))) AS distance_km,
           u."locationLat" + (random() - 0.5) * 0.002 AS fuzzed_lat,
           u."locationLng" + (random() - 0.5) * 0.002 AS fuzzed_lng
    FROM "User" u
    WHERE u."isActive" = true
      AND u."isSuspended" = false
      AND u.id != ${userId}
      AND u."locationLat" IS NOT NULL
      AND u."locationLng" IS NOT NULL
      AND (6371 * acos(cos(radians(${lat})) * cos(radians(u."locationLat")) * 
           cos(radians(u."locationLng") - radians(${lng})) + 
           sin(radians(${lat})) * sin(radians(u."locationLat")))) <= ${radiusKm}
  `;

  if (direction) {
    // If direction is provided, we might want to filter by intent
    // But since the query uses Prisma.sql, we need to handle it carefully.
    const intentSql = Prisma.sql` AND u.intent = ${direction}::"ExchangeDirection" `;
    query = Prisma.sql`${query} ${intentSql}`;
  }

  const orderAndLimit = Prisma.sql`
    ORDER BY distance_km ASC
    LIMIT 50
  `;
  
  query = Prisma.sql`${query} ${orderAndLimit}`;

  const results = await prisma.$queryRaw<NearbyUser[]>(query);
  return results;
};
