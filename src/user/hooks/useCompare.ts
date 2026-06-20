import React from 'react';
import type { Product } from '../../types';
import { getProductId } from '../../utils/productIdentity';
import { readStoredJson, writeStoredJson } from '../../utils/storage';
import { userFeatureService } from '../userFeatureService';

const STORAGE_KEY = 'ilg.compare';
const LOCAL_LIMIT = 4;

const readLocalIds = (): string[] => readStoredJson<string[]>(STORAGE_KEY, []);

export const useCompare = (token: string | null) => {
  const [compareIds, setCompareIds] = React.useState<string[]>(() => readLocalIds());
  const [loading, setLoading] = React.useState(Boolean(token));
  const [error, setError] = React.useState<string | null>(null);
  const [usingRemote, setUsingRemote] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      setCompareIds(readLocalIds());
      setUsingRemote(false);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    void userFeatureService.getCompare(token)
      .then((products) => {
        if (!isMounted) return;
        setCompareIds(products.map((product) => getProductId(product)));
        setUsingRemote(true);
        setError(null);
      })
      .catch((caughtError) => {
        if (!isMounted) return;
        setCompareIds(readLocalIds());
        setUsingRemote(false);
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to load compare list.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const toggleCompare = React.useCallback(async (product: Product) => {
    const productId = getProductId(product);

    if (!token || !usingRemote) {
      setCompareIds((currentIds) => {
        const nextIds = currentIds.includes(productId)
          ? currentIds.filter((id) => id !== productId)
          : [productId, ...currentIds].slice(0, LOCAL_LIMIT);
        writeStoredJson(STORAGE_KEY, nextIds);
        return nextIds;
      });
      return;
    }

    const products = compareIds.includes(productId)
      ? await userFeatureService.removeCompareItem(token, productId)
      : await userFeatureService.addCompareItem(token, productId);

    setCompareIds(products.map((item) => getProductId(item)));
  }, [compareIds, token, usingRemote]);

  const importCompare = React.useCallback(async (ids: string[]) => {
    if (!token) return;

    const uniqueIds = Array.from(new Set(ids));
    for (const id of uniqueIds) {
      await userFeatureService.addCompareItem(token, id);
    }

    const products = await userFeatureService.getCompare(token);
    setCompareIds(products.map((product) => getProductId(product)));
    setUsingRemote(true);
  }, [token]);

  return {
    compareIds,
    loading,
    error,
    toggleCompare,
    importCompare,
    usingRemote,
  };
};
