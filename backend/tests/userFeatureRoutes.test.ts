import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import { generateAccessToken } from '../src/auth/token.js';

const products = [
  {
    id: 'pixel-8-pro',
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
  },
  {
    id: 'sony-wh1000xm5',
    slug: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    price: 29999,
    rating: 4.8,
    productImage: 'https://example.com/sony.png',
    color: 'Black',
    category: 'Audio',
    subcategory: 'Headphones',
    specifications: { ANC: 'Yes' },
  },
];

class MockUserFeatureError extends Error {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

const userFeatureServiceMock = {
  getWishlist: jest.fn(() => Promise.resolve([products[0]])),
  addWishlistItem: jest.fn(() => Promise.resolve([products[0]])),
  removeWishlistItem: jest.fn(() => Promise.resolve([])),
  getCompareItems: jest.fn(() => Promise.resolve([products[0]])),
  addCompareItem: jest.fn(() => Promise.resolve([products[0]])),
  removeCompareItem: jest.fn(() => Promise.resolve([])),
  getRecentlyViewed: jest.fn(() => Promise.resolve([products[1], products[0]])),
  addRecentlyViewedItem: jest.fn(() => Promise.resolve([products[1], products[0]])),
};

jest.unstable_mockModule('../src/userFeatures/userFeatureService.js', () => ({
  userFeatureService: userFeatureServiceMock,
  UserFeatureError: MockUserFeatureError,
}));

const { app } = await import('../src/app.js');

describe('user feature API routes', () => {
  const token = generateAccessToken({ userId: 'user_123' });

  beforeEach(() => {
    jest.clearAllMocks();
    userFeatureServiceMock.getWishlist.mockResolvedValue([products[0]]);
    userFeatureServiceMock.addWishlistItem.mockResolvedValue([products[0]]);
    userFeatureServiceMock.removeWishlistItem.mockResolvedValue([]);
    userFeatureServiceMock.getCompareItems.mockResolvedValue([products[0]]);
    userFeatureServiceMock.addCompareItem.mockResolvedValue([products[0]]);
    userFeatureServiceMock.removeCompareItem.mockResolvedValue([]);
    userFeatureServiceMock.getRecentlyViewed.mockResolvedValue([products[1], products[0]]);
    userFeatureServiceMock.addRecentlyViewedItem.mockResolvedValue([products[1], products[0]]);
  });

  it('rejects unauthorized wishlist access', async () => {
    const response = await request(app).get('/api/v1/users/me/wishlist').expect(401);

    expect(response.body.errorCode).toBe('AUTH_REQUIRED');
  });

  it('adds a wishlist item and returns full product data', async () => {
    const response = await request(app)
      .post('/api/v1/users/me/wishlist/pixel-8-pro')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.products).toEqual([products[0]]);
    expect(userFeatureServiceMock.addWishlistItem).toHaveBeenCalledWith('user_123', 'pixel-8-pro');
  });

  it('prevents duplicate wishlist items when the service rejects the request', async () => {
    userFeatureServiceMock.addWishlistItem.mockRejectedValue(
      new MockUserFeatureError('Product is already saved', 'WISHLIST_DUPLICATE', 409),
    );

    const response = await request(app)
      .post('/api/v1/users/me/wishlist/pixel-8-pro')
      .set('Authorization', `Bearer ${token}`)
      .expect(409);

    expect(response.body.errorCode).toBe('WISHLIST_DUPLICATE');
  });

  it('removes a wishlist item', async () => {
    const response = await request(app)
      .delete('/api/v1/users/me/wishlist/pixel-8-pro')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.products).toEqual([]);
    expect(userFeatureServiceMock.removeWishlistItem).toHaveBeenCalledWith('user_123', 'pixel-8-pro');
  });

  it('enforces the compare limit', async () => {
    userFeatureServiceMock.addCompareItem.mockRejectedValue(
      new MockUserFeatureError('Compare list is limited to 4 items', 'COMPARE_LIMIT_REACHED', 409),
    );

    const response = await request(app)
      .post('/api/v1/users/me/compare/sony-wh1000xm5')
      .set('Authorization', `Bearer ${token}`)
      .expect(409);

    expect(response.body.errorCode).toBe('COMPARE_LIMIT_REACHED');
  });

  it('returns recently viewed products in most-recent-first order', async () => {
    const response = await request(app)
      .get('/api/v1/users/me/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.products).toEqual([products[1], products[0]]);
    expect(userFeatureServiceMock.getRecentlyViewed).toHaveBeenCalledWith('user_123');
  });
});
