import type { Response } from 'express';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types/api.js';

export const sendSuccess = <TData>(
  response: Response,
  data: TData,
  message: string,
  statusCode = 200,
): Response<ApiSuccessResponse<TData>> =>
  response.status(statusCode).json({
    success: true,
    data,
    message,
  });

export const sendError = (
  response: Response,
  message: string,
  errorCode = 'INTERNAL_SERVER_ERROR',
  statusCode = 500,
): Response<ApiErrorResponse> =>
  response.status(statusCode).json({
    success: false,
    message,
    errorCode,
  });
