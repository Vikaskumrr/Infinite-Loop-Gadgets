import React from 'react';
import type { Product } from '../../types';
import { getProductId } from '../../utils/productIdentity';
import { readStoredJson, writeStoredJson } from '../../utils/storage';
import { userFeatureService } from '../userFeatureService';

const STORAGE_KEY = 'ilg.recentlyViewed';
const LOCAL_LIMIT = 8;

const readLocalIds = (): string[] => readStoredJson<string[]>(STORAGE_KEY, []);

export const useRecentlyViewed = (token: string | null) => {
  const [recentlyViewedIds, setRecentlyViewedIds] = React.useState<string[]>(() => readLocalIds());
  const [loading, setLoading] = React.useState(Boolean(token));
  const [error, setError] = React.useState<string | null>(null);
  const [usingRemote, setUsingRemote] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      setRecentlyViewedIds(readLocalIds());
      setUsingRemote(false);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    void userFeatureService.getRecentlyViewed(token)
      .then((products) => {
        if (!isMounted) return;
        setRecentlyViewedIds(products.map((product) => getProductId(product)));
        setUsingRemote(true);
        setError(null);
      })
      .catch((caughtError) => {
        if (!isMounted) return;
        setRecentlyViewedIds(readLocalIds());
        setUsingRemote(false);
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to load recently viewed products.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const trackRecentlyViewed = React.useCallback(async (product: Product) => {
    const productId = getProductId(product);

    if (!token || !usingRemote) {
      setRecentlyViewedIds((currentIds) => {
        const nextIds = [productId, ...currentIds.filter((id) => id !== productId)].slice(0, LOCAL_LIMIT);
        writeStoredJson(STORAGE_KEY, nextIds);
        return nextIds;
      });
      return;
    }

    const products = await userFeatureService.addRecentlyViewedItem(token, productId);
    setRecentlyViewedIds(products.map((item) => getProductId(item)));
  }, [token, usingRemote]);

  const importRecentlyViewed = React.useCallback(async (ids: string[]) => {
    if (!token) return;

    const uniqueIds = Array.from(new Set(ids));
    for (const id of uniqueIds) {
      await userFeatureService.addRecentlyViewedItem(token, id);
    }

    const products = await userFeatureService.getRecentlyViewed(token);
    setRecentlyViewedIds(products.map((product) => getProductId(product)));
    setUsingRemote(true);
  }, [token]);

  return {
    recentlyViewedIds,
    loading,
    error,
    trackRecentlyViewed,
    importRecentlyViewed,
    usingRemote,
  };
};
