import type { Product, Review } from '../types';
import { slugify } from '../data/categories';

export interface ProductValidationIssue {
  index: number;
  reason: string;
  value: unknown;
}

export interface ProductValidationResult {
  products: Product[];
  issues: ProductValidationIssue[];
}

const priceStatuses = new Set(['verified', 'fallback', 'todo']);
const stockStatuses = new Set(['in-stock', 'out-of-stock']);
const badges = new Set(['Sale', 'New', 'Best Seller']);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isStringRecord = (value: unknown): value is Record<string, string> =>
  isRecord(value) && Object.values(value).every((item) => typeof item === 'string');

const isReview = (value: unknown): value is Review => {
  if (!isRecord(value)) return false;
  return (
    typeof value.user === 'string'
    && typeof value.comment === 'string'
    && typeof value.stars === 'number'
    && Number.isFinite(value.stars)
    && value.stars >= 0
    && value.stars <= 5
  );
};

const stringArray = (value: unknown): string[] | undefined =>
  Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : undefined;

const optionalString = (value: unknown, field: string, maxLength = 500): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') {
    throw new Error(`Product ${field} must be a string.`);
  }

  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new Error(`Product ${field} is too long.`);
  }

  return normalized || undefined;
};

const validateUrl = (value: unknown, field: string, options: { allowRelative?: boolean } = {}): string | undefined => {
  const normalized = optionalString(value, field, 2048);
  if (!normalized) return undefined;

  if (options.allowRelative && normalized.startsWith('/')) {
    return normalized;
  }

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    throw new Error(`Product ${field} must be a valid URL.`);
  }

  if (url.protocol !== 'https:') {
    throw new Error(`Product ${field} must use HTTPS.`);
  }

  return url.toString();
};

export const withProductIdentity = (product: Product): Product => ({
  ...product,
  id: product.id || slugify(`${product.brand}-${product.name}`),
  slug: product.slug || slugify(product.name),
  stockStatus: product.stockStatus || 'in-stock',
});

export const validateProduct = (value: unknown): Product => {
  if (!isRecord(value)) {
    throw new Error('Product must be an object.');
  }

  const requiredStringFields = ['name', 'brand', 'productImage', 'color'] as const;
  for (const field of requiredStringFields) {
    if (typeof value[field] !== 'string' || value[field].trim().length === 0 || value[field].trim().length > 500) {
      throw new Error(`Product is missing required string field "${field}".`);
    }
  }

  if (typeof value.price !== 'number' || !Number.isFinite(value.price) || value.price < 0) {
    throw new Error('Product price must be a non-negative number.');
  }

  if (typeof value.rating !== 'number' || !Number.isFinite(value.rating) || value.rating < 0 || value.rating > 5) {
    throw new Error('Product rating must be a number between 0 and 5.');
  }

  const name = value.name as string;
  const brand = value.brand as string;
  const productImage = value.productImage as string;
  const color = value.color as string;

  if (value.priceStatus !== undefined && (typeof value.priceStatus !== 'string' || !priceStatuses.has(value.priceStatus))) {
    throw new Error('Product priceStatus is invalid.');
  }

  if (value.stockStatus !== undefined && (typeof value.stockStatus !== 'string' || !stockStatuses.has(value.stockStatus))) {
    throw new Error('Product stockStatus is invalid.');
  }

  if (value.badge !== undefined && (typeof value.badge !== 'string' || !badges.has(value.badge))) {
    throw new Error('Product badge is invalid.');
  }

  if (value.reviews !== undefined && (!Array.isArray(value.reviews) || !value.reviews.every(isReview))) {
    throw new Error('Product reviews are invalid.');
  }

  if (value.features !== undefined && !stringArray(value.features)) {
    throw new Error('Product features must be an array of strings.');
  }

  if (value.specifications !== undefined && !isStringRecord(value.specifications)) {
    throw new Error('Product specifications must be string key/value pairs.');
  }

  const id = optionalString(value.id, 'id', 160) || slugify(`${brand}-${name}`);
  const slug = optionalString(value.slug, 'slug', 160) || slugify(name);

  return {
    id,
    slug,
    name: name.trim(),
    brand: brand.trim(),
    price: value.price,
    rating: value.rating,
    productImage: validateUrl(productImage, 'productImage', { allowRelative: true }) || productImage.trim(),
    color: color.trim(),
    category: optionalString(value.category, 'category', 120),
    subcategory: optionalString(value.subcategory, 'subcategory', 120),
    description: optionalString(value.description, 'description', 1000),
    features: stringArray(value.features),
    reviews: Array.isArray(value.reviews) ? value.reviews : undefined,
    specifications: isStringRecord(value.specifications) ? value.specifications : undefined,
    priceDisplay: optionalString(value.priceDisplay, 'priceDisplay', 160),
    priceStatus: typeof value.priceStatus === 'string' && priceStatuses.has(value.priceStatus) ? value.priceStatus as Product['priceStatus'] : undefined,
    sourceUrl: validateUrl(value.sourceUrl, 'sourceUrl'),
    imageSourceUrl: validateUrl(value.imageSourceUrl, 'imageSourceUrl'),
    badge: typeof value.badge === 'string' && badges.has(value.badge) ? value.badge as Product['badge'] : undefined,
    stockStatus: typeof value.stockStatus === 'string' && stockStatuses.has(value.stockStatus) ? value.stockStatus as Product['stockStatus'] : 'in-stock',
    compareAtPrice: optionalString(value.compareAtPrice, 'compareAtPrice', 160),
    catalogSource: typeof value.catalogSource === 'string' && (value.catalogSource === 'remote' || value.catalogSource === 'fallback') ? value.catalogSource : undefined,
  };
};

export const validateProducts = (values: unknown[]): ProductValidationResult =>
  values.reduce<ProductValidationResult>((result, value, index) => {
    try {
      result.products.push(validateProduct(value));
    } catch (error) {
      result.issues.push({
        index,
        reason: error instanceof Error ? error.message : 'Unknown validation error.',
        value,
      });
    }

    return result;
  }, { products: [], issues: [] });

export const extractProductPayload = (payload: unknown): unknown[] => {
  if (!isRecord(payload)) {
    throw new Error('Product API payload must be an object.');
  }

  const products = isRecord(payload.record) ? payload.record.products : payload.products;
  if (!Array.isArray(products)) {
    throw new Error('Product API payload does not contain a products array.');
  }

  return products;
};
