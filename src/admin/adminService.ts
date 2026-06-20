import { apiDelete, apiGet, apiPatch, apiPost } from '../services/api/client';
import type { AdminDashboard, AdminInventoryItem, AdminOrder, AdminProduct, AdminProductInput } from './types';

interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
  message: string;
}

const toAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const adminService = {
  getDashboard: async (token: string): Promise<AdminDashboard> => {
    const response = await apiGet<ApiSuccessResponse<{ dashboard: AdminDashboard }>>('/admin/dashboard', toAuthHeaders(token));
    return response.data.dashboard;
  },

  getProducts: async (token: string, search = ''): Promise<AdminProduct[]> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await apiGet<ApiSuccessResponse<{ products: AdminProduct[] }>>(`/admin/products${query}`, toAuthHeaders(token));
    return response.data.products;
  },

  createProduct: async (token: string, payload: AdminProductInput): Promise<AdminProduct> => {
    const response = await apiPost<ApiSuccessResponse<{ product: AdminProduct }>>('/admin/products', payload, toAuthHeaders(token));
    return response.data.product;
  },

  updateProduct: async (token: string, id: string, payload: Partial<AdminProductInput>): Promise<AdminProduct> => {
    const response = await apiPatch<ApiSuccessResponse<{ product: AdminProduct }>>(`/admin/products/${encodeURIComponent(id)}`, payload, toAuthHeaders(token));
    return response.data.product;
  },

  deleteProduct: async (token: string, id: string): Promise<void> => {
    await apiDelete(`/admin/products/${encodeURIComponent(id)}`, toAuthHeaders(token));
  },

  getInventory: async (token: string): Promise<AdminInventoryItem[]> => {
    const response = await apiGet<ApiSuccessResponse<{ inventory: AdminInventoryItem[] }>>('/admin/inventory', toAuthHeaders(token));
    return response.data.inventory;
  },

  updateInventory: async (
    token: string,
    productId: string,
    payload: Pick<AdminInventoryItem, 'stockQuantity' | 'availabilityStatus'>,
  ): Promise<AdminInventoryItem> => {
    const response = await apiPatch<ApiSuccessResponse<{ inventoryItem: AdminInventoryItem }>>(
      `/admin/inventory/${encodeURIComponent(productId)}`,
      payload,
      toAuthHeaders(token),
    );
    return response.data.inventoryItem;
  },

  getOrders: async (token: string): Promise<AdminOrder[]> => {
    const response = await apiGet<ApiSuccessResponse<{ orders: AdminOrder[] }>>('/admin/orders', toAuthHeaders(token));
    return response.data.orders;
  },

  updateOrderStatus: async (token: string, id: string, status: string): Promise<AdminOrder> => {
    const response = await apiPatch<ApiSuccessResponse<{ order: AdminOrder }>>(
      `/admin/orders/${encodeURIComponent(id)}/status`,
      { status },
      toAuthHeaders(token),
    );
    return response.data.order;
  },
};
