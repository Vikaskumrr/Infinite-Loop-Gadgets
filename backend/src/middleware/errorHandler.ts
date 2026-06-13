import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

interface HttpError extends Error {
  statusCode?: number;
  errorCode?: string;
}

export const errorHandler: ErrorRequestHandler = (error: HttpError, _request, response, _next) => {
  if (error instanceof ZodError) {
    sendError(response, 'Request validation failed', 'VALIDATION_ERROR', 400);
    return;
  }

  const statusCode = error.statusCode ?? 500;
  const message =
    env.NODE_ENV === 'production' && statusCode >= 500
      ? 'An unexpected error occurred.'
      : error.message || 'An unexpected error occurred.';

  if (env.NODE_ENV !== 'test') {
    console.error({
      message: error.message,
      stack: env.NODE_ENV === 'production' ? undefined : error.stack,
      statusCode,
    });
  }

  sendError(response, message, error.errorCode ?? 'INTERNAL_SERVER_ERROR', statusCode);
};
