import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from 'jsonwebtoken';
import { ZodError } from 'zod';
import ApiError from '../utils/error';
import { NODE_ENV } from '../utils/env';
import { isPrismaErrorCode, prismaErrorMessage } from '../utils/prisma';

const formatZodError = (err: ZodError): string => {
  const firstIssue = err.issues[0];
  return firstIssue.message;
};

const handleJWTError = (err: JsonWebTokenError): string => {
  if (err instanceof TokenExpiredError)
    return 'Token expired. Please login again';
  if (err instanceof NotBeforeError) return 'Token not yet valid';

  switch (err.message) {
    case 'jwt malformed':
      return 'Invalid token format';
    case 'invalid signature':
      return 'Token signature verification failed';
    case 'jwt must be provided':
      return 'No token provided';
    case 'invalid token':
      return 'Invalid authentication token';
    case 'jwt expired':
      return 'Session expired. Please login again';
    default:
      return 'Authentication failed';
  }
};

const handlePrismaKnownError = (
  err: Prisma.PrismaClientKnownRequestError
): string => {
  let msg: string;
  if (isPrismaErrorCode(err.code)) {
    msg = prismaErrorMessage(err.code);
  } else {
    msg = 'Database error';
  }
  return msg;
};

const getPrismaErrorStatusCode = (errorCode: string): number => {
  const statusCodeMap: Record<string, number> = {
    P2002: 409,
    P2025: 404,
    P2003: 400,
  };
  return statusCodeMap[errorCode] || 500;
};

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode: number = 500;
  let message: string = 'Internal Server Error';
  let success: boolean = false;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    success = err.success ?? false;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = formatZodError(err);
  } else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = handleJWTError(err);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    message = handlePrismaKnownError(err);
    statusCode = getPrismaErrorStatusCode(err.code);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid database query format';
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (NODE_ENV === 'development') {
    console.error('[Error]', {
      path: req.path,
      method: req.method,
      error: err instanceof Error ? err.stack : err,
    });
  }

  res.status(statusCode).json({ success, message });
};

export default errorHandler;
