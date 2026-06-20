import { env } from '../config/env.js';
import { toProductDto } from '../services/productService.js';
import { cartRepository, type CartWithItems } from './cartRepository.js';

export class CartError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, errorCode: string, statusCode: number) {
    super(message);
    this.name = 'CartError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

const availabilityError = (message: string, errorCode: string) => new CartError(message, errorCode, 409);

const validateInventory = (
  availabilityStatus: string | undefined,
  stockQuantity: number | undefined,
  requestedQuantity: number,
) => {
  if (availabilityStatus === 'OUT_OF_STOCK' || stockQuantity === 0) {
    throw availabilityError('This product is out of stock', 'OUT_OF_STOCK');
  }

  if (availabilityStatus === 'DISCONTINUED') {
    throw availabilityError('This product is unavailable', 'PRODUCT_UNAVAILABLE');
  }

  if (availabilityStatus === 'PREORDER') {
    throw availabilityError('This product is currently unavailable for cart purchase', 'PRODUCT_UNAVAILABLE');
  }

  if (typeof stockQuantity === 'number' && requestedQuantity > stockQuantity) {
    throw availabilityError(`Only ${stockQuantity} item${stockQuantity === 1 ? '' : 's'} left in stock`, 'INSUFFICIENT_STOCK');
  }

  if (requestedQuantity > env.CART_MAX_QUANTITY_PER_ITEM) {
    throw availabilityError(
      `Cart quantity cannot exceed ${env.CART_MAX_QUANTITY_PER_ITEM} per item`,
      'CART_QUANTITY_LIMIT',
    );
  }
};

const toCartDto = (cart: CartWithItems) => {
  const items = cart.items.map((item) => {
    const product = toProductDto(item.product);
    const unitPrice = Number(item.product.price);
    const quantity = item.quantity;
    const subtotal = unitPrice * quantity;

    return {
      productId: item.productId,
      quantity,
      unitPrice,
      subtotal,
      availabilityStatus: product.availabilityStatus || 'available',
      stockQuantity: item.product.inventory?.stockQuantity ?? 0,
      product,
    };
  });

  return {
    items,
    subtotal: items.reduce((total, item) => total + item.subtotal, 0),
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
  };
};

export const cartService = {
  getCart: async (userId: string) => {
    const cart = await cartRepository.getOrCreateCart(userId);
    return toCartDto(cart);
  },

  addItem: async (userId: string, productId: string, quantity: number) => {
    const cart = await cartRepository.getOrCreateCart(userId);
    const product = await cartRepository.findProductById(productId);

    if (!product) {
      throw new CartError('Product not found', 'PRODUCT_NOT_FOUND', 404);
    }

    const existingItem = cart.items.find((item) => item.productId === productId);
    const nextQuantity = (existingItem?.quantity || 0) + quantity;
    validateInventory(product.inventory?.availabilityStatus, product.inventory?.stockQuantity, nextQuantity);

    await cartRepository.upsertCartItem(cart.id, productId, nextQuantity);
    return cartService.getCart(userId);
  },

  updateItemQuantity: async (userId: string, productId: string, quantity: number) => {
    const cart = await cartRepository.getOrCreateCart(userId);

    if (quantity === 0) {
      await cartRepository.deleteCartItem(cart.id, productId);
      return cartService.getCart(userId);
    }

    const product = await cartRepository.findProductById(productId);
    if (!product) {
      throw new CartError('Product not found', 'PRODUCT_NOT_FOUND', 404);
    }

    validateInventory(product.inventory?.availabilityStatus, product.inventory?.stockQuantity, quantity);
    await cartRepository.upsertCartItem(cart.id, productId, quantity);
    return cartService.getCart(userId);
  },

  removeItem: async (userId: string, productId: string) => {
    const cart = await cartRepository.getOrCreateCart(userId);
    await cartRepository.deleteCartItem(cart.id, productId);
    return cartService.getCart(userId);
  },

  clearCart: async (userId: string) => {
    const cart = await cartRepository.getOrCreateCart(userId);
    await cartRepository.clearCart(cart.id);
    return cartService.getCart(userId);
  },
};
