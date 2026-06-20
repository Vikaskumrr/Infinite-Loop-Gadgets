import { jest, describe, expect, it } from '@jest/globals';
import request from 'supertest';

const products = [
  {
    id: 'google-pixel-8-pro',
    slug: 'pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    price: 69999,
    rating: 4.7,
    productImage: 'https://example.com/pixel.png',
    color: 'Obsidian',
    category: 'Electronics',
    subcategory: 'Smartphones',
    specifications: { Display: 'OLED' },
    reviewCount: 12,
    images: ['https://example.com/pixel.png'],
    availabilityStatus: 'limited',
    stockQuantity: 3,
  },
];

const productServiceMock = {
  getProducts: jest.fn(() => Promise.resolve({
    products,
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
    },
  })),
  getProductByIdOrSlug: jest.fn((idOrSlug: string) => Promise.resolve(
    idOrSlug === 'missing-product' ? null : products[0],
  )),
  getRelatedProducts: jest.fn(() => Promise.resolve(products)),
  getCategories: jest.fn(() => Promise.resolve([
    {
      id: 'electronics',
      name: 'Electronics',
      slug: 'electronics',
      productCount: 1,
      directProductCount: 0,
    },
  ])),
};

jest.unstable_mockModule('../src/services/productService.js', () => ({
  productService: productServiceMock,
  toProductDto: jest.fn(),
}));

const { app } = await import('../src/app.js');

describe('product API routes', () => {
  it('returns paginated products and parses filters', async () => {
    const response = await request(app)
      .get('/api/v1/products?page=1&limit=20&category=smartphones&sort=rating')
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        products,
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
        },
      },
      message: 'Products fetched successfully',
    });
    expect(productServiceMock.getProducts).toHaveBeenCalledWith(expect.objectContaining({
      page: 1,
      limit: 20,
      category: 'smartphones',
      sort: 'rating',
    }));
  });

  it('returns a product by id', async () => {
    const response = await request(app).get('/api/v1/products/google-pixel-8-pro').expect(200);

    expect(response.body.data).toEqual(products[0]);
  });

  it('returns related products', async () => {
    const response = await request(app).get('/api/v1/products/google-pixel-8-pro/related').expect(200);

    expect(response.body).toEqual({
      success: true,
      data: { products },
      message: 'Related products fetched successfully',
    });
    expect(productServiceMock.getRelatedProducts).toHaveBeenCalledWith('google-pixel-8-pro');
  });

  it('returns a product by slug', async () => {
    const response = await request(app).get('/api/v1/products/pixel-8-pro').expect(200);

    expect(response.body.data.slug).toBe('pixel-8-pro');
  });

  it('returns 404 for an invalid product id or slug', async () => {
    const response = await request(app).get('/api/v1/products/missing-product').expect(404);

    expect(response.body).toEqual({
      success: false,
      message: 'Product not found',
      errorCode: 'PRODUCT_NOT_FOUND',
    });
  });

  it('returns categories with product counts', async () => {
    const response = await request(app).get('/api/v1/categories').expect(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        categories: [
          {
            id: 'electronics',
            name: 'Electronics',
            slug: 'electronics',
            productCount: 1,
            directProductCount: 0,
          },
        ],
      },
      message: 'Categories fetched successfully',
    });
  });
});
