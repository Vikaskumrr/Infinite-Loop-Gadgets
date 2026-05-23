import { describe, expect, test } from 'vitest';
import { filterAndSortProducts } from '../hooks/useProducts';
import { normalizeProductsResponse } from '../services/products';
import { enrichedProducts } from '../data/enrichedProducts';
import { productMatchesCategory } from '../utils/products';
import type { Product } from '../types';

const products: Product[] = [
  { name: 'Loop Tablet', brand: 'Infinite', price: 49999, rating: 4.4, productImage: '/tablet.png', color: 'Silver' },
  { name: 'Loop Phone Pro', brand: 'Infinite', price: 79999, rating: 4.8, productImage: '/phone.png', color: 'Graphite' },
  { name: 'Arc Headphones', brand: 'Sonic', price: 12999, rating: 4.6, productImage: '/headphones.png', color: 'Black' },
];

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
});
