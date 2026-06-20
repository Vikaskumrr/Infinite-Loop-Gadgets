import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { AuthContext } from '../auth/AuthContextValue';
import { CartProvider } from '../cart/CartProvider';
import { useCart } from '../cart/hooks/useCart';
import { cartService } from '../cart/cartService';

vi.mock('../cart/cartService', () => ({
  cartService: {
    getCart: vi.fn(),
    addItem: vi.fn(),
    updateQuantity: vi.fn(),
    removeItem: vi.fn(),
    clearCart: vi.fn(),
  },
}));

const Probe = () => {
  const { cart, loading, cartMigrationPrompt } = useCart();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="count">{String(cart.itemCount)}</span>
      <span data-testid="migration-open">{String(cartMigrationPrompt.open)}</span>
    </div>
  );
};

const renderWithAuth = (authValue: React.ContextType<typeof AuthContext>) =>
  render(
    <AuthContext.Provider value={authValue}>
      <CartProvider>
        <Probe />
      </CartProvider>
    </AuthContext.Provider>,
  );

describe('CartProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('loads guest cart from local storage when signed out', async () => {
    localStorage.setItem('ilg.cart', JSON.stringify([
      { id: 'pixel-8-pro', name: 'Google Pixel 8 Pro', brand: 'Google', price: 69999, rating: 4.7, productImage: '/pixel.png', color: 'Obsidian' },
      { id: 'pixel-8-pro', name: 'Google Pixel 8 Pro', brand: 'Google', price: 69999, rating: 4.7, productImage: '/pixel.png', color: 'Obsidian' },
    ]));

    renderWithAuth({
      user: null,
      token: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('migration-open')).toHaveTextContent('false');
  });

  test('loads authenticated cart from the API', async () => {
    vi.mocked(cartService.getCart).mockResolvedValue({
      items: [],
      subtotal: 0,
      itemCount: 3,
    });

    renderWithAuth({
      user: { id: 'user-1', name: 'Ada', email: 'ada@example.com' },
      token: 'session-token',
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('3'));
  });

  test('opens cart migration prompt when guest cart exists after login', async () => {
    localStorage.setItem('ilg.cart', JSON.stringify([
      { id: 'pixel-8-pro', name: 'Google Pixel 8 Pro', brand: 'Google', price: 69999, rating: 4.7, productImage: '/pixel.png', color: 'Obsidian' },
    ]));
    vi.mocked(cartService.getCart).mockResolvedValue({
      items: [],
      subtotal: 0,
      itemCount: 0,
    });

    renderWithAuth({
      user: { id: 'user-1', name: 'Ada', email: 'ada@example.com' },
      token: 'session-token',
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    await waitFor(() => expect(screen.getByTestId('migration-open')).toHaveTextContent('true'));
  });
});
