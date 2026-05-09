import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import type { Product } from '../types';

const mockProducts: Product[] = [
  { name: 'Loop Phone Pro', brand: 'Infinite', price: 79999, rating: 4.8, productImage: '/phone.png', color: 'Graphite' },
];

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('navigation', () => {
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

  test('preserves the account route', async () => {
    renderAt('/account');

    expect(await screen.findByRole('heading', { name: /account details/i })).toBeInTheDocument();
  });

  test('preserves the about route', async () => {
    renderAt('/about');

    expect(await screen.findByRole('heading', { name: /about our company/i })).toBeInTheDocument();
  });

  test('preserves the products placeholder route', async () => {
    renderAt('/products');

    expect(await screen.findByRole('heading', { name: /page under construction/i })).toBeInTheDocument();
  });
});
