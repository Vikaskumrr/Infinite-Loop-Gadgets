export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh';

export type ThemeChoice = 'gradient' | 'neutral' | 'dark';

export type SortOption = 'none' | 'price-asc' | 'price-desc' | 'rating';

export interface Review {
  user: string;
  stars: number;
  comment: string;
}

export interface Product {
  name: string;
  brand: string;
  price: number;
  rating: number;
  productImage: string;
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
  items: Product[];
  total: number;
  createdAt: string;
  status: 'placed';
}

export interface ProductApiRecord {
  products: Product[];
}

export interface JsonBinResponse {
  record?: ProductApiRecord;
}

export type TranslationMap<T extends string> = Record<'en', Record<T, string>> &
  Partial<Record<Exclude<LanguageCode, 'en'>, Record<T, string>>>;
