import { OrderStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { toProductDto } from '../services/productService.js';
import { orderRepository, type OrderWithItems } from './orderRepository.js';

export class OrderError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, errorCode: string, statusCode: number) {
    super(message);
    this.name = 'OrderError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

const orderStatusMap = {
  PAYMENT_PENDING: 'payment_pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

const toOrderDto = (order: OrderWithItems) => ({
  id: order.id,
  status: orderStatusMap[order.status as keyof typeof orderStatusMap] ?? 'payment_pending',
  totalAmount: Number(order.totalAmount),
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    price: Number(item.price),
    product: toProductDto(item.product),
  })),
});

const ensureCheckoutReady = async (userId: string) => {
  const cart = await orderRepository.getCartForCheckout(userId);

  if (!cart || cart.items.length === 0) {
    throw new OrderError('Your cart is empty', 'EMPTY_CART', 400);
  }

  for (const item of cart.items) {
    const inventory = item.product.inventory;
    if (!inventory) {
      throw new OrderError(`Inventory is unavailable for ${item.product.title}`, 'PRODUCT_UNAVAILABLE', 409);
    }

    if (inventory.availabilityStatus === 'OUT_OF_STOCK' || inventory.stockQuantity <= 0) {
      throw new OrderError(`${item.product.title} is out of stock`, 'OUT_OF_STOCK', 409);
    }

    if (inventory.availabilityStatus === 'DISCONTINUED' || inventory.availabilityStatus === 'PREORDER') {
      throw new OrderError(`${item.product.title} is unavailable`, 'PRODUCT_UNAVAILABLE', 409);
    }

    if (item.quantity > inventory.stockQuantity) {
      throw new OrderError(`Only ${inventory.stockQuantity} left for ${item.product.title}`, 'INSUFFICIENT_STOCK', 409);
    }
  }

  return cart;
};

export const orderService = {
  checkout: async (userId: string) => {
    const cart = await ensureCheckoutReady(userId);

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await orderRepository.createOrder({
        user: { connect: { id: userId } },
        status: OrderStatus.CONFIRMED,
        totalAmount: cart.items.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0),
        items: {
          create: cart.items.map((item) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      }, tx);

      for (const item of cart.items) {
        const nextStock = (item.product.inventory?.stockQuantity || 0) - item.quantity;
        await orderRepository.updateInventory(
          item.product.inventory!.id,
          nextStock,
          nextStock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
          tx,
        );
      }

      await orderRepository.clearCart(cart.id, tx);
      return createdOrder;
    });

    return toOrderDto(order);
  },

  getOrders: async (userId: string) => {
    const orders = await orderRepository.getOrdersByUser(userId);
    return orders.map(toOrderDto);
  },

  getOrderById: async (userId: string, id: string) => {
    const order = await orderRepository.getOrderById(id);
    if (!order || order.userId !== userId) {
      return null;
    }

    return toOrderDto(order);
  },
};
