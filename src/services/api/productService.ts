import type { Product } from '../../types';
import { validateProducts } from '../../domain/productSchema';
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

  const { products, issues } = validateProducts(response.data.products);
  if (issues.length > 0) {
    throw new Error(`Backend product API returned ${issues.length} invalid product record(s).`);
  }

  return products;
};

export const fetchRelatedProductsFromApi = async (idOrSlug: string): Promise<Product[]> => {
  const response = await apiGet<ApiSuccessResponse<{ products: Product[] }>>(`/products/${encodeURIComponent(idOrSlug)}/related`);

  if (!response.success || !Array.isArray(response.data.products)) {
    throw new Error('Invalid related products API response.');
  }

  const { products, issues } = validateProducts(response.data.products);
  if (issues.length > 0) {
    throw new Error(`Backend related products API returned ${issues.length} invalid product record(s).`);
  }

  return products;
};
