import React from 'react';
import { useAuth } from '../../auth/useAuth';
import type { Order } from '../../types';
import { orderService } from '../orderService';
import type { CheckoutPayload } from '../types';

export const useOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadOrders = React.useCallback(async () => {
    if (!token) {
      setOrders([]);
      return;
    }

    setLoading(true);
    try {
      const nextOrders = await orderService.getOrders(token);
      setOrders(nextOrders);
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const checkout = React.useCallback(async (payload: CheckoutPayload) => {
    if (!token) {
      throw new Error('Sign in to complete checkout.');
    }

    const order = await orderService.checkout(token, payload);
    setOrders((currentOrders) => [order, ...currentOrders]);
    return order;
  }, [token]);

  return {
    orders,
    loading,
    error,
    reload: loadOrders,
    checkout,
  };
};
