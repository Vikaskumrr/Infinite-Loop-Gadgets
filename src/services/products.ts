import type { JsonBinResponse, Product, ProductCatalogResult } from '../types';
import { enrichProducts, enrichedProducts } from '../data/enrichedProducts';
import { extractProductPayload, validateProducts, withProductIdentity } from '../domain/productSchema';
import { logger } from '../utils/logger';
import { fetchProductsFromApi } from './api/productService';

const DEFAULT_BIN_ID = '68bf1a1ed0ea881f4076533c';
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b';
const PRODUCT_REQUEST_TIMEOUT_MS = 8000;

const withCatalogSource = (products: Product[], source: ProductCatalogResult['source']): Product[] =>
  products.map((product) => withProductIdentity({ ...product, catalogSource: source }));

const getProductsUrl = (): string => {
  const directUrl = import.meta.env.VITE_PRODUCTS_API_URL as string | undefined;
  if (directUrl) {
    return directUrl;
  }

  const binId = (import.meta.env.VITE_PRODUCT_BIN_ID as string | undefined) || DEFAULT_BIN_ID;
  return `${JSONBIN_BASE_URL}/${binId}`;
};

const fetchWithTimeout = async (url: string, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const normalizeProductsResponse = (payload: JsonBinResponse | ProductApiRecordLike): Product[] => {
  const rawProducts = extractProductPayload(payload);
  const { products, issues } = validateProducts(rawProducts);

  if (issues.length > 0) {
    logger.warn('Dropped invalid product records from API response.', {
      invalidCount: issues.length,
      issues: issues.map(({ index, reason }) => ({ index, reason })),
    });
  }

  if (products.length === 0) {
    throw new Error('Invalid product data format from API.');
  }

  return enrichProducts(products);
};

type ProductApiRecordLike = {
  products?: unknown;
};

export const fetchProductCatalog = async (): Promise<ProductCatalogResult> => {
  try {
    const products = await fetchProductsFromApi();
    return {
      products: withCatalogSource(products, 'remote'),
      source: 'remote',
    };
  } catch (apiError) {
    logger.warn('Backend product API unavailable; trying legacy product feed.', {
      reason: apiError instanceof Error ? apiError.message : 'Unknown backend product API failure.',
    });
  }

  try {
    const response = await fetchWithTimeout(getProductsUrl(), PRODUCT_REQUEST_TIMEOUT_MS);

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const payload = (await response.json()) as JsonBinResponse | ProductApiRecordLike;
    return {
      products: withCatalogSource(normalizeProductsResponse(payload), 'remote'),
      source: 'remote',
    };
  } catch (error) {
    const warning = error instanceof Error ? error.message : 'Unknown product API failure.';
    logger.warn('Using local enriched catalog fallback after product feed failure.', {
      reason: warning,
    });
    return {
      products: withCatalogSource(enrichedProducts, 'fallback'),
      source: 'fallback',
      warning,
    };
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  const catalog = await fetchProductCatalog();
  return catalog.products;
};
