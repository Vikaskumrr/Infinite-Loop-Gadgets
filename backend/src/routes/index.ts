import { Router } from 'express';
import { authRouter } from '../auth/authRoutes.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { categoryRouter } from './categoryRoutes.js';
import { productRouter } from './productRoutes.js';

export const apiRouter = Router();

apiRouter.get('/health', (_request, response) => {
  sendSuccess(response, { status: 'healthy' }, 'API is running');
});

apiRouter.use('/products', productRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/auth', authRouter);
