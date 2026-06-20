import { Router } from 'express';
import { requireAuth } from '../auth/authMiddleware.js';
import { createAuthenticatedRateLimit } from '../middleware/rateLimit.js';
import { orderController } from './orderController.js';

export const orderRouter = Router();

orderRouter.use(requireAuth);
orderRouter.use(createAuthenticatedRateLimit(40, 'Too many order requests. Please slow down and try again shortly.'));

orderRouter.get('/', orderController.getOrders);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.post('/checkout', orderController.checkout);
