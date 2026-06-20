import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import { CartProvider } from '../cart/CartProvider';
import App from '../App';
import type { Product } from '../types';

const mockProducts: Product[] = [
  { name: 'Loop Phone Pro', brand: 'Infinite', price: 79999, rating: 4.8, productImage: '/phone.png', color: 'Graphite' },
];

const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
};

describe('responsive smoke coverage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ record: { products: mockProducts } }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  test.each([
    ['mobile', 390, 844],
    ['tablet', 820, 1180],
    ['desktop', 1440, 900],
    ['ultrawide', 1920, 1080],
  ])('renders primary shopping controls at %s size', async (_label, width, height) => {
    setViewport(width, height);

    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: /loop phone pro/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /search products/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open cart/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /full details/i })).toBeInTheDocument();
  });
});
