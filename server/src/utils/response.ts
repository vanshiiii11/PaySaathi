import { Response } from 'express';

export const success = (res: Response, data: any, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const error = (res: Response, message: string, statusCode: number = 400, details?: any) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      details,
    },
  });
};

export const paginated = (res: Response, data: any[], total: number, page: number, limit: number) => {
  return res.status(200).json({
    success: true,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};
