import React from 'react';
import { useAuth } from '../auth/useAuth';
import { adminService } from './adminService';
import type { AdminInventoryItem } from './types';

const InventoryManagement: React.FC = () => {
  const { token } = useAuth();
  const [inventory, setInventory] = React.useState<AdminInventoryItem[]>([]);

  const loadInventory = React.useCallback(async () => {
    if (!token) return;
    setInventory(await adminService.getInventory(token));
  }, [token]);

  React.useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const handleStockChange = async (productId: string, stockQuantity: number, availabilityStatus: AdminInventoryItem['availabilityStatus']) => {
    if (!token) return;
    const updated = await adminService.updateInventory(token, productId, { stockQuantity, availabilityStatus });
    setInventory((current) => current.map((item) => (item.productId === productId ? updated : item)));
  };

  return (
    <section className="admin-panel">
      <h2>Inventory</h2>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Status</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.product.name}</td>
                <td>{item.availabilityStatus}</td>
                <td>{item.stockQuantity}</td>
                <td>
                  <button type="button" onClick={() => void handleStockChange(item.productId, Math.max(0, item.stockQuantity + 1), item.availabilityStatus)}>
                    +1 stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default InventoryManagement;
