import type { JsonBinResponse, Product } from '../types';

const DEFAULT_BIN_ID = '68bf1a1ed0ea881f4076533c';
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b';

const getProductsUrl = (): string => {
  const directUrl = import.meta.env.VITE_PRODUCTS_API_URL as string | undefined;
  if (directUrl) {
    return directUrl;
  }

  const binId = (import.meta.env.VITE_PRODUCT_BIN_ID as string | undefined) || DEFAULT_BIN_ID;
  return `${JSONBIN_BASE_URL}/${binId}`;
};

const isProduct = (value: unknown): value is Product => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const product = value as Partial<Product>;
  return (
    typeof product.name === 'string' &&
    typeof product.brand === 'string' &&
    typeof product.price === 'number' &&
    typeof product.rating === 'number' &&
    typeof product.productImage === 'string' &&
    typeof product.color === 'string'
  );
};

export const normalizeProductsResponse = (payload: JsonBinResponse | ProductApiRecordLike): Product[] => {
  const products = 'record' in payload ? payload.record?.products : (payload as ProductApiRecordLike).products;

  if (!Array.isArray(products) || !products.every(isProduct)) {
    throw new Error('Invalid product data format from API.');
  }

  return products;
};

type ProductApiRecordLike = {
  products?: unknown;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(getProductsUrl());

  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }

  const payload = (await response.json()) as JsonBinResponse | ProductApiRecordLike;
  return normalizeProductsResponse(payload);
};
