import React from 'react';
import type { Product } from '../types';
import type { GuestCartItem } from './cartMigrationService';
import type { CartState } from './types';

export interface CartContextValue {
  cart: CartState;
  loading: boolean;
  error: string | null;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  addMany: (products: Product[]) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  expandedProducts: Product[];
  cartMigrationPrompt: {
    open: boolean;
    items: GuestCartItem[];
    loading: boolean;
    error: string | null;
    importGuestCart: () => Promise<void>;
    skipGuestCartImport: () => void;
  };
}

export const CartContext = React.createContext<CartContextValue | undefined>(undefined);
