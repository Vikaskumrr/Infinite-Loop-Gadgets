import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthTokenPayload {
  userId: string;
}

export const generateAccessToken = (payload: AuthTokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });

export const verifyAccessToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (!decoded || typeof decoded !== 'object' || typeof decoded.userId !== 'string') {
    throw new Error('Invalid token payload');
  }

  return { userId: decoded.userId };
};
