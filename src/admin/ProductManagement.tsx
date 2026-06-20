import React from 'react';
import { useAuth } from '../auth/useAuth';
import { adminService } from './adminService';
import type { AdminProduct, AdminProductInput } from './types';

const initialForm: AdminProductInput = {
  title: '',
  description: '',
  price: 0,
  brand: '',
  category: '',
  subcategory: '',
  images: [''],
  specifications: {},
  features: [],
  availabilityStatus: 'IN_STOCK',
  stockQuantity: 0,
};

const ProductManagement: React.FC = () => {
  const { token } = useAuth();
  const [products, setProducts] = React.useState<AdminProduct[]>([]);
  const [search, setSearch] = React.useState('');
  const [form, setForm] = React.useState<AdminProductInput>(initialForm);

  const loadProducts = React.useCallback(async () => {
    if (!token) return;
    setProducts(await adminService.getProducts(token, search));
  }, [search, token]);

  React.useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    await adminService.createProduct(token, {
      ...form,
      images: form.images.filter(Boolean),
    });
    setForm(initialForm);
    await loadProducts();
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel-header">
        <h2>Products</h2>
        <input aria-label="Search products" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
      </div>
      <div className="admin-grid">
        <form className="admin-card admin-form" onSubmit={handleCreate}>
          <h3>Add product</h3>
          <input placeholder="Title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          <textarea placeholder="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          <input placeholder="Brand" value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} />
          <input placeholder="Category" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
          <input placeholder="Subcategory" value={form.subcategory} onChange={(event) => setForm((current) => ({ ...current, subcategory: event.target.value }))} />
          <input placeholder="Image URL" value={form.images[0] || ''} onChange={(event) => setForm((current) => ({ ...current, images: [event.target.value] }))} />
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
          />
          <input
            placeholder="Stock quantity"
            type="number"
            value={form.stockQuantity}
            onChange={(event) => setForm((current) => ({ ...current, stockQuantity: Number(event.target.value) }))}
          />
          <button type="submit">Create product</button>
        </form>
        <div className="admin-card">
          <h3>Catalog</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>{product.stockQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProductManagement;
