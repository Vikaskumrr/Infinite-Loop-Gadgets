import React from 'react';
import { useAuth } from '../auth/useAuth';
import { adminService } from './adminService';
import type { AdminDashboard as AdminDashboardType } from './types';

const emptyDashboard: AdminDashboardType = {
  productCount: 0,
  orderCount: 0,
  lowStockItems: [],
  recentOrders: [],
};

const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [dashboard, setDashboard] = React.useState<AdminDashboardType>(emptyDashboard);

  React.useEffect(() => {
    if (!token) return;
    void adminService.getDashboard(token).then(setDashboard).catch(() => setDashboard(emptyDashboard));
  }, [token]);

  return (
    <section className="admin-panel">
      <h2>Dashboard</h2>
      <div className="admin-metrics">
        <article><strong>{dashboard.productCount}</strong><span>Products</span></article>
        <article><strong>{dashboard.orderCount}</strong><span>Orders</span></article>
        <article><strong>{dashboard.lowStockItems.length}</strong><span>Low stock</span></article>
      </div>
      <div className="admin-grid">
        <div className="admin-card">
          <h3>Low stock items</h3>
          <ul>
            {dashboard.lowStockItems.map((item) => (
              <li key={item.id}>{item.product.name} - {item.stockQuantity} left</li>
            ))}
          </ul>
        </div>
        <div className="admin-card">
          <h3>Recent orders</h3>
          <ul>
            {dashboard.recentOrders.map((order) => (
              <li key={order.id}>{order.id} - {order.customer.email} - {order.status}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
