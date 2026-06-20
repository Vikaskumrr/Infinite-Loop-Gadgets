import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import { generateAccessToken } from '../src/auth/token.js';

const authRepositoryMock = {
  findUserById: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
};

const adminServiceMock = {
  getDashboard: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  getProducts: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  createProduct: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  updateProduct: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  deleteProduct: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  getInventory: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  updateInventory: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  getOrders: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  getOrderById: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  updateOrderStatus: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
};

class MockAdminError extends Error {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

jest.unstable_mockModule('../src/auth/authRepository.js', () => ({
  authRepository: authRepositoryMock,
}));

jest.unstable_mockModule('../src/admin/adminService.js', () => ({
  adminService: adminServiceMock,
  AdminError: MockAdminError,
}));

const { app } = await import('../src/app.js');

describe('admin API routes', () => {
  const adminToken = generateAccessToken({ userId: 'admin_123' });
  const customerToken = generateAccessToken({ userId: 'user_123' });

  beforeEach(() => {
    jest.clearAllMocks();
    authRepositoryMock.findUserById.mockImplementation(async (...args: unknown[]) => {
      const id = String(args[0]);
      return {
      id,
      name: id === 'admin_123' ? 'Admin' : 'Customer',
      email: `${id}@example.com`,
      passwordHash: 'hash',
      role: id === 'admin_123' ? 'ADMIN' : 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date(),
      };
    });
    adminServiceMock.getDashboard.mockResolvedValue({ productCount: 2, orderCount: 1, lowStockItems: [], recentOrders: [] });
    adminServiceMock.getProducts.mockResolvedValue([]);
    adminServiceMock.createProduct.mockResolvedValue({ id: 'prod_1', name: 'Loop Phone Ultra' });
    adminServiceMock.updateProduct.mockResolvedValue({ id: 'prod_1', name: 'Loop Phone Ultra' });
    adminServiceMock.deleteProduct.mockResolvedValue(undefined);
    adminServiceMock.getInventory.mockResolvedValue([]);
    adminServiceMock.updateInventory.mockResolvedValue({ productId: 'prod_1', stockQuantity: 8 });
    adminServiceMock.getOrders.mockResolvedValue([]);
    adminServiceMock.getOrderById.mockResolvedValue({ id: 'ord_1', status: 'confirmed' });
    adminServiceMock.updateOrderStatus.mockResolvedValue({ id: 'ord_1', status: 'processing' });
  });

  it('denies customers from admin routes', async () => {
    const response = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);

    expect(response.body.errorCode).toBe('ADMIN_REQUIRED');
  });

  it('allows admins to load the dashboard', async () => {
    const response = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.data.dashboard.productCount).toBe(2);
  });

  it('creates a product', async () => {
    await request(app)
      .post('/api/v1/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Loop Phone Ultra',
        description: 'Flagship gadget',
        price: 99999,
        brand: 'Infinite',
        category: 'Phones',
        images: ['https://example.com/phone.png'],
        specifications: { Display: 'OLED' },
        features: ['AI camera'],
        availabilityStatus: 'IN_STOCK',
        stockQuantity: 12,
      })
      .expect(201);

    expect(adminServiceMock.createProduct).toHaveBeenCalled();
  });

  it('updates inventory', async () => {
    const response = await request(app)
      .patch('/api/v1/admin/inventory/prod_1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ stockQuantity: 3, availabilityStatus: 'OUT_OF_STOCK' })
      .expect(200);

    expect(adminServiceMock.updateInventory).toHaveBeenCalledWith('prod_1', {
      stockQuantity: 3,
      availabilityStatus: 'OUT_OF_STOCK',
    });
    expect(response.body.data.inventoryItem.stockQuantity).toBe(8);
  });

  it('updates order status', async () => {
    await request(app)
      .patch('/api/v1/admin/orders/ord_1/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'PROCESSING' })
      .expect(200);

    expect(adminServiceMock.updateOrderStatus).toHaveBeenCalledWith('ord_1', { status: 'PROCESSING' });
  });
});
