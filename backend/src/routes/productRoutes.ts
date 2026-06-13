import { Router } from 'express';
import { productController } from '../controllers/productController.js';

export const productRouter = Router();

productRouter.get('/', productController.getProducts);
productRouter.get('/:idOrSlug', productController.getProductByIdOrSlug);
