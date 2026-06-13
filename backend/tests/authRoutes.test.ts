import { jest, describe, expect, it, beforeEach } from '@jest/globals';
import request from 'supertest';
import { generateAccessToken } from '../src/auth/token.js';

const user = {
  id: 'user_123',
  name: 'Ada Shopper',
  email: 'ada@example.com',
};

class MockAuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errorCode: string,
  ) {
    super(message);
  }
}

const authServiceMock = {
  register: jest.fn(() => Promise.resolve({ user, token: 'register-token' })),
  login: jest.fn(() => Promise.resolve({ user, token: 'login-token' })),
  getCurrentUser: jest.fn(() => Promise.resolve(user)),
};

jest.unstable_mockModule('../src/auth/authService.js', () => ({
  authService: authServiceMock,
  AuthError: MockAuthError,
}));

const { app } = await import('../src/app.js');

describe('auth API routes', () => {
  beforeEach(() => {
    authServiceMock.register.mockReset();
    authServiceMock.login.mockReset();
    authServiceMock.getCurrentUser.mockReset();
    authServiceMock.register.mockResolvedValue({ user, token: 'register-token' });
    authServiceMock.login.mockResolvedValue({ user, token: 'login-token' });
    authServiceMock.getCurrentUser.mockResolvedValue(user);
  });

  it('registers a user without returning password data', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Ada Shopper', email: 'ada@example.com', password: 'secure-pass' })
      .expect(201);

    expect(response.body.data).toEqual({ user, token: 'register-token' });
    expect(JSON.stringify(response.body)).not.toContain('password');
  });

  it('rejects duplicate email registration', async () => {
    authServiceMock.register.mockRejectedValue(new MockAuthError('Email is already registered', 409, 'EMAIL_ALREADY_REGISTERED'));

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Ada Shopper', email: 'ada@example.com', password: 'secure-pass' })
      .expect(409);

    expect(response.body.errorCode).toBe('EMAIL_ALREADY_REGISTERED');
  });

  it('logs in with valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'ada@example.com', password: 'secure-pass' })
      .expect(200);

    expect(response.body.data).toEqual({ user, token: 'login-token' });
  });

  it('rejects invalid password', async () => {
    authServiceMock.login.mockRejectedValue(new MockAuthError('Invalid email or password', 401, 'INVALID_CREDENTIALS'));

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'ada@example.com', password: 'wrong-pass' })
      .expect(401);

    expect(response.body.errorCode).toBe('INVALID_CREDENTIALS');
  });

  it('rejects protected current-user route without token', async () => {
    const response = await request(app).get('/api/v1/auth/me').expect(401);

    expect(response.body.errorCode).toBe('AUTH_REQUIRED');
  });

  it('returns current user with a valid token', async () => {
    const token = generateAccessToken({ userId: user.id });
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.user).toEqual(user);
    expect(authServiceMock.getCurrentUser).toHaveBeenCalledWith(user.id);
  });
});
