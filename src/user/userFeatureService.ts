import type { Product } from '../types';
import { validateProducts } from '../domain/productSchema';
import { apiDelete, apiGet, apiPost } from '../services/api/client';

interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
  message: string;
}

interface ProductCollectionPayload {
  products: Product[];
}

const toAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const validateProductCollection = (products: Product[]): Product[] => {
  const { products: validatedProducts, issues } = validateProducts(products);
  if (issues.length > 0) {
    throw new Error(`User feature API returned ${issues.length} invalid product record(s).`);
  }

  return validatedProducts;
};

const getProductCollection = async (path: string, token: string): Promise<Product[]> => {
  const response = await apiGet<ApiSuccessResponse<ProductCollectionPayload>>(path, toAuthHeaders(token));

  if (!response.success || !Array.isArray(response.data.products)) {
    throw new Error('Invalid user feature API response.');
  }

  return validateProductCollection(response.data.products);
};

const mutateProductCollection = async (
  method: 'POST' | 'DELETE',
  path: string,
  token: string,
): Promise<Product[]> => {
  const response = method === 'POST'
    ? await apiPost<ApiSuccessResponse<ProductCollectionPayload>>(path, {}, toAuthHeaders(token))
    : await apiDelete<ApiSuccessResponse<ProductCollectionPayload>>(path, toAuthHeaders(token));

  if (!response.success || !Array.isArray(response.data.products)) {
    throw new Error('Invalid user feature mutation response.');
  }

  return validateProductCollection(response.data.products);
};

export const userFeatureService = {
  getWishlist: (token: string) => getProductCollection('/users/me/wishlist', token),
  addWishlistItem: (token: string, productId: string) =>
    mutateProductCollection('POST', `/users/me/wishlist/${encodeURIComponent(productId)}`, token),
  removeWishlistItem: (token: string, productId: string) =>
    mutateProductCollection('DELETE', `/users/me/wishlist/${encodeURIComponent(productId)}`, token),

  getCompare: (token: string) => getProductCollection('/users/me/compare', token),
  addCompareItem: (token: string, productId: string) =>
    mutateProductCollection('POST', `/users/me/compare/${encodeURIComponent(productId)}`, token),
  removeCompareItem: (token: string, productId: string) =>
    mutateProductCollection('DELETE', `/users/me/compare/${encodeURIComponent(productId)}`, token),

  getRecentlyViewed: (token: string) => getProductCollection('/users/me/recently-viewed', token),
  addRecentlyViewedItem: (token: string, productId: string) =>
    mutateProductCollection('POST', `/users/me/recently-viewed/${encodeURIComponent(productId)}`, token),
};
