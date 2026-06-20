import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useWishlist } from '../user/hooks/useWishlist';
import { userFeatureService } from '../user/userFeatureService';

vi.mock('../user/userFeatureService', () => ({
  userFeatureService: {
    getWishlist: vi.fn(),
    addWishlistItem: vi.fn(),
    removeWishlistItem: vi.fn(),
  },
}));

const WishlistProbe: React.FC<{ token: string | null }> = ({ token }) => {
  const { wishlistIds, loading, error } = useWishlist(token);

  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="ids">{wishlistIds.join(',')}</span>
      <span data-testid="error">{error || ''}</span>
    </div>
  );
};

describe('useWishlist', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('loads wishlist ids for a logged-in user from the API', async () => {
    vi.mocked(userFeatureService.getWishlist).mockResolvedValue([
      {
        id: 'pixel-8-pro',
        name: 'Google Pixel 8 Pro',
        brand: 'Google',
        price: 69999,
        rating: 4.7,
        productImage: 'https://example.com/pixel.png',
        color: 'Obsidian',
      },
    ]);

    render(<WishlistProbe token="session-token" />);

    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('pixel-8-pro'));
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  test('falls back to local wishlist ids when the API request fails', async () => {
    localStorage.setItem('ilg.wishlist', JSON.stringify(['guest-phone']));
    vi.mocked(userFeatureService.getWishlist).mockRejectedValue(new Error('API unavailable'));

    render(<WishlistProbe token="session-token" />);

    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('guest-phone'));
    expect(screen.getByTestId('error')).toHaveTextContent(/api unavailable/i);
  });
});
