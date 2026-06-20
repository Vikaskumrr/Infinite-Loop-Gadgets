import { env } from '../config/env.js';
import { toProductDto, type FrontendProductDto } from '../services/productService.js';
import { userFeatureRepository } from './userFeatureRepository.js';

export class UserFeatureError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, errorCode: string, statusCode: number) {
    super(message);
    this.name = 'UserFeatureError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

const ensureProductExists = async (productId: string) => {
  const product = await userFeatureRepository.findProductById(productId);
  if (!product) {
    throw new UserFeatureError('Product not found', 'PRODUCT_NOT_FOUND', 404);
  }

  return product;
};

const mapProductList = <TItem extends { product: Parameters<typeof toProductDto>[0] }>(items: TItem[]): FrontendProductDto[] =>
  items.map((item) => toProductDto(item.product));

export const userFeatureService = {
  getWishlist: async (userId: string): Promise<FrontendProductDto[]> => {
    const items = await userFeatureRepository.getWishlist(userId);
    return mapProductList(items);
  },

  addWishlistItem: async (userId: string, productId: string): Promise<FrontendProductDto[]> => {
    await ensureProductExists(productId);
    await userFeatureRepository.addWishlistItem(userId, productId);
    return userFeatureService.getWishlist(userId);
  },

  removeWishlistItem: async (userId: string, productId: string): Promise<FrontendProductDto[]> => {
    await userFeatureRepository.removeWishlistItem(userId, productId);
    return userFeatureService.getWishlist(userId);
  },

  getCompareItems: async (userId: string): Promise<FrontendProductDto[]> => {
    const items = await userFeatureRepository.getCompareItems(userId);
    return mapProductList(items);
  },

  addCompareItem: async (userId: string, productId: string): Promise<FrontendProductDto[]> => {
    await ensureProductExists(productId);
    const existingItems = await userFeatureRepository.getCompareItems(userId);
    const alreadyExists = existingItems.some((item) => item.productId === productId);
    if (!alreadyExists && existingItems.length >= env.COMPARE_MAX_ITEMS) {
      throw new UserFeatureError(
        `Compare list is limited to ${env.COMPARE_MAX_ITEMS} items`,
        'COMPARE_LIMIT_REACHED',
        409,
      );
    }

    await userFeatureRepository.addCompareItem(userId, productId);
    return userFeatureService.getCompareItems(userId);
  },

  removeCompareItem: async (userId: string, productId: string): Promise<FrontendProductDto[]> => {
    await userFeatureRepository.removeCompareItem(userId, productId);
    return userFeatureService.getCompareItems(userId);
  },

  getRecentlyViewed: async (userId: string): Promise<FrontendProductDto[]> => {
    const items = await userFeatureRepository.getRecentlyViewed(userId, env.RECENTLY_VIEWED_LIMIT);
    return mapProductList(items);
  },

  addRecentlyViewedItem: async (userId: string, productId: string): Promise<FrontendProductDto[]> => {
    await ensureProductExists(productId);
    const existingItem = await userFeatureRepository.findRecentlyViewedItem(userId, productId);

    if (existingItem) {
      await userFeatureRepository.refreshRecentlyViewedItem(existingItem.id);
    } else {
      await userFeatureRepository.createRecentlyViewedItem(userId, productId);
    }

    await userFeatureRepository.trimRecentlyViewed(userId, env.RECENTLY_VIEWED_LIMIT);
    return userFeatureService.getRecentlyViewed(userId);
  },
};
