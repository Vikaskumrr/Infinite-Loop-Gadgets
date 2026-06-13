import { describe, expect, test } from 'vitest';
import { extractProductPayload, validateProduct, validateProducts } from '../domain/productSchema';

const validProduct = {
  name: '  Loop Phone Pro  ',
  brand: 'Infinite',
  price: 79999,
  rating: 4.8,
  productImage: ' /phone.png ',
  color: 'Graphite',
  features: ['120Hz display', 'Fast charging'],
  reviews: [{ user: 'Asha', comment: 'Excellent everyday phone.', stars: 5 }],
  specifications: { Display: '6.7 inch OLED' },
};

describe('product schema validation', () => {
  test('normalizes valid product data and applies safe defaults', () => {
    const product = validateProduct(validProduct);

    expect(product).toEqual(expect.objectContaining({
      id: 'infinite-loop-phone-pro',
      slug: 'loop-phone-pro',
      name: 'Loop Phone Pro',
      productImage: '/phone.png',
      stockStatus: 'in-stock',
    }));
  });

  test('rejects invalid required product fields', () => {
    expect(() => validateProduct({ ...validProduct, price: -1 })).toThrow(/price/i);
    expect(() => validateProduct({ ...validProduct, rating: 6 })).toThrow(/rating/i);
    expect(() => validateProduct({ ...validProduct, productImage: '' })).toThrow(/productImage/i);
  });

  test('rejects unsafe external product URLs', () => {
    expect(() => validateProduct({ ...validProduct, productImage: 'http://example.com/image.png' })).toThrow(/https/i);
    expect(() => validateProduct({ ...validProduct, sourceUrl: 'javascript:alert(1)' })).toThrow(/https|valid URL/i);
  });

  test('rejects malformed optional arrays instead of silently dropping them', () => {
    expect(() => validateProduct({ ...validProduct, features: ['Good', 42] })).toThrow(/features/i);
  });

  test('filters invalid products while preserving valid catalog rows', () => {
    const result = validateProducts([
      validProduct,
      { ...validProduct, name: 'Broken Rating', rating: Number.NaN },
      { name: 'Missing Required Fields' },
    ]);

    expect(result.products).toHaveLength(1);
    expect(result.issues).toHaveLength(2);
    expect(result.issues.map((issue) => issue.index)).toEqual([1, 2]);
  });

  test('extracts products from JSONBin and direct API payloads', () => {
    expect(extractProductPayload({ record: { products: [validProduct] } })).toEqual([validProduct]);
    expect(extractProductPayload({ products: [validProduct] })).toEqual([validProduct]);
    expect(() => extractProductPayload({ record: {} })).toThrow(/products array/i);
  });
});
