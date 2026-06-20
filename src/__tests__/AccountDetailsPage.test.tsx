import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AccountDetailsPage from '../components/AccountDetailsPage/AccountDetailsPage';
import { AuthContext } from '../auth/AuthContextValue';
import type { Order, UserProfile } from '../types';

const mockUseOrders = vi.fn();

vi.mock('../orders/hooks/useOrders', () => ({
  useOrders: () => mockUseOrders(),
}));

const defaultProfile: UserProfile = {
  id: 'guest',
  name: 'Guest Shopper',
  email: 'guest@example.com',
  mobileNumber: '',
  address: '',
  createdAt: new Date().toISOString(),
};

const sampleOrders: Order[] = [
  {
    id: 'ord_1',
    createdAt: new Date('2026-06-21T10:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-06-21T10:00:00.000Z').toISOString(),
    totalAmount: 149999,
    status: 'confirmed',
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
  },
];

describe('AccountDetailsPage', () => {
  beforeEach(() => {
    mockUseOrders.mockReturnValue({
      orders: [],
      loading: false,
      error: null,
      reload: vi.fn(),
      checkout: vi.fn(),
    });
  });

  test('asks guests to sign in for order history', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: null, token: null, loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() }}>
          <AccountDetailsPage profile={defaultProfile} onProfileChange={vi.fn()} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/sign in to unlock order history/i)).toBeInTheDocument();
  });

  test('renders authenticated order history from the API', () => {
    mockUseOrders.mockReturnValue({
      orders: sampleOrders,
      loading: false,
      error: null,
      reload: vi.fn(),
      checkout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { id: 'user_1', name: 'Vikas', email: 'vikas@example.com', role: 'CUSTOMER' }, token: 'token', loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() }}>
          <AccountDetailsPage profile={defaultProfile} onProfileChange={vi.fn()} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('ord_1')).toBeInTheDocument();
    expect(screen.getByText(/₹149999\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/2 items/i)).toHaveLength(2);
  });
});
