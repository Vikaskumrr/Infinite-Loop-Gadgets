import type { RequestHandler, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { adminService, AdminError } from './adminService.js';
import {
  adminIdParamSchema,
  adminInventoryUpdateSchema,
  adminOrderListQuerySchema,
  adminOrderStatusSchema,
  adminProductIdParamSchema,
  adminProductListQuerySchema,
  adminProductSchema,
  adminProductUpdateSchema,
} from './validators.js';

const handleAdminError = (error: unknown, response: Response): boolean => {
  if (error instanceof AdminError) {
    sendError(response, error.message, error.errorCode, error.statusCode);
    return true;
  }
  return false;
};

export const adminController = {
  getDashboard: asyncHandler(async (_request, response) => {
    const dashboard = await adminService.getDashboard();
    sendSuccess(response, { dashboard }, 'Admin dashboard fetched successfully');
  }) as RequestHandler,

  getProducts: asyncHandler(async (request, response) => {
    const query = adminProductListQuerySchema.parse(request.query);
    const products = await adminService.getProducts(query.search);
    sendSuccess(response, { products }, 'Admin products fetched successfully');
  }) as RequestHandler,

  createProduct: asyncHandler(async (request, response) => {
    try {
      const input = adminProductSchema.parse(request.body);
      const product = await adminService.createProduct(input);
      sendSuccess(response, { product }, 'Product created successfully', 201);
    } catch (error) {
      if (!handleAdminError(error, response)) throw error;
    }
  }) as RequestHandler,

  updateProduct: asyncHandler(async (request, response) => {
    try {
      const { id } = adminIdParamSchema.parse(request.params);
      const input = adminProductUpdateSchema.parse(request.body);
      const product = await adminService.updateProduct(id, input);
      sendSuccess(response, { product }, 'Product updated successfully');
    } catch (error) {
      if (!handleAdminError(error, response)) throw error;
    }
  }) as RequestHandler,

  deleteProduct: asyncHandler(async (request, response) => {
    try {
      const { id } = adminIdParamSchema.parse(request.params);
      await adminService.deleteProduct(id);
      sendSuccess(response, { deleted: true }, 'Product deleted successfully');
    } catch (error) {
      if (!handleAdminError(error, response)) throw error;
    }
  }) as RequestHandler,

  getInventory: asyncHandler(async (_request, response) => {
    const inventory = await adminService.getInventory();
    sendSuccess(response, { inventory }, 'Inventory fetched successfully');
  }) as RequestHandler,

  updateInventory: asyncHandler(async (request, response) => {
    try {
      const { productId } = adminProductIdParamSchema.parse(request.params);
      const input = adminInventoryUpdateSchema.parse(request.body);
      const inventoryItem = await adminService.updateInventory(productId, input);
      sendSuccess(response, { inventoryItem }, 'Inventory updated successfully');
    } catch (error) {
      if (!handleAdminError(error, response)) throw error;
    }
  }) as RequestHandler,

  getOrders: asyncHandler(async (request, response) => {
    const query = adminOrderListQuerySchema.parse(request.query);
    const orders = await adminService.getOrders(query);
    sendSuccess(response, { orders }, 'Admin orders fetched successfully');
  }) as RequestHandler,

  getOrderById: asyncHandler(async (request, response) => {
    try {
      const { id } = adminIdParamSchema.parse(request.params);
      const order = await adminService.getOrderById(id);
      sendSuccess(response, { order }, 'Admin order fetched successfully');
    } catch (error) {
      if (!handleAdminError(error, response)) throw error;
    }
  }) as RequestHandler,

  updateOrderStatus: asyncHandler(async (request, response) => {
    try {
      const { id } = adminIdParamSchema.parse(request.params);
      const input = adminOrderStatusSchema.parse(request.body);
      const order = await adminService.updateOrderStatus(id, input);
      sendSuccess(response, { order }, 'Order status updated successfully');
    } catch (error) {
      if (!handleAdminError(error, response)) throw error;
    }
  }) as RequestHandler,
};
