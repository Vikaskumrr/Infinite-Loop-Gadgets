import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import { generateAccessToken } from '../src/auth/token.js';

const sampleOrder = {
  id: 'ord_123',
  status: 'confirmed',
  totalAmount: 149999,
  createdAt: new Date('2026-06-21T10:00:00.000Z').toISOString(),
  updatedAt: new Date('2026-06-21T10:05:00.000Z').toISOString(),
  items: [
    {
      id: 'line_1',
      productId: 'pixel-8-pro',
      quantity: 2,
      price: 74999.5,
      product: {
        id: 'pixel-8-pro',
        slug: 'pixel-8-pro',
        name: 'Google Pixel 8 Pro',
        brand: 'Google',
        price: 74999.5,
        rating: 4.7,
        productImage: 'https://example.com/pixel.png',
        color: 'Obsidian',
      },
    },
  ],
};

class MockOrderError extends Error {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

const orderServiceMock = {
  checkout: jest.fn<() => Promise<typeof sampleOrder>>(() => Promise.resolve(sampleOrder)),
  getOrders: jest.fn<() => Promise<typeof sampleOrder[]>>(() => Promise.resolve([sampleOrder])),
  getOrderById: jest.fn<(userId: string, id: string) => Promise<typeof sampleOrder | null>>(() => Promise.resolve(sampleOrder)),
};

jest.unstable_mockModule('../src/orders/orderService.js', () => ({
  orderService: orderServiceMock,
  OrderError: MockOrderError,
}));

const { app } = await import('../src/app.js');

describe('order API routes', () => {
  const token = generateAccessToken({ userId: 'user_123' });

  beforeEach(() => {
    jest.clearAllMocks();
    orderServiceMock.checkout.mockResolvedValue(sampleOrder);
    orderServiceMock.getOrders.mockResolvedValue([sampleOrder]);
    orderServiceMock.getOrderById.mockResolvedValue(sampleOrder);
  });

  it('rejects unauthorized order access', async () => {
    const response = await request(app).get('/api/v1/orders').expect(401);
    expect(response.body.errorCode).toBe('AUTH_REQUIRED');
  });

  it('rejects checkout for an empty cart when the service reports it', async () => {
    orderServiceMock.checkout.mockRejectedValue(
      new MockOrderError('Your cart is empty', 'EMPTY_CART', 400),
    );

    const response = await request(app)
      .post('/api/v1/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(response.body.errorCode).toBe('EMPTY_CART');
  });

  it('creates an order and returns the backend price snapshot', async () => {
    const response = await request(app)
      .post('/api/v1/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'vikas@example.com',
        fullName: 'Vikas Kumar',
        shippingAddress: 'Bangalore',
        paymentMethod: 'Demo card',
      })
      .expect(201);

    expect(orderServiceMock.checkout).toHaveBeenCalledWith('user_123');
    expect(response.body.data.order.totalAmount).toBe(149999);
    expect(response.body.data.order.items).toHaveLength(1);
  });

  it('returns only the authenticated user order collection', async () => {
    const response = await request(app)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(orderServiceMock.getOrders).toHaveBeenCalledWith('user_123');
    expect(response.body.data.orders[0].id).toBe('ord_123');
  });

  it('returns a single order by id for the current user', async () => {
    const response = await request(app)
      .get('/api/v1/orders/ord_123')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(orderServiceMock.getOrderById).toHaveBeenCalledWith('user_123', 'ord_123');
    expect(response.body.data.order.id).toBe('ord_123');
  });

  it('hides orders that do not belong to the current user', async () => {
    orderServiceMock.getOrderById.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/v1/orders/ord_missing')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(response.body.errorCode).toBe('ORDER_NOT_FOUND');
  });
});
