import type { Product } from '../types';
import { getCategoryTerms, slugify } from '../data/categories';

export const formatProductPrice = (product: Product): string => {
  if (product.priceDisplay) {
    return product.priceDisplay;
  }

  return `₹${product.price.toFixed(2)}`;
};

export const productMatchesCategory = (product: Product, category: string): boolean => {
  const normalizedCategory = slugify(category);
  const structuredCategories = [product.category, product.subcategory].filter(Boolean).map((value) => slugify(value as string));

  if (structuredCategories.includes(normalizedCategory)) {
    return true;
  }

  if (structuredCategories.length > 0) {
    return false;
  }

  const terms = getCategoryTerms(category);
  const searchable = [
    product.name,
    product.brand,
    product.color,
    product.category,
    product.subcategory,
    product.description,
    ...(product.features || []),
    ...(product.specifications ? Object.values(product.specifications) : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return terms.some((term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(searchable));
};

export const calculateOrderTotal = (items: Product[]): number => items.reduce((total, item) => total + item.price, 0);
