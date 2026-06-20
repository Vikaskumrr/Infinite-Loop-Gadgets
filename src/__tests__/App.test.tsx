import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import { CartProvider } from '../cart/CartProvider';
import App from '../App';
import type { Product } from '../types';

const mockProducts: Product[] = [
  {
    name: 'Loop Phone Pro',
    brand: 'Infinite',
    price: 79999,
    rating: 4.8,
    productImage: 'https://example.com/phone.jpg',
    color: 'Graphite',
    description: 'A flagship phone for power users.',
    specifications: { Storage: '256 GB' },
  },
];

const renderApp = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>,
  );
};

describe('App', () => {
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

  test('renders the product storefront from the API feed', async () => {
    renderApp();

    expect(await screen.findByRole('heading', { name: /loop phone pro/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Graphite')).toBeInTheDocument();
  });

  test('opens the cart drawer from the header', async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => expect(screen.getByRole('heading', { name: /loop phone pro/i, level: 1 })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /open cart/i }));

    expect(screen.getByRole('heading', { name: /shopping cart/i })).toBeInTheDocument();
  });

  test('falls back to the local enriched catalog when the API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    renderApp();

    expect(await screen.findByRole('heading', { name: /google pixel 8 pro/i, level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('filters to an empty search state without losing navigation', async () => {
    const user = userEvent.setup();
    renderApp();

    await screen.findByRole('heading', { name: /loop phone pro/i, level: 1 });
    await user.type(screen.getByRole('textbox', { name: /search products/i }), 'not-a-product');

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open cart/i })).toBeInTheDocument();
  });
});
