import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Cart from '../components/Cart/Cart';
import type { Product } from '../types';

const cartItems: Product[] = [
  { name: 'Loop Phone Pro', brand: 'Infinite', price: 79999, rating: 4.8, productImage: '/phone.png', color: 'Graphite' },
  { name: 'Arc Headphones', brand: 'Sonic', price: 12999, rating: 4.6, productImage: '/headphones.png', color: 'Black' },
];

describe('Cart', () => {
  const renderCart = (items = cartItems, onRemoveFromCart = vi.fn(), onClose = vi.fn()) => render(
    <MemoryRouter>
      <Cart cartItems={items} onClose={onClose} onRemoveFromCart={onRemoveFromCart} language="en" />
    </MemoryRouter>,
  );

  test('shows cart total and removes items', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();

    renderCart(cartItems, handleRemove);

    expect(screen.getByText('₹92998.00')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /remove loop phone pro/i }));

    expect(handleRemove).toHaveBeenCalledWith(0);
  });

  test('links to route-based checkout from cart', () => {
    renderCart();

    expect(screen.getByRole('link', { name: /proceed to checkout/i })).toHaveAttribute('href', '/checkout');
  });

  test('closes the cart with Escape', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderCart([], vi.fn(), handleClose);
    await user.keyboard('{Escape}');

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
