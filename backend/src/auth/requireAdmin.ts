import type { RequestHandler } from 'express';
import { authRepository } from './authRepository.js';
import { sendError } from '../utils/apiResponse.js';

export const requireAdmin: RequestHandler = async (request, response, next) => {
  const userId = request.auth?.userId;

  if (!userId) {
    sendError(response, 'Authentication required', 'AUTH_REQUIRED', 401);
    return;
  }

  const user = await authRepository.findUserById(userId);
  if (!user) {
    sendError(response, 'User not found', 'USER_NOT_FOUND', 404);
    return;
  }

  if (user.role !== 'ADMIN') {
    sendError(response, 'Admin access required', 'ADMIN_REQUIRED', 403);
    return;
  }

  request.auth = {
    userId,
    role: user.role,
  };

  next();
};
