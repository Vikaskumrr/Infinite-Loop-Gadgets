import type { RequestHandler } from 'express';
import { productService } from '../services/productService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const categoryController = {
  getCategories: asyncHandler(async (_request, response) => {
    const categories = await productService.getCategories();

    sendSuccess(response, { categories }, 'Categories fetched successfully');
  }) as RequestHandler,
};
