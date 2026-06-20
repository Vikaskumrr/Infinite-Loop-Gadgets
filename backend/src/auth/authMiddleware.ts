import type { RequestHandler } from 'express';
import { verifyAccessToken } from './token.js';
import { sendError } from '../utils/apiResponse.js';

declare module 'express-serve-static-core' {
  interface Request {
    auth?: {
      userId: string;
      role?: 'CUSTOMER' | 'ADMIN';
    };
  }
}

export const requireAuth: RequestHandler = (request, response, next) => {
  const authorization = request.header('Authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : undefined;

  if (!token) {
    sendError(response, 'Authentication required', 'AUTH_REQUIRED', 401);
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    request.auth = { userId: payload.userId };
    next();
  } catch {
    sendError(response, 'Invalid or expired token', 'INVALID_TOKEN', 401);
  }
};
