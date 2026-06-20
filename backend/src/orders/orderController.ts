import type { RequestHandler, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { checkoutSchema, orderIdParamSchema } from './validators.js';
import { orderService, OrderError } from './orderService.js';

const requireUserId = (request: Parameters<RequestHandler>[0], response: Response): string | null => {
  if (!request.auth?.userId) {
    sendError(response, 'Authentication required', 'AUTH_REQUIRED', 401);
    return null;
  }

  return request.auth.userId;
};

const handleOrderError = (error: unknown, response: Response): boolean => {
  if (error instanceof OrderError) {
    sendError(response, error.message, error.errorCode, error.statusCode);
    return true;
  }
  return false;
};

export const orderController = {
  checkout: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    try {
      checkoutSchema.parse(request.body);
      const order = await orderService.checkout(userId);
      sendSuccess(response, { order }, 'Order created successfully', 201);
    } catch (error) {
      if (!handleOrderError(error, response)) throw error;
    }
  }) as RequestHandler,

  getOrders: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    const orders = await orderService.getOrders(userId);
    sendSuccess(response, { orders }, 'Orders fetched successfully');
  }) as RequestHandler,

  getOrderById: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    const { id } = orderIdParamSchema.parse(request.params);
    const order = await orderService.getOrderById(userId, id);

    if (!order) {
      sendError(response, 'Order not found', 'ORDER_NOT_FOUND', 404);
      return;
    }

    sendSuccess(response, { order }, 'Order fetched successfully');
  }) as RequestHandler,
};
