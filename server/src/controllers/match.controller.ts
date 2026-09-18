import { Request, Response } from 'express';
import { getNearbyUsers } from '../services/matching.service';
import { success, error } from '../utils/response';
import { prisma } from '../lib/prisma';

export const getNearby = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radiusKm, direction } = req.query;
    
    let queryLat = parseFloat(lat as string);
    let queryLng = parseFloat(lng as string);
    let queryRadius = parseFloat(radiusKm as string);
    
    if (isNaN(queryLat) || isNaN(queryLng)) {
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (user?.locationLat && user?.locationLng) {
        queryLat = user.locationLat;
        queryLng = user.locationLng;
        if (isNaN(queryRadius)) {
          queryRadius = user.radiusKm;
        }
      } else {
        return error(res, 'Location parameters are required', 400);
      }
    }
    
    if (isNaN(queryRadius)) queryRadius = 3;
    
    const users = await getNearbyUsers(queryLat, queryLng, queryRadius, req.user!.id, direction as string);
    
    return success(res, { users });
  } catch (err: any) {
    return error(res, err.message, 500);
  }
};
