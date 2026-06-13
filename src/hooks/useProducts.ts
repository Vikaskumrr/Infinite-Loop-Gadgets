import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Product, ProductCatalogSource, SortOption } from '../types';
import { fetchProductCatalog } from '../services/products';
import { productMatchesCategory } from '../utils/products';

export const filterAndSortProducts = (
  products: Product[],
  searchTerm: string,
  sortOption: SortOption,
  category?: string,
): Product[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const categoryFiltered = category
    ? products.filter((product) => productMatchesCategory(product, category))
    : products;
  const filtered = normalizedSearch
    ? categoryFiltered.filter((product) => product.name.toLowerCase().includes(normalizedSearch))
    : [...categoryFiltered];

  if (sortOption === 'price-asc') {
    return filtered.sort((a, b) => a.price - b.price);
  }

  if (sortOption === 'price-desc') {
    return filtered.sort((a, b) => b.price - a.price);
  }

  if (sortOption === 'rating') {
    return filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
};

export const useProducts = (searchTerm: string, sortOption: SortOption, category?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [catalogSource, setCatalogSource] = useState<ProductCatalogSource>('remote');
  const [reloadKey, setReloadKey] = useState(0);
  const hasLoadedProductsRef = useRef(false);

  const retry = useCallback(() => {
    setReloadKey((currentKey) => currentKey + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(!hasLoadedProductsRef.current);
        setRefreshing(hasLoadedProductsRef.current);
        const catalog = await fetchProductCatalog();
        if (isMounted) {
          setProducts(catalog.products);
          setCatalogSource(catalog.source);
          setWarning(catalog.warning || null);
          setError(null);
          hasLoadedProductsRef.current = true;
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to load products.');
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, searchTerm, sortOption, category),
    [products, searchTerm, sortOption, category],
  );

  return {
    products,
    filteredProducts,
    loading,
    refreshing,
    error,
    warning,
    catalogSource,
    retry,
  };
};
