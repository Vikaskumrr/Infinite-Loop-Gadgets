import { apiGet, apiPost } from '../services/api/client';
import { validateProducts } from '../domain/productSchema';
import type { Order } from '../types';
import type { CheckoutPayload } from './types';

interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
  message: string;
}

const toAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const validateOrders = (orders: Order[]): Order[] =>
  orders.map((order) => {
    const { products, issues } = validateProducts(order.items.map((item) => item.product));
    if (issues.length > 0) {
      throw new Error(`Order API returned ${issues.length} invalid product record(s).`);
    }

    return {
      ...order,
      items: order.items.map((item, index) => ({
        ...item,
        product: products[index],
      })),
    };
  });

export const orderService = {
  checkout: async (token: string, payload: CheckoutPayload): Promise<Order> => {
    const response = await apiPost<ApiSuccessResponse<{ order: Order }>>('/orders/checkout', payload, toAuthHeaders(token));
    return validateOrders([response.data.order])[0];
  },

  getOrders: async (token: string): Promise<Order[]> => {
    const response = await apiGet<ApiSuccessResponse<{ orders: Order[] }>>('/orders', toAuthHeaders(token));
    return validateOrders(response.data.orders);
  },

  getOrderById: async (token: string, id: string): Promise<Order> => {
    const response = await apiGet<ApiSuccessResponse<{ order: Order }>>(`/orders/${encodeURIComponent(id)}`, toAuthHeaders(token));
    return validateOrders([response.data.order])[0];
  },
};
