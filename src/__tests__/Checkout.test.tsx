import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from '../components/Checkout/Checkout';
import type { CartItem } from '../cart/types';

const cartItems: CartItem[] = [
  {
    productId: 'loop-phone-pro',
    quantity: 1,
    unitPrice: 79999,
    subtotal: 79999,
    availabilityStatus: 'available',
    stockQuantity: 8,
    product: {
      id: 'loop-phone-pro',
      slug: 'loop-phone-pro',
      name: 'Loop Phone Pro',
      brand: 'Infinite',
      price: 79999,
      rating: 4.8,
      productImage: '/phone.png',
      color: 'Graphite',
    },
  },
];

describe('Checkout', () => {
  test('creates an order from cart items', async () => {
    const user = userEvent.setup();
    const handleSubmitOrder = vi.fn().mockResolvedValue({
      id: 'ord_123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalAmount: 79999,
      status: 'confirmed',
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.unitPrice,
        product: item.product,
      })),
    });

    render(
      <Checkout
        cartItems={cartItems}
        onClose={vi.fn()}
        language="en"
        onSubmitOrder={handleSubmitOrder}
      />,
    );

    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(await screen.findByText(/thank you for your purchase/i)).toBeInTheDocument();
    expect(handleSubmitOrder).toHaveBeenCalledWith({
      email: '',
      fullName: '',
      shippingAddress: '',
      paymentMethod: '',
      couponCode: '',
    });
    expect(screen.getByText(/ord_123/i)).toBeInTheDocument();
  });

  test('renders order failures inline', async () => {
    const user = userEvent.setup();
    const handleSubmitOrder = vi.fn().mockRejectedValue(new Error('Inventory changed'));

    render(
      <Checkout
        cartItems={cartItems}
        onClose={vi.fn()}
        language="en"
        onSubmitOrder={handleSubmitOrder}
      />,
    );

    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/inventory changed/i);
  });

  test('closes with Escape', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<Checkout cartItems={cartItems} onClose={handleClose} language="en" />);
    await user.keyboard('{Escape}');

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
