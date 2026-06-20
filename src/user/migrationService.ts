import { readStoredJson, removeStoredItem, writeStoredJson } from '../utils/storage';

const WISHLIST_KEY = 'ilg.wishlist';
const COMPARE_KEY = 'ilg.compare';
const RECENTLY_VIEWED_KEY = 'ilg.recentlyViewed';
const SKIPPED_KEY = 'ilg.userFeatureMigrationSkipped';

export interface GuestFeatureData {
  wishlistIds: string[];
  compareIds: string[];
  recentlyViewedIds: string[];
}

export interface GuestFeatureMigrationResult {
  importedKeys: Array<keyof GuestFeatureData>;
  failedKeys: Array<keyof GuestFeatureData>;
}

const normalizeIds = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];

export const readGuestFeatureData = (): GuestFeatureData => ({
  wishlistIds: normalizeIds(readStoredJson<unknown>(WISHLIST_KEY, [])),
  compareIds: normalizeIds(readStoredJson<unknown>(COMPARE_KEY, [])),
  recentlyViewedIds: normalizeIds(readStoredJson<unknown>(RECENTLY_VIEWED_KEY, [])),
});

export const hasGuestFeatureData = (data: GuestFeatureData): boolean =>
  data.wishlistIds.length > 0 || data.compareIds.length > 0 || data.recentlyViewedIds.length > 0;

export const markMigrationSkipped = (userId: string): void => {
  const skipped = readStoredJson<string[]>(SKIPPED_KEY, []);
  if (!skipped.includes(userId)) {
    writeStoredJson(SKIPPED_KEY, [...skipped, userId]);
  }
};

export const clearMigrationSkipped = (userId: string): void => {
  const skipped = readStoredJson<string[]>(SKIPPED_KEY, []);
  writeStoredJson(SKIPPED_KEY, skipped.filter((id) => id !== userId));
};

export const shouldPromptForMigration = (userId: string, data: GuestFeatureData): boolean => {
  if (!hasGuestFeatureData(data)) {
    return false;
  }

  const skipped = readStoredJson<string[]>(SKIPPED_KEY, []);
  return !skipped.includes(userId);
};

export const clearMigratedGuestFeatureKeys = (result: GuestFeatureMigrationResult): void => {
  if (result.importedKeys.includes('wishlistIds')) {
    removeStoredItem(WISHLIST_KEY);
  }
  if (result.importedKeys.includes('compareIds')) {
    removeStoredItem(COMPARE_KEY);
  }
  if (result.importedKeys.includes('recentlyViewedIds')) {
    removeStoredItem(RECENTLY_VIEWED_KEY);
  }
};

export const runGuestDataMigration = async (
  data: GuestFeatureData,
  actions: {
    importWishlist: (ids: string[]) => Promise<void>;
    importCompare: (ids: string[]) => Promise<void>;
    importRecentlyViewed: (ids: string[]) => Promise<void>;
  },
): Promise<GuestFeatureMigrationResult> => {
  const importedKeys: Array<keyof GuestFeatureData> = [];
  const failedKeys: Array<keyof GuestFeatureData> = [];

  const steps: Array<[keyof GuestFeatureData, string[], (ids: string[]) => Promise<void>]> = [
    ['wishlistIds', data.wishlistIds, actions.importWishlist],
    ['compareIds', data.compareIds, actions.importCompare],
    ['recentlyViewedIds', data.recentlyViewedIds, actions.importRecentlyViewed],
  ];

  for (const [key, ids, action] of steps) {
    if (ids.length === 0) {
      importedKeys.push(key);
      continue;
    }

    try {
      await action(ids);
      importedKeys.push(key);
    } catch {
      failedKeys.push(key);
    }
  }

  return {
    importedKeys,
    failedKeys,
  };
};
