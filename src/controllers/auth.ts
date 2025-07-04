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

    await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: hash,
        role: 'USER',
        isVerified: false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User register successfully',
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

    if (!user.isVerified) {
      throw new ApiError('Email not verified', 403);
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      message: 'User login successfully',
      data: { token },
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
    data: { user },
  });
};
