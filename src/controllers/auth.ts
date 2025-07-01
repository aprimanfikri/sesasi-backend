import { NextFunction, Request, Response } from 'express';
import { loginSchema, registerSchema } from '../validations/auth';
import prisma from '../libs/prisma';
import ApiError from '../utils/error';
import { hashSync, compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const exist = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (exist) {
      throw new ApiError('Email already in use', 409);
    }

    const hash = hashSync(password);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: hash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User register successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email: email.toString(),
      },
    });

    if (!user) {
      throw new ApiError('Email not found', 404);
    }

    const match = compareSync(password, user.password);

    if (!match) {
      throw new ApiError('Invalid Password', 400);
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      message: 'User login successfully',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const check = async (req: Request, res: Response) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: 'Authenticated successfully',
    user,
  });
};
