import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import type { Product } from '../types';

const product: Product = {
  name: 'Loop Phone Pro',
  brand: 'Infinite',
  price: 79999,
  rating: 4.8,
  productImage: '/phone.png',
  color: 'Graphite',
  stockStatus: 'in-stock',
};

const renderCard = (nextProduct: Product, onAddToCart = vi.fn()) => render(
  <MemoryRouter>
    <ProductCard product={nextProduct} onAddToCart={onAddToCart} />
  </MemoryRouter>,
);

describe('ProductCard', () => {
  test('disables add to cart when a product is out of stock', () => {
    renderCard({ ...product, stockStatus: 'out-of-stock' });

    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled();
    expect(screen.getAllByText(/out of stock/i).length).toBeGreaterThan(0);
  });

  test('calls add to cart for an available product', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    renderCard(product, onAddToCart);

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(onAddToCart).toHaveBeenCalledWith(product);
  });
});
