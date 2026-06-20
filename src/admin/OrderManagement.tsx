import React from 'react';
import { useAuth } from '../auth/useAuth';
import { adminService } from './adminService';
import type { AdminOrder } from './types';

const statusOptions: Array<{ label: string; value: string }> = [
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const OrderManagement: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);

  const loadOrders = React.useCallback(async () => {
    if (!token) return;
    setOrders(await adminService.getOrders(token));
  }, [token]);

  React.useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: string, status: string) => {
    if (!token) return;
    const updated = await adminService.updateOrderStatus(token, orderId, status);
    setOrders((current) => current.map((order) => (order.id === orderId ? updated : order)));
  };

  return (
    <section className="admin-panel">
      <h2>Orders</h2>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer.email}</td>
                <td>₹{order.totalAmount.toFixed(2)}</td>
                <td>
                  <select value={order.status.toUpperCase()} onChange={(event) => void handleStatusChange(order.id, event.target.value)}>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OrderManagement;
