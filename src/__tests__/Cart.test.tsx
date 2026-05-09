import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cart from '../components/Cart/Cart';
import type { Product } from '../types';

const cartItems: Product[] = [
  { name: 'Loop Phone Pro', brand: 'Infinite', price: 79999, rating: 4.8, productImage: '/phone.png', color: 'Graphite' },
  { name: 'Arc Headphones', brand: 'Sonic', price: 12999, rating: 4.6, productImage: '/headphones.png', color: 'Black' },
];

describe('Cart', () => {
  test('shows cart total and removes items', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();

    render(<Cart cartItems={cartItems} onClose={vi.fn()} onRemoveFromCart={handleRemove} language="en" />);

    expect(screen.getByText('₹92998.00')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /remove loop phone pro/i }));

    expect(handleRemove).toHaveBeenCalledWith(0);
  });

  test('opens demo checkout from cart', async () => {
    const user = userEvent.setup();

    render(<Cart cartItems={cartItems} onClose={vi.fn()} onRemoveFromCart={vi.fn()} language="en" />);
    await user.click(screen.getByRole('button', { name: /checkout/i }));

    expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument();
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
  });

  test('closes the cart with Escape', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<Cart cartItems={[]} onClose={handleClose} onRemoveFromCart={vi.fn()} language="en" />);
    await user.keyboard('{Escape}');

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
