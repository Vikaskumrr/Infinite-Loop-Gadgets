import type { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { includeProductRelations } from '../repositories/productRepository.js';

const cartInclude = {
  items: {
    include: {
      product: {
        include: includeProductRelations,
      },
    },
  },
} satisfies Prisma.CartInclude;

const orderInclude = {
  items: {
    include: {
      product: {
        include: includeProductRelations,
      },
    },
  },
} satisfies Prisma.OrderInclude;

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export type CartForCheckout = Prisma.CartGetPayload<{ include: typeof cartInclude }>;
export type OrderWithItems = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

const db = (tx?: TransactionClient) => tx || prisma;

export const orderRepository = {
  getCartForCheckout: (userId: string, tx?: TransactionClient): Promise<CartForCheckout | null> =>
    db(tx).cart.findUnique({
      where: { userId },
      include: cartInclude,
    }),

  createOrder: (
    data: Prisma.OrderCreateInput,
    tx: TransactionClient,
  ): Promise<OrderWithItems> =>
    tx.order.create({
      data,
      include: orderInclude,
    }),

  updateInventory: (
    inventoryId: string,
    stockQuantity: number,
    availabilityStatus: 'IN_STOCK' | 'OUT_OF_STOCK',
    tx: TransactionClient,
  ) =>
    tx.inventory.update({
      where: { id: inventoryId },
      data: {
        stockQuantity,
        availabilityStatus,
      },
    }),

  clearCart: (cartId: string, tx: TransactionClient) =>
    tx.cartItem.deleteMany({
      where: { cartId },
    }),

  getOrdersByUser: (userId: string): Promise<OrderWithItems[]> =>
    prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    }),

  getOrderById: (id: string): Promise<OrderWithItems | null> =>
    prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    }),
};
