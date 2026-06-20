import { Router } from 'express';
import { requireAuth } from '../auth/authMiddleware.js';
import { userFeatureController } from './userFeatureController.js';

export const userFeatureRouter = Router();

userFeatureRouter.use(requireAuth);

userFeatureRouter.get('/wishlist', userFeatureController.getWishlist);
userFeatureRouter.post('/wishlist/:productId', userFeatureController.addWishlistItem);
userFeatureRouter.delete('/wishlist/:productId', userFeatureController.removeWishlistItem);

userFeatureRouter.get('/compare', userFeatureController.getCompareItems);
userFeatureRouter.post('/compare/:productId', userFeatureController.addCompareItem);
userFeatureRouter.delete('/compare/:productId', userFeatureController.removeCompareItem);

userFeatureRouter.get('/recently-viewed', userFeatureController.getRecentlyViewed);
userFeatureRouter.post('/recently-viewed/:productId', userFeatureController.addRecentlyViewedItem);
