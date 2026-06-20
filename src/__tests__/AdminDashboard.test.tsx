import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContextValue';
import AdminDashboard from '../admin/AdminDashboard';

const getDashboard = vi.fn();

vi.mock('../admin/adminService', () => ({
  adminService: {
    getDashboard: (...args: unknown[]) => getDashboard(...args),
  },
}));

describe('AdminDashboard', () => {
  test('renders admin metrics', async () => {
    getDashboard.mockResolvedValue({
      productCount: 24,
      orderCount: 6,
      lowStockItems: [],
      recentOrders: [],
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { id: 'admin_1', name: 'Admin', email: 'admin@example.com', role: 'ADMIN' }, token: 'token', loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() }}>
          <AdminDashboard />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('24')).toBeInTheDocument());
    expect(screen.getByText('Orders')).toBeInTheDocument();
  });
});
