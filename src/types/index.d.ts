export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh';

export type ThemeChoice = 'gradient' | 'neutral' | 'dark';

export type SortOption = 'none' | 'price-asc' | 'price-desc' | 'rating';

export interface Review {
  user: string;
  stars: number;
  comment: string;
}

export interface Product {
  id?: string;
  slug?: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  reviewCount?: number;
  productImage: string;
  images?: string[];
  color: string;
  category?: string;
  subcategory?: string;
  description?: string;
  features?: string[];
  reviews?: Review[];
  specifications?: Record<string, string>;
  priceDisplay?: string;
  priceStatus?: 'verified' | 'fallback' | 'todo';
  sourceUrl?: string;
  imageSourceUrl?: string;
  badge?: 'Sale' | 'New' | 'Best Seller';
  stockStatus?: 'in-stock' | 'out-of-stock';
  stockQuantity?: number;
  availabilityStatus?: 'available' | 'limited' | 'out-of-stock';
  compareAtPrice?: string;
  catalogSource?: 'remote' | 'fallback';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
  createdAt: string;
}

export interface Order {
  id: string;
  items: Array<{
    id?: string;
    productId: string;
    quantity: number;
    price: number;
    product: Product;
  }>;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  status: 'payment_pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface ProductApiRecord {
  products: Product[];
}

export interface JsonBinResponse {
  record?: ProductApiRecord;
}

export type ProductCatalogSource = 'remote' | 'fallback';

export interface ProductCatalogResult {
  products: Product[];
  source: ProductCatalogSource;
  warning?: string;
}

export type TranslationMap<T extends string> = Record<'en', Record<T, string>> &
  Partial<Record<Exclude<LanguageCode, 'en'>, Record<T, string>>>;
