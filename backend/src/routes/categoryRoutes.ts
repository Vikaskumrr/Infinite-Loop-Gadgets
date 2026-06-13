import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';

export const categoryRouter = Router();

categoryRouter.get('/', categoryController.getCategories);
