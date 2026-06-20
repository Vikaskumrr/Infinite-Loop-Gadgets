import { Router } from 'express';
import { authRouter } from '../auth/authRoutes.js';
import { adminRouter } from '../admin/adminRoutes.js';
import { cartRouter } from '../cart/cartRoutes.js';
import { orderRouter } from '../orders/orderRoutes.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { userFeatureRouter } from '../userFeatures/userFeatureRoutes.js';
import { categoryRouter } from './categoryRoutes.js';
import { productRouter } from './productRoutes.js';

export const apiRouter = Router();

apiRouter.get('/health', (_request, response) => {
  sendSuccess(response, { status: 'healthy' }, 'API is running');
});

apiRouter.use('/products', productRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/users/me', userFeatureRouter);
