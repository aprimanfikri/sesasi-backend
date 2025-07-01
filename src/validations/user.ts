import { UserRole } from '@prisma/client';
import * as zod from 'zod';

export const createUserSchema = zod.object({
  name: zod
    .string({
      required_error: 'Name must be not empty',
      invalid_type_error: 'Name must be string',
    })
    .min(3, {
      message: 'Name must be at least 3 characters',
    })
    .max(50, {
      message: 'Name must not be more than 50 characters',
    }),
  email: zod
    .string({
      required_error: 'Email must be not empty',
    })
    .email({
      message: 'Email must be valid',
    }),
  password: zod
    .string({
      required_error: 'Password must be not empty',
    })
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .max(30, {
      message: 'Password must not be more than 30 characters',
    }),
  role: zod.nativeEnum(UserRole, {
    required_error: 'Role must be not empty',
  }),
});

export const updateUserSchema = zod.object({
  name: zod
    .string({
      invalid_type_error: 'Name must be string',
    })
    .min(3, {
      message: 'Name must be at least 3 characters',
    })
    .max(50, {
      message: 'Name must not be more than 50 characters',
    })
    .optional(),
  email: zod
    .string({
      invalid_type_error: 'Email must be string',
    })
    .email({
      message: 'Email must be valid',
    })
    .optional(),
  password: zod
    .string({
      invalid_type_error: 'Password must be string',
    })
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .max(30, {
      message: 'Password must not be more than 30 characters',
    })
    .optional(),
  role: zod.nativeEnum(UserRole).optional(),
});
