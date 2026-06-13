import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ComparePage from '../components/ComparePage/ComparePage';
import { getProductId } from '../utils/productIdentity';
import type { Product } from '../types';

const products: Product[] = [
  { name: 'Loop Phone Pro', brand: 'Infinite', price: 79999, rating: 4.8, productImage: '/phone.png', color: 'Graphite', category: 'Electronics', subcategory: 'Smartphones' },
  { name: 'Arc Headphones', brand: 'Sonic', price: 12999, rating: 4.6, productImage: '/headphones.png', color: 'Black', category: 'Accessories', subcategory: 'Headphones' },
];

describe('ComparePage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ record: { products } }),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('renders selected products in a comparison table', async () => {
    render(
      <MemoryRouter>
        <ComparePage
          compareIds={[getProductId(products[0]), getProductId(products[1])]}
          onAddToCart={vi.fn()}
          onCompareToggle={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: /gadget showdown/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /loop phone pro/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /arc headphones/i })).toBeInTheDocument();
  });
});
