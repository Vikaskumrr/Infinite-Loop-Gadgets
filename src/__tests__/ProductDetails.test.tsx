import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductDetails from '../components/ProductDetails/ProductDetails';
import type { Product } from '../types';

const product: Product = {
  id: 'loop-phone-pro',
  slug: 'loop-phone-pro',
  name: 'Loop Phone Pro',
  brand: 'Infinite',
  price: 79999,
  rating: 4.8,
  reviewCount: 24,
  productImage: '/phone.png',
  images: ['/phone.png', '/phone-side.png'],
  color: 'Graphite',
  category: 'Electronics',
  subcategory: 'Smartphones',
  stockStatus: 'out-of-stock',
  availabilityStatus: 'out-of-stock',
  priceStatus: 'verified',
  description: 'A capable phone.',
  specifications: {
    Display: '6.7-inch OLED',
    Processor: 'Loop X1',
    Battery: '5000 mAh',
  },
};

describe('ProductDetails', () => {
  test('renders grouped specifications and disables purchase actions when unavailable', () => {
    render(
      <ProductDetails
        product={product}
        onClose={vi.fn()}
        onAddToCart={vi.fn()}
        onBuyNow={vi.fn()}
        language="en"
        presentation="page"
      />,
    );

    expect(screen.getByRole('heading', { name: /loop phone pro/i })).toBeInTheDocument();
    expect(screen.getAllByText(/out of stock/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /display/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /performance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
    expect(screen.getAllByRole('button', { name: /buy now/i }).every((button) => button.hasAttribute('disabled'))).toBe(true);
  });
});
