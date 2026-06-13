import type { RequestHandler, Response } from 'express';
import { authService, AuthError } from './authService.js';
import { loginSchema, registerSchema } from './authValidators.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const handleAuthError = (error: unknown, response: Response): boolean => {
  if (error instanceof AuthError) {
    sendError(response, error.message, error.errorCode, error.statusCode);
    return true;
  }
  return false;
};

export const authController = {
  register: asyncHandler(async (request, response) => {
    try {
      const input = registerSchema.parse(request.body);
      const data = await authService.register(input);
      sendSuccess(response, data, 'Registration successful', 201);
    } catch (error) {
      if (!handleAuthError(error, response)) throw error;
    }
  }) as RequestHandler,

  login: asyncHandler(async (request, response) => {
    try {
      const input = loginSchema.parse(request.body);
      const data = await authService.login(input);
      sendSuccess(response, data, 'Login successful');
    } catch (error) {
      if (!handleAuthError(error, response)) throw error;
    }
  }) as RequestHandler,

  me: asyncHandler(async (request, response) => {
    if (!request.auth?.userId) {
      sendError(response, 'Authentication required', 'AUTH_REQUIRED', 401);
      return;
    }

    try {
      const user = await authService.getCurrentUser(request.auth.userId);
      sendSuccess(response, { user }, 'Current user fetched successfully');
    } catch (error) {
      if (!handleAuthError(error, response)) throw error;
    }
  }) as RequestHandler,

  logout: ((_request, response) => {
    sendSuccess(response, {}, 'Logout successful');
  }) as RequestHandler,
};
