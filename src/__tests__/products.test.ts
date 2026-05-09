import { describe, expect, test } from 'vitest';
import { filterAndSortProducts } from '../hooks/useProducts';
import { normalizeProductsResponse } from '../services/products';
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
    expect(normalizeProductsResponse({ record: { products } })).toHaveLength(3);
    expect(normalizeProductsResponse({ products })).toHaveLength(3);
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
