import { PermissionStatus } from '@prisma/client';
import * as zod from 'zod';

export const createPermissionSchema = zod.object({
  title: zod
    .string({
      required_error: 'Title must be not empty',
    })
    .min(3, {
      message: 'Title must be at least 3 characters long',
    })
    .max(50, {
      message: 'Title must not be more than 50 characters long',
    }),
  description: zod
    .string({
      required_error: 'Description must be not empty',
    })
    .min(3, {
      message: 'Description must be at least 3 characters long',
    })
    .max(500, {
      message: 'Description must not be more than 500 characters long',
    }),
  startDate: zod.preprocess(
    (arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    },
    zod.date({
      required_error: 'Start date must be not empty',
    })
  ),
  endDate: zod
    .preprocess(
      (arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
      },
      zod.date({
        required_error: 'End date must be not empty',
      })
    )
    .refine((date) => date >= new Date(), {
      message: 'End date must be at least today',
    }),
});

export const updatePermissionSchema = zod.object({
  title: zod
    .string({
      required_error: 'Title must be not empty',
    })
    .min(3, {
      message: 'Title must be at least 3 characters long',
    })
    .max(50, {
      message: 'Title must not be more than 50 characters long',
    })
    .optional(),
  description: zod
    .string({
      required_error: 'Description must be not empty',
    })
    .min(3, {
      message: 'Description must be at least 3 characters long',
    })
    .max(500, {
      message: 'Description must not be more than 500 characters long',
    })
    .optional(),
  startDate: zod
    .preprocess(
      (arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
      },
      zod.date({
        required_error: 'Start date must be not empty',
      })
    )
    .optional(),
  endDate: zod
    .preprocess(
      (arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
      },
      zod.date({
        required_error: 'End date must be not empty',
      })
    )
    .refine((date) => date >= new Date(), {
      message: 'End date must be at least today',
    })
    .optional(),
});

export const updatePermissionStatusSchema = zod.object({
  status: zod.nativeEnum(PermissionStatus, {
    required_error: 'Status must be not empty',
  }),
  verificatorComment: zod
    .string({
      required_error: 'Verificator comment must be not empty',
    })
    .min(3, {
      message: 'Verificator comment must be at least 3 characters long',
    })
    .optional(),
});
