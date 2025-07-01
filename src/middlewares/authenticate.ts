import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/error';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env';
import prisma from '../libs/prisma';
import { User } from '@prisma/client';

declare module 'express' {
  interface Request {
    user?: Omit<User, 'password'>;
  }
}

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return next(new ApiError('Authorization token is required', 401));
    }

    if (!token.startsWith('Bearer ')) {
      return next(new ApiError('Invalid token format', 401));
    }

    const tokenValue = token.split('Bearer ')[1];
    const payload = jwt.verify(tokenValue, JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return next(new ApiError('Invalid user', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
