import type { Product } from '../types';
import { getProductId } from '../utils/productIdentity';
import { readStoredJson, removeStoredItem } from '../utils/storage';

const CART_KEY = 'ilg.cart';
const CART_SKIP_KEY = 'ilg.cartMigrationSkipped';

export interface GuestCartItem {
  product: Product;
  quantity: number;
}

export interface GuestCartMigrationResult {
  importedProductIds: string[];
  failedProductIds: string[];
}

export const readGuestCartProducts = (): Product[] => readStoredJson<Product[]>(CART_KEY, []);

export const readGuestCartItems = (): GuestCartItem[] => {
  const products = readGuestCartProducts();
  const grouped = new Map<string, GuestCartItem>();

  for (const product of products) {
    const id = getProductId(product);
    const existing = grouped.get(id);
    if (existing) {
      existing.quantity += 1;
    } else {
      grouped.set(id, { product, quantity: 1 });
    }
  }

  return Array.from(grouped.values());
};

export const shouldPromptForCartMigration = (userId: string): boolean => {
  const skipped = readStoredJson<string[]>(CART_SKIP_KEY, []);
  return readGuestCartItems().length > 0 && !skipped.includes(userId);
};

export const markCartMigrationSkipped = (userId: string) => {
  const skipped = readStoredJson<string[]>(CART_SKIP_KEY, []);
  if (!skipped.includes(userId)) {
    localStorage.setItem(CART_SKIP_KEY, JSON.stringify([...skipped, userId]));
  }
};

export const clearCartMigrationSkip = (userId: string) => {
  const skipped = readStoredJson<string[]>(CART_SKIP_KEY, []);
  localStorage.setItem(CART_SKIP_KEY, JSON.stringify(skipped.filter((id) => id !== userId)));
};

export const applyGuestCartMigrationResult = (result: GuestCartMigrationResult) => {
  const remainingProducts = readGuestCartProducts().filter((product) => result.failedProductIds.includes(getProductId(product)));
  if (remainingProducts.length === 0) {
    removeStoredItem(CART_KEY);
  } else {
    localStorage.setItem(CART_KEY, JSON.stringify(remainingProducts));
  }
};
