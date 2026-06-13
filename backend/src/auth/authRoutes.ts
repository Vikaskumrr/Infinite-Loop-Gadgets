import { Router } from 'express';
import { authController } from './authController.js';
import { requireAuth } from './authMiddleware.js';

export const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/me', requireAuth, authController.me);
authRouter.post('/logout', requireAuth, authController.logout);
