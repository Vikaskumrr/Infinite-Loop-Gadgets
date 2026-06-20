import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';
import { authRepository } from './authRepository.js';
import type { LoginInput, RegisterInput } from './authValidators.js';
import { generateAccessToken } from './token.js';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errorCode: string,
  ) {
    super(message);
  }
}

export const authService = {
  register: async (input: RegisterInput): Promise<{ user: PublicUser; token: string }> => {
    const existingUser = await authRepository.findUserByEmail(input.email);
    if (existingUser) {
      throw new AuthError('Email is already registered', 409, 'EMAIL_ALREADY_REGISTERED');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await authRepository.createUser({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    return {
      user: toPublicUser(user),
      token: generateAccessToken({ userId: user.id }),
    };
  },

  login: async (input: LoginInput): Promise<{ user: PublicUser; token: string }> => {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user?.passwordHash) {
      throw new AuthError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new AuthError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    return {
      user: toPublicUser(user),
      token: generateAccessToken({ userId: user.id }),
    };
  },

  getCurrentUser: async (userId: string): Promise<PublicUser> => {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AuthError('User not found', 404, 'USER_NOT_FOUND');
    }

    return toPublicUser(user);
  },
};
