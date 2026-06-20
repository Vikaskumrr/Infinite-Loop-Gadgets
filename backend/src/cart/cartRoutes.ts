import { Router } from 'express';
import { requireAuth } from '../auth/authMiddleware.js';
import { cartRateLimit } from '../middleware/rateLimit.js';
import { cartController } from './cartController.js';

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.use(cartRateLimit);

cartRouter.get('/', cartController.getCart);
cartRouter.post('/items', cartController.addItem);
cartRouter.patch('/items/:productId', cartController.updateItemQuantity);
cartRouter.delete('/items/:productId', cartController.removeItem);
cartRouter.delete('/', cartController.clearCart);
