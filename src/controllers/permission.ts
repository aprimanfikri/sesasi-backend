import { NextFunction, Request, Response } from 'express';
import prisma from '../libs/prisma';
import ApiError from '../utils/error';
import {
  createPermissionSchema,
  updatePermissionSchema,
  updatePermissionStatusSchema,
} from '../validations/permission';

export const getAllPermissions = async (_req: Request, res: Response) => {
  const permissions = await prisma.permission.findMany({
    include: {
      user: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Permissions fetched successfully',
    data: { permissions },
  });
};

export const getAllPermissionsByUser = async (req: Request, res: Response) => {
  const permissions = await prisma.permission.findMany({
    where: {
      userId: req.user?.id,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Permissions fetched successfully',
    data: { permissions },
  });
};

export const getPermissionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new ApiError('Permission not found', 404);
    }

    const isOwner = permission.userId === user?.id;
    const isAdminOrVerificator =
      user?.role === 'ADMIN' || user?.role === 'VERIFICATOR';

    if (!isOwner && !isAdminOrVerificator) {
      throw new ApiError(
        'You are not authorized to access this permission',
        403
      );
    }

    res.status(200).json({
      success: true,
      message: 'Permission fetched successfully',
      data: { permission },
    });
  } catch (error) {
    next(error);
  }
};

export const createPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  try {
    const { title, description, startDate, endDate } =
      createPermissionSchema.parse(req.body);

    const exist = await prisma.permission.findUnique({
      where: {
        title_userId_startDate_endDate: {
          title,
          userId: user?.id!,
          startDate,
          endDate,
        },
      },
    });

    if (exist) {
      throw new ApiError('Permission already exists', 409);
    }

    const permission = await prisma.permission.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        user: {
          connect: {
            id: user?.id!,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      data: { permission },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const exist = await prisma.permission.findUnique({ where: { id } });

    if (!exist) {
      throw new ApiError('Permission not found', 404);
    }

    const isOwner = exist.userId === user?.id;

    if (!isOwner) {
      throw new ApiError(
        'You are not authorized to update this permission',
        403
      );
    }

    if (exist.status !== 'PENDING' && exist.status !== 'REVISED') {
      throw new ApiError(
        'Permission cannot be updated because it is already processed',
        400
      );
    }

    const { title, description, startDate, endDate } =
      updatePermissionSchema.parse(req.body);

    const permission = await prisma.permission.update({
      where: { id },
      data: {
        title: title ?? undefined,
        description: description ?? undefined,
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Permission updated successfully',
      data: { permission },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const exist = await prisma.permission.findUnique({ where: { id } });
    if (!exist) {
      throw new ApiError('Permission not found', 404);
    }

    const isOwner = exist.userId === user?.id;

    if (!isOwner) {
      throw new ApiError(
        'You are not authorized to cancel this permission',
        403
      );
    }

    if (exist.status !== 'PENDING' && exist.status !== 'REVISED') {
      throw new ApiError(
        'Permission cannot be cancelled because it is already processed',
        400
      );
    }

    const cancelled = await prisma.permission.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    res.status(200).json({
      success: true,
      message: 'Permission cancelled successfully',
      data: { permission: cancelled },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const exist = await prisma.permission.findUnique({ where: { id } });
    if (!exist) {
      throw new ApiError('Permission not found', 404);
    }

    const isOwner = exist.userId === user?.id;
    const isAdminOrVerificator =
      user?.role === 'ADMIN' || user?.role === 'VERIFICATOR';

    if (!isAdminOrVerificator) {
      if (!isOwner) {
        throw new ApiError(
          'You are not authorized to delete this permission',
          403
        );
      }

      if (exist.status === 'APPROVED' || exist.status === 'REJECTED') {
        throw new ApiError('Permission already approved or rejected', 400);
      }
    }

    await prisma.permission.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Permission deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updatePermissionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const exist = await prisma.permission.findUnique({ where: { id } });

    if (!exist) {
      throw new ApiError('Permission not found', 404);
    }

    const { status, verificatorComment } = updatePermissionStatusSchema.parse(
      req.body
    );

    const updated = await prisma.permission.update({
      where: { id },
      data: {
        status,
        verificator: {
          connect: {
            id: user?.id!,
          },
        },
        verificatorComment: verificatorComment ?? undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Permission status updated successfully',
      data: {
        permission: updated,
      },
    });
  } catch (error) {
    next(error);
  }
};
