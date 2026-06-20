import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { includeProductRelations } from '../repositories/productRepository.js';

const includeCartRelations = {
  items: {
    include: {
      product: {
        include: includeProductRelations,
      },
    },
  },
} satisfies Prisma.CartInclude;

export type CartWithItems = Prisma.CartGetPayload<{
  include: typeof includeCartRelations;
}>;

export const cartRepository = {
  getOrCreateCart: (userId: string): Promise<CartWithItems> =>
    prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: includeCartRelations,
    }),

  findCart: (userId: string): Promise<CartWithItems | null> =>
    prisma.cart.findUnique({
      where: { userId },
      include: includeCartRelations,
    }),

  findProductById: (productId: string) =>
    prisma.product.findUnique({
      where: { id: productId },
      include: includeProductRelations,
    }),

  upsertCartItem: (cartId: string, productId: string, quantity: number) =>
    prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      update: { quantity },
      create: {
        cartId,
        productId,
        quantity,
      },
    }),

  deleteCartItem: (cartId: string, productId: string) =>
    prisma.cartItem.deleteMany({
      where: { cartId, productId },
    }),

  clearCart: (cartId: string) =>
    prisma.cartItem.deleteMany({
      where: { cartId },
    }),
};
