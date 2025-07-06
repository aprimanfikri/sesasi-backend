import { NextFunction, Request, Response } from 'express';
import prisma from '../libs/prisma';
import ApiError from '../utils/error';
import { hashSync } from 'bcryptjs';
import { createUserSchema, updateUserSchema } from '../validations/user';

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: { users },
  });
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role, status } = createUserSchema.parse(
      req.body
    );

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
        role,
        status,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const { name, email, password, role, status } = updateUserSchema.parse(
      req.body
    );

    if (email && email !== user.email) {
      const existingEmail = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (existingEmail && existingEmail.id !== id) {
        throw new ApiError('Email already in use', 409);
      }
    }

    let updatedPassword: string | undefined;

    if (password) {
      updatedPassword = hashSync(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? undefined,
        email: email ? email.toLowerCase() : undefined,
        password: updatedPassword,
        role: role ?? undefined,
        status: status ?? undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
