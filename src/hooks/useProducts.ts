import { useEffect, useMemo, useState } from 'react';
import type { Product, SortOption } from '../types';
import { fetchProducts } from '../services/products';

export const filterAndSortProducts = (
  products: Product[],
  searchTerm: string,
  sortOption: SortOption,
): Product[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filtered = normalizedSearch
    ? products.filter((product) => product.name.toLowerCase().includes(normalizedSearch))
    : [...products];

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

export const useProducts = (searchTerm: string, sortOption: SortOption) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const nextProducts = await fetchProducts();
        if (isMounted) {
          setProducts(nextProducts);
          setError(null);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to load products.');
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, searchTerm, sortOption),
    [products, searchTerm, sortOption],
  );

  return {
    products,
    filteredProducts,
    loading,
    error,
  };
};
