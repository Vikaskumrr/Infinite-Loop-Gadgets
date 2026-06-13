import { prisma } from '../config/prisma.js';

export const authRepository = {
  findUserByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
    }),

  findUserById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
    }),

  createUser: (input: { name: string; email: string; passwordHash: string }) =>
    prisma.user.create({
      data: input,
    }),
};
