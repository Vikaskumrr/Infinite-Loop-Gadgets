import { Router } from 'express';
import { requireAuth } from '../auth/authMiddleware.js';
import { requireAdmin } from '../auth/requireAdmin.js';
import { createAuthenticatedRateLimit } from '../middleware/rateLimit.js';
import { adminController } from './adminController.js';

export const adminRouter = Router();

adminRouter.use(createAuthenticatedRateLimit(200, 'Too many admin authentication attempts. Please pause and try again shortly.'));
adminRouter.use(requireAuth);
adminRouter.use(requireAdmin);
adminRouter.use(createAuthenticatedRateLimit(80, 'Too many admin requests. Please pause and try again shortly.'));

adminRouter.get('/dashboard', adminController.getDashboard);
adminRouter.get('/products', adminController.getProducts);
adminRouter.post('/products', adminController.createProduct);
adminRouter.patch('/products/:id', adminController.updateProduct);
adminRouter.delete('/products/:id', adminController.deleteProduct);
adminRouter.get('/inventory', adminController.getInventory);
adminRouter.patch('/inventory/:productId', adminController.updateInventory);
adminRouter.get('/orders', adminController.getOrders);
adminRouter.get('/orders/:id', adminController.getOrderById);
adminRouter.patch('/orders/:id/status', adminController.updateOrderStatus);
