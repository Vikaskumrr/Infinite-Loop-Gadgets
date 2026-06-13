import { afterEach, describe, expect, test, vi } from 'vitest';
import { filterAndSortProducts } from '../hooks/useProducts';
import { fetchProductCatalog, normalizeProductsResponse } from '../services/products';
import { enrichedProducts } from '../data/enrichedProducts';
import { productMatchesCategory } from '../utils/products';
import type { Product } from '../types';

const products: Product[] = [
  { name: 'Loop Tablet', brand: 'Infinite', price: 49999, rating: 4.4, productImage: '/tablet.png', color: 'Silver' },
  { name: 'Loop Phone Pro', brand: 'Infinite', price: 79999, rating: 4.8, productImage: '/phone.png', color: 'Graphite' },
  { name: 'Arc Headphones', brand: 'Sonic', price: 12999, rating: 4.6, productImage: '/headphones.png', color: 'Black' },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('product utilities', () => {
  test('filters products by search term', () => {
    expect(filterAndSortProducts(products, 'pro', 'none')).toEqual([products[1]]);
  });

  test('sorts products by price ascending', () => {
    expect(filterAndSortProducts(products, '', 'price-asc').map((product) => product.name)).toEqual([
      'Arc Headphones',
      'Loop Tablet',
      'Loop Phone Pro',
    ]);
  });

  test('sorts products by rating descending', () => {
    expect(filterAndSortProducts(products, '', 'rating')[0].name).toBe('Loop Phone Pro');
  });

  test('normalizes JSONBin and direct product responses', () => {
    expect(normalizeProductsResponse({ record: { products } }).length).toBeGreaterThanOrEqual(products.length);
    expect(normalizeProductsResponse({ products }).length).toBeGreaterThanOrEqual(products.length);
  });

  test('adds stable product identity during normalization', () => {
    const normalizedProducts = normalizeProductsResponse({ products });

    expect(normalizedProducts).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'infinite-loop-tablet',
        slug: 'loop-tablet',
      }),
    ]));
  });

  test('keeps valid API products when neighboring records are invalid', () => {
    const payload = {
      record: {
        products: [
          products[0],
          { name: 'Broken' },
        ],
      },
    } as unknown as Parameters<typeof normalizeProductsResponse>[0];
    const normalizedProducts = normalizeProductsResponse(payload);

    expect(normalizedProducts).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Loop Tablet' }),
    ]));
  });

  test('adds source-backed fallback products to the catalog', () => {
    const normalizedProducts = normalizeProductsResponse({ record: { products } });

    expect(normalizedProducts).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'Google Pixel 8 Pro',
        sourceUrl: expect.stringContaining('store.google.com'),
        features: expect.arrayContaining(['Tensor G3 processor']),
      }),
    ]));
  });

  test('uses structured categories before text matching', () => {
    const switchOled = enrichedProducts.find((product) => product.name === 'Nintendo Switch OLED Model');

    expect(switchOled).toBeDefined();
    expect(productMatchesCategory(switchOled as Product, 'Consoles')).toBe(true);
  });

  test('rejects malformed product responses', () => {
    const malformed = { record: { products: [{ name: 'Broken' }] } } as unknown as Parameters<
      typeof normalizeProductsResponse
    >[0];
    expect(() => normalizeProductsResponse(malformed)).toThrow(
      /invalid product data/i,
    );
  });

  test('reports remote catalog source when product API succeeds', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ products }),
    } as Response);

    const catalog = await fetchProductCatalog();

    expect(catalog.source).toBe('remote');
    expect(catalog.warning).toBeUndefined();
    expect(catalog.products[0].catalogSource).toBe('remote');
  });

  test('reports fallback catalog source when product API fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network unavailable'));

    const catalog = await fetchProductCatalog();

    expect(catalog.source).toBe('fallback');
    expect(catalog.warning).toMatch(/network unavailable/i);
    expect(catalog.products[0].catalogSource).toBe('fallback');
  });
});
