import type { RequestHandler, Response } from 'express';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cartItemBodySchema, cartItemParamSchema, cartItemUpdateBodySchema } from './validators.js';
import { CartError, cartService } from './cartService.js';

const requireUserId = (request: Parameters<RequestHandler>[0], response: Response): string | null => {
  if (!request.auth?.userId) {
    sendError(response, 'Authentication required', 'AUTH_REQUIRED', 401);
    return null;
  }

  return request.auth.userId;
};

const handleCartError = (error: unknown, response: Response): boolean => {
  if (error instanceof CartError) {
    sendError(response, error.message, error.errorCode, error.statusCode);
    return true;
  }
  return false;
};

export const cartController = {
  getCart: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    const cart = await cartService.getCart(userId);
    sendSuccess(response, cart, 'Cart fetched successfully');
  }) as RequestHandler,

  addItem: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    try {
      const body = cartItemBodySchema.parse(request.body);
      const cart = await cartService.addItem(userId, body.productId, body.quantity);
      sendSuccess(response, cart, 'Cart updated successfully');
    } catch (error) {
      if (!handleCartError(error, response)) throw error;
    }
  }) as RequestHandler,

  updateItemQuantity: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    try {
      const { productId } = cartItemParamSchema.parse(request.params);
      const { quantity } = cartItemUpdateBodySchema.parse(request.body);
      const cart = await cartService.updateItemQuantity(userId, productId, quantity);
      sendSuccess(response, cart, 'Cart updated successfully');
    } catch (error) {
      if (!handleCartError(error, response)) throw error;
    }
  }) as RequestHandler,

  removeItem: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    const { productId } = cartItemParamSchema.parse(request.params);
    const cart = await cartService.removeItem(userId, productId);
    sendSuccess(response, cart, 'Cart updated successfully');
  }) as RequestHandler,

  clearCart: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    const cart = await cartService.clearCart(userId);
    sendSuccess(response, cart, 'Cart cleared successfully');
  }) as RequestHandler,
};
