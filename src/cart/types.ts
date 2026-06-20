import type { Product } from '../types';

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  availabilityStatus: 'available' | 'limited' | 'out-of-stock';
  stockQuantity: number;
  product: Product;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}
