import type { RequestHandler } from 'express';
import { productService } from '../services/productService.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { productListQuerySchema } from '../validators/productValidators.js';

export const productController = {
  getProducts: asyncHandler(async (request, response) => {
    const query = productListQuerySchema.parse(request.query);
    const data = await productService.getProducts(query);

    sendSuccess(response, data, 'Products fetched successfully');
  }) as RequestHandler,

  getProductByIdOrSlug: asyncHandler(async (request, response) => {
    const idOrSlug = request.params.idOrSlug;
    if (!idOrSlug || Array.isArray(idOrSlug)) {
      sendError(response, 'Invalid product identifier', 'INVALID_PRODUCT_IDENTIFIER', 400);
      return;
    }

    const product = await productService.getProductByIdOrSlug(idOrSlug);

    if (!product) {
      sendError(response, 'Product not found', 'PRODUCT_NOT_FOUND', 404);
      return;
    }

    sendSuccess(response, product, 'Product fetched successfully');
  }) as RequestHandler,

  getRelatedProducts: asyncHandler(async (request, response) => {
    const idOrSlug = request.params.idOrSlug;
    if (!idOrSlug || Array.isArray(idOrSlug)) {
      sendError(response, 'Invalid product identifier', 'INVALID_PRODUCT_IDENTIFIER', 400);
      return;
    }

    const products = await productService.getRelatedProducts(idOrSlug);
    sendSuccess(response, { products }, 'Related products fetched successfully');
  }) as RequestHandler,
};
