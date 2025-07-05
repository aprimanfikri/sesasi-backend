import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/error';

const checkRole =
  (roles: UserRole[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError('Unauthorized', 401);
      }

      if (!roles.includes(req.user.role)) {
        throw new ApiError('You don not have permission to access', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export const isUser = checkRole([UserRole.USER]);

export const isAdmin = checkRole([UserRole.ADMIN]);

export const isVerificator = checkRole([UserRole.VERIFICATOR]);

export const isAdminOrVerificator = checkRole([
  UserRole.ADMIN,
  UserRole.VERIFICATOR,
]);
