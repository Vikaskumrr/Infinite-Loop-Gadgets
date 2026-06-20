import { validateProducts } from '../domain/productSchema';
import { apiDelete, apiGet, apiPatch, apiPost } from '../services/api/client';
import type { Product } from '../types';
import type { CartItem, CartState } from './types';

interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
  message: string;
}

const toAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const validateCartProducts = <TItem extends { product: Product }>(items: TItem[]) => {
  const { products, issues } = validateProducts(items.map((item) => item.product));
  if (issues.length > 0) {
    throw new Error(`Cart API returned ${issues.length} invalid product record(s).`);
  }

  return items.map((item, index) => ({
    ...item,
    product: products[index],
  }));
};

const normalizeCart = (payload: CartState): CartState => ({
  ...payload,
  items: validateCartProducts<CartItem>(payload.items),
});

const getCartResponse = async (path: string, token: string, init?: { method?: 'POST' | 'PATCH' | 'DELETE'; body?: unknown }) => {
  const response = init?.method === 'POST'
    ? await apiPost<ApiSuccessResponse<CartState>>(path, init.body || {}, toAuthHeaders(token))
    : init?.method === 'PATCH'
      ? await apiPatch<ApiSuccessResponse<CartState>>(path, init.body || {}, toAuthHeaders(token))
      : init?.method === 'DELETE'
        ? await apiDelete<ApiSuccessResponse<CartState>>(path, toAuthHeaders(token))
        : await apiGet<ApiSuccessResponse<CartState>>(path, toAuthHeaders(token));

  if (!response.success || !Array.isArray(response.data.items)) {
    throw new Error('Invalid cart API response.');
  }

  return normalizeCart(response.data);
};

export const cartService = {
  getCart: (token: string) => getCartResponse('/cart', token),
  addItem: (token: string, productId: string, quantity = 1) =>
    getCartResponse('/cart/items', token, { method: 'POST', body: { productId, quantity } }),
  updateQuantity: (token: string, productId: string, quantity: number) =>
    getCartResponse(`/cart/items/${encodeURIComponent(productId)}`, token, { method: 'PATCH', body: { quantity } }),
  removeItem: (token: string, productId: string) =>
    getCartResponse(`/cart/items/${encodeURIComponent(productId)}`, token, { method: 'DELETE' }),
  clearCart: (token: string) => getCartResponse('/cart', token, { method: 'DELETE' }),
};
