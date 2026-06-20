import type { Order } from '../types';

export interface CheckoutPayload {
  email?: string;
  fullName?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  couponCode?: string;
}

export interface OrdersState {
  orders: Order[];
}
