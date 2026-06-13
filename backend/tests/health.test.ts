import request from 'supertest';
import { app } from '../src/app.js';

describe('health endpoint', () => {
  it('returns API health status', async () => {
    const response = await request(app).get('/api/v1/health').expect(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        status: 'healthy',
      },
      message: 'API is running',
    });
  });
});
