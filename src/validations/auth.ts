import * as zod from 'zod';

export const registerSchema = zod.object({
  name: zod
    .string({
      required_error: 'Name must be not empty',
    })
    .min(3, {
      message: 'Name must be at least 3 characters long',
    })
    .max(50, {
      message: 'Name must not be more than 50 characters long',
    }),
  email: zod
    .string({
      required_error: 'Email must not be empty',
    })
    .email('Invalid email format'),
  password: zod
    .string({
      required_error: 'Password must not be empty',
    })
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .max(30, {
      message: 'Password must not be more than 30 characters long',
    })
    .regex(/^[A-Za-z0-9@#!$%^&*]*$/, {
      message:
        'Password can only contain letters, numbers, and special characters (@#!$%^&*)',
    })
    .regex(/^\S*$/, {
      message: 'Password must not contain spaces',
    }),
});

export const loginSchema = zod.object({
  email: zod
    .string({
      required_error: 'Email must not be empty',
    })
    .email('Invalid email format'),
  password: zod
    .string({
      required_error: 'Password must not be empty',
    })
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .max(30, {
      message: 'Password must not be more than 30 characters long',
    })
    .regex(/^[A-Za-z0-9@#!$%^&*]*$/, {
      message:
        'Password can only contain letters, numbers, and special characters (@#!$%^&*)',
    })
    .regex(/^\S*$/, {
      message: 'Password must not contain spaces',
    }),
});
