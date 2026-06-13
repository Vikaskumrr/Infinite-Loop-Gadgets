import type { Product } from '../../types';
import { apiGet } from './client';

interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
  message: string;
}

interface ProductsPayload {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export const fetchProductsFromApi = async (): Promise<Product[]> => {
  const response = await apiGet<ApiSuccessResponse<ProductsPayload>>('/products?limit=100&sort=rating');

  if (!response.success || !Array.isArray(response.data.products)) {
    throw new Error('Invalid product API response.');
  }

  return response.data.products;
};
