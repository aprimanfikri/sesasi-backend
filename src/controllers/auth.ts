import { NextFunction, Request, Response } from 'express';
import {
  accountFormSchema,
  loginSchema,
  passwordFormSchema,
  registerSchema,
} from '../validations/auth';
import prisma from '../libs/prisma';
import ApiError from '../utils/error';
import { hashSync, compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env';

export const registerUser = async (
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
        status: 'INACTIVE',
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

export const loginUser = async (
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

    if (!user.status) {
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

export const checkUser = async (req: Request, res: Response) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: 'Authenticated successfully',
    data: {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        status: user?.status,
      },
    },
  });
};

export const updateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  try {
    const { name, email } = accountFormSchema.parse(req.body);

    const exist = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (exist && exist.id !== user?.id) {
      throw new ApiError('Email already in use', 409);
    }

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name,
        email: email.toLowerCase(),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Account updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  try {
    const { password, newPassword, newConfirmPassword } =
      passwordFormSchema.parse(req.body);

    if (newPassword !== newConfirmPassword) {
      throw new ApiError(
        'New password and confirm password must be the same',
        400
      );
    }

    const match = compareSync(password, user?.password!);

    if (!match) {
      throw new ApiError('Invalid Password', 400);
    }

    const isSamePassword = compareSync(newPassword, user?.password!);

    if (isSamePassword) {
      throw new ApiError(
        'New password must be different from current password',
        400
      );
    }

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        password: hashSync(newPassword),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
