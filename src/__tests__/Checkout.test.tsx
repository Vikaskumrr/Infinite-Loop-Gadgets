import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from '../components/Checkout/Checkout';
import type { Product } from '../types';

const products: Product[] = [
  { name: 'Loop Phone Pro', brand: 'Infinite', price: 79999, rating: 4.8, productImage: '/phone.png', color: 'Graphite' },
];

describe('Checkout', () => {
  test('places a demo order without leaving the modal', async () => {
    const user = userEvent.setup();
    const handleOrderPlaced = vi.fn();

    render(<Checkout products={products} onClose={vi.fn()} language="en" onOrderPlaced={handleOrderPlaced} />);
    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(await screen.findByText(/thank you for your purchase/i)).toBeInTheDocument();
    expect(handleOrderPlaced).toHaveBeenCalledWith(expect.objectContaining({
      items: products,
      status: 'placed',
      total: 79999,
    }));
  });

  test('closes with Escape', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<Checkout products={products} onClose={handleClose} language="en" />);
    await user.keyboard('{Escape}');

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
