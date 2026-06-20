import type { RequestHandler, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { productIdParamSchema } from './validators.js';
import { userFeatureService, UserFeatureError } from './userFeatureService.js';

const handleUserFeatureError = (error: unknown, response: Response): boolean => {
  if (error instanceof UserFeatureError) {
    sendError(response, error.message, error.errorCode, error.statusCode);
    return true;
  }
  return false;
};

const requireUserId = (request: Parameters<RequestHandler>[0], response: Response): string | null => {
  if (!request.auth?.userId) {
    sendError(response, 'Authentication required', 'AUTH_REQUIRED', 401);
    return null;
  }

  return request.auth.userId;
};

export const userFeatureController = {
  getWishlist: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    const products = await userFeatureService.getWishlist(userId);
    sendSuccess(response, { products }, 'Wishlist fetched successfully');
  }) as RequestHandler,

  addWishlistItem: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    try {
      const { productId } = productIdParamSchema.parse(request.params);
      const products = await userFeatureService.addWishlistItem(userId, productId);
      sendSuccess(response, { products }, 'Wishlist updated successfully');
    } catch (error) {
      if (!handleUserFeatureError(error, response)) throw error;
    }
  }) as RequestHandler,

  removeWishlistItem: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    const { productId } = productIdParamSchema.parse(request.params);
    const products = await userFeatureService.removeWishlistItem(userId, productId);
    sendSuccess(response, { products }, 'Wishlist updated successfully');
  }) as RequestHandler,

  getCompareItems: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    const products = await userFeatureService.getCompareItems(userId);
    sendSuccess(response, { products }, 'Compare products fetched successfully');
  }) as RequestHandler,

  addCompareItem: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    try {
      const { productId } = productIdParamSchema.parse(request.params);
      const products = await userFeatureService.addCompareItem(userId, productId);
      sendSuccess(response, { products }, 'Compare products updated successfully');
    } catch (error) {
      if (!handleUserFeatureError(error, response)) throw error;
    }
  }) as RequestHandler,

  removeCompareItem: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    const { productId } = productIdParamSchema.parse(request.params);
    const products = await userFeatureService.removeCompareItem(userId, productId);
    sendSuccess(response, { products }, 'Compare products updated successfully');
  }) as RequestHandler,

  getRecentlyViewed: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    const products = await userFeatureService.getRecentlyViewed(userId);
    sendSuccess(response, { products }, 'Recently viewed products fetched successfully');
  }) as RequestHandler,

  addRecentlyViewedItem: asyncHandler(async (request, response) => {
    const userId = requireUserId(request, response);
    if (!userId) return;

    try {
      const { productId } = productIdParamSchema.parse(request.params);
      const products = await userFeatureService.addRecentlyViewedItem(userId, productId);
      sendSuccess(response, { products }, 'Recently viewed products updated successfully');
    } catch (error) {
      if (!handleUserFeatureError(error, response)) throw error;
    }
  }) as RequestHandler,
};
