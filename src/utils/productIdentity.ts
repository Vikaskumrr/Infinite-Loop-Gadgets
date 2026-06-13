import { slugify } from '../data/categories';
import type { Product } from '../types';

export const getProductId = (product: Pick<Product, 'brand' | 'name' | 'id'>): string =>
  product.id || slugify(`${product.brand}-${product.name}`);

export const getProductSlug = (product: Pick<Product, 'name' | 'slug'>): string => product.slug || slugify(product.name);
