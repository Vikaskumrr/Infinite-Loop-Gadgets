import React from 'react';
import type { Product } from '../../types';
import { getProductId } from '../../utils/productIdentity';
import { readStoredJson, writeStoredJson } from '../../utils/storage';
import { userFeatureService } from '../userFeatureService';

const STORAGE_KEY = 'ilg.wishlist';

const readLocalIds = (): string[] => readStoredJson<string[]>(STORAGE_KEY, []);

export const useWishlist = (token: string | null) => {
  const [wishlistIds, setWishlistIds] = React.useState<string[]>(() => readLocalIds());
  const [loading, setLoading] = React.useState(Boolean(token));
  const [error, setError] = React.useState<string | null>(null);
  const [usingRemote, setUsingRemote] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      setWishlistIds(readLocalIds());
      setUsingRemote(false);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    void userFeatureService.getWishlist(token)
      .then((products) => {
        if (!isMounted) return;
        setWishlistIds(products.map((product) => getProductId(product)));
        setUsingRemote(true);
        setError(null);
      })
      .catch((caughtError) => {
        if (!isMounted) return;
        setWishlistIds(readLocalIds());
        setUsingRemote(false);
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to load wishlist.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const toggleWishlist = React.useCallback(async (product: Product) => {
    const productId = getProductId(product);

    if (!token || !usingRemote) {
      setWishlistIds((currentIds) => {
        const nextIds = currentIds.includes(productId)
          ? currentIds.filter((id) => id !== productId)
          : [productId, ...currentIds];
        writeStoredJson(STORAGE_KEY, nextIds);
        return nextIds;
      });
      return;
    }

    const products = wishlistIds.includes(productId)
      ? await userFeatureService.removeWishlistItem(token, productId)
      : await userFeatureService.addWishlistItem(token, productId);

    setWishlistIds(products.map((item) => getProductId(item)));
  }, [token, usingRemote, wishlistIds]);

  const importWishlist = React.useCallback(async (ids: string[]) => {
    if (!token) return;

    const uniqueIds = Array.from(new Set(ids));
    for (const id of uniqueIds) {
      await userFeatureService.addWishlistItem(token, id);
    }

    const products = await userFeatureService.getWishlist(token);
    setWishlistIds(products.map((product) => getProductId(product)));
    setUsingRemote(true);
  }, [token]);

  return {
    wishlistIds,
    loading,
    error,
    toggleWishlist,
    importWishlist,
    usingRemote,
  };
};
