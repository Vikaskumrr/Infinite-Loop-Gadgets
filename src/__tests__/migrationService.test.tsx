import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import UserDataMigrationPrompt from '../components/UserDataMigrationPrompt/UserDataMigrationPrompt';
import {
  clearMigratedGuestFeatureKeys,
  markMigrationSkipped,
  readGuestFeatureData,
  runGuestDataMigration,
  shouldPromptForMigration,
} from '../user/migrationService';

describe('user feature migration', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test('shows migration prompt copy when guest data exists', () => {
    render(
      <UserDataMigrationPrompt
        wishlistCount={2}
        compareCount={1}
        recentlyViewedCount={3}
        loading={false}
        error={null}
        onImport={() => undefined}
        onSkip={() => undefined}
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/move your saved products into this account/i)).toBeInTheDocument();
  });

  test('runs local guest data migration successfully and clears imported keys', async () => {
    localStorage.setItem('ilg.wishlist', JSON.stringify(['wish-1']));
    localStorage.setItem('ilg.compare', JSON.stringify(['compare-1']));
    localStorage.setItem('ilg.recentlyViewed', JSON.stringify(['recent-1', 'recent-2']));

    const wishlistImport = vi.fn().mockResolvedValue(undefined);
    const compareImport = vi.fn().mockResolvedValue(undefined);
    const recentlyViewedImport = vi.fn().mockResolvedValue(undefined);
    const guestData = readGuestFeatureData();

    const result = await runGuestDataMigration(guestData, {
      importWishlist: wishlistImport,
      importCompare: compareImport,
      importRecentlyViewed: recentlyViewedImport,
    });

    clearMigratedGuestFeatureKeys(result);

    expect(result.failedKeys).toEqual([]);
    expect(wishlistImport).toHaveBeenCalledWith(['wish-1']);
    expect(compareImport).toHaveBeenCalledWith(['compare-1']);
    expect(recentlyViewedImport).toHaveBeenCalledWith(['recent-1', 'recent-2']);
    expect(localStorage.getItem('ilg.wishlist')).toBeNull();
    expect(localStorage.getItem('ilg.compare')).toBeNull();
    expect(localStorage.getItem('ilg.recentlyViewed')).toBeNull();
  });

  test('skipped users are not prompted again until data changes', () => {
    localStorage.setItem('ilg.wishlist', JSON.stringify(['wish-1']));
    const guestData = readGuestFeatureData();

    expect(shouldPromptForMigration('user-1', guestData)).toBe(true);
    markMigrationSkipped('user-1');
    expect(shouldPromptForMigration('user-1', guestData)).toBe(false);
  });
});
