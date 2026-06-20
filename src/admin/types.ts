export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category?: string;
  subcategory?: string;
  description?: string;
  price: number;
  productImage: string;
  stockQuantity: number;
  inventoryStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER' | 'DISCONTINUED';
  createdAt: string;
  updatedAt: string;
}

export interface AdminInventoryItem {
  id: string;
  productId: string;
  stockQuantity: number;
  availabilityStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER' | 'DISCONTINUED';
  lastUpdated: string;
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    category?: string;
    subcategory?: string;
  };
}

export interface AdminOrder {
  id: string;
  userId: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: 'payment_pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export interface AdminDashboard {
  productCount: number;
  orderCount: number;
  lowStockItems: AdminInventoryItem[];
  recentOrders: AdminOrder[];
}

export interface AdminProductInput {
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  subcategory?: string;
  images: string[];
  specifications: Record<string, string>;
  features: string[];
  availabilityStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER' | 'DISCONTINUED';
  stockQuantity: number;
}
