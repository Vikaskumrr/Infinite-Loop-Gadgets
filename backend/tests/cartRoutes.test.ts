import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import { generateAccessToken } from '../src/auth/token.js';

const cartPayload = {
  items: [
    {
      productId: 'pixel-8-pro',
      quantity: 2,
      unitPrice: 69999,
      subtotal: 139998,
      availabilityStatus: 'limited',
      stockQuantity: 3,
      product: {
        id: 'pixel-8-pro',
        slug: 'pixel-8-pro',
        name: 'Google Pixel 8 Pro',
        brand: 'Google',
        price: 69999,
        rating: 4.7,
        productImage: 'https://example.com/pixel.png',
        color: 'Obsidian',
      },
    },
  ],
  subtotal: 139998,
  itemCount: 2,
};

class MockCartError extends Error {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

const cartServiceMock = {
  getCart: jest.fn(() => Promise.resolve(cartPayload)),
  addItem: jest.fn(() => Promise.resolve(cartPayload)),
  updateItemQuantity: jest.fn(() => Promise.resolve(cartPayload)),
  removeItem: jest.fn(() => Promise.resolve({ ...cartPayload, items: [], subtotal: 0, itemCount: 0 })),
  clearCart: jest.fn(() => Promise.resolve({ items: [], subtotal: 0, itemCount: 0 })),
};

jest.unstable_mockModule('../src/cart/cartService.js', () => ({
  cartService: cartServiceMock,
  CartError: MockCartError,
}));

const { app } = await import('../src/app.js');

describe('cart API routes', () => {
  const token = generateAccessToken({ userId: 'user_123' });

  beforeEach(() => {
    jest.clearAllMocks();
    cartServiceMock.getCart.mockResolvedValue(cartPayload);
    cartServiceMock.addItem.mockResolvedValue(cartPayload);
    cartServiceMock.updateItemQuantity.mockResolvedValue(cartPayload);
    cartServiceMock.removeItem.mockResolvedValue({ items: [], subtotal: 0, itemCount: 0 });
    cartServiceMock.clearCart.mockResolvedValue({ items: [], subtotal: 0, itemCount: 0 });
  });

  it('rejects unauthorized cart access', async () => {
    const response = await request(app).get('/api/v1/cart').expect(401);

    expect(response.body.errorCode).toBe('AUTH_REQUIRED');
  });

  it('adds an item to the cart', async () => {
    const response = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'pixel-8-pro', quantity: 1 })
      .expect(200);

    expect(response.body.data.itemCount).toBe(2);
    expect(cartServiceMock.addItem).toHaveBeenCalledWith('user_123', 'pixel-8-pro', 1);
  });

  it('merges duplicate items by delegating quantity logic to the service', async () => {
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'pixel-8-pro', quantity: 2 })
      .expect(200);

    expect(cartServiceMock.addItem).toHaveBeenCalledWith('user_123', 'pixel-8-pro', 2);
  });

  it('updates item quantity', async () => {
    await request(app)
      .patch('/api/v1/cart/items/pixel-8-pro')
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 3 })
      .expect(200);

    expect(cartServiceMock.updateItemQuantity).toHaveBeenCalledWith('user_123', 'pixel-8-pro', 3);
  });

  it('returns inventory validation errors', async () => {
    cartServiceMock.updateItemQuantity.mockRejectedValue(
      new MockCartError('Only 3 items left in stock', 'INSUFFICIENT_STOCK', 409),
    );

    const response = await request(app)
      .patch('/api/v1/cart/items/pixel-8-pro')
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 4 })
      .expect(409);

    expect(response.body.errorCode).toBe('INSUFFICIENT_STOCK');
  });

  it('removes an item from the cart', async () => {
    const response = await request(app)
      .delete('/api/v1/cart/items/pixel-8-pro')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.itemCount).toBe(0);
    expect(cartServiceMock.removeItem).toHaveBeenCalledWith('user_123', 'pixel-8-pro');
  });
});
