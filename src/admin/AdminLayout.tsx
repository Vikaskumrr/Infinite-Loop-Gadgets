import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './admin.scss';

const AdminLayout: React.FC = () => (
  <div className="admin-shell">
    <aside className="admin-sidebar">
      <h1>Commerce Admin</h1>
      <nav>
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/inventory">Inventory</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
      </nav>
    </aside>
    <main className="admin-content">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
