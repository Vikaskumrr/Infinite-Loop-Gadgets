import { Router } from 'express';
import { sendSuccess } from '../utils/apiResponse.js';

export const apiRouter = Router();

apiRouter.get('/health', (_request, response) => {
  sendSuccess(response, { status: 'healthy' }, 'API is running');
});
