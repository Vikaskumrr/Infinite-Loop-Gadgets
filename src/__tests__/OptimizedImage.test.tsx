import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OptimizedImage from '../components/OptimizedImage/OptimizedImage';

describe('OptimizedImage', () => {
  test('tries a proxy before swapping to a fallback image when the product image fails', () => {
    render(<OptimizedImage src="https://example.com/missing.jpg" fallbackSrc="/fallback.svg" alt="Test product" />);

    const image = screen.getByRole('img', { name: /test product/i });
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', expect.stringContaining('images.weserv.nl'));

    fireEvent.error(image);

    expect(image).toHaveAttribute('src', '/fallback.svg');
  });
});
