import type { Prisma } from '@prisma/client';
import { productRepository, type ProductWithRelations } from '../repositories/productRepository.js';
import { categoryRepository } from '../repositories/categoryRepository.js';
import type { ProductListQuery } from '../validators/productValidators.js';
import { slugify } from '../utils/slug.js';

interface FrontendProductDto {
  id: string;
  slug: string;
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
  reviews?: Array<{ user: string; stars: number; comment: string }>;
  specifications?: Record<string, string>;
  priceDisplay?: string;
  priceStatus?: 'verified' | 'fallback' | 'todo';
  sourceUrl?: string;
  imageSourceUrl?: string;
  badge?: 'Sale' | 'New' | 'Best Seller';
  stockStatus?: 'in-stock' | 'out-of-stock';
  compareAtPrice?: string;
  catalogSource?: 'remote' | 'fallback';
}

const stringRecord = (value: Prisma.JsonValue): Record<string, string> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value).filter(([, item]) => typeof item === 'string')) as Record<string, string>
    : undefined;

const stringArray = (value: Prisma.JsonValue): string[] | undefined =>
  Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : undefined;

const metadataObject = (value: Prisma.JsonValue): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

const priceStatusMap = {
  VERIFIED: 'verified',
  FALLBACK: 'fallback',
  TODO: 'todo',
} as const;

const catalogSourceMap = {
  REMOTE: 'remote',
  FALLBACK: 'fallback',
  ADMIN: 'remote',
  IMPORTED: 'remote',
} as const;

const toProductDto = (product: ProductWithRelations): FrontendProductDto => {
  const images = metadataObject(product.images);
  const metadata = metadataObject(product.specifications).metadata as Record<string, unknown> | undefined;
  const specifications = metadataObject(product.specifications).specifications as Prisma.JsonValue | undefined;
  const reviews = metadataObject(product.specifications).reviews as FrontendProductDto['reviews'] | undefined;
  const productImage = typeof images.primary === 'string' ? images.primary : '';

  return {
    id: product.id,
    slug: product.slug,
    name: product.title,
    brand: product.brand.name,
    price: Number(product.price),
    rating: Number(product.rating),
    productImage,
    color: typeof metadata?.color === 'string' ? metadata.color : '',
    category: product.category.parent?.name || product.category.name,
    subcategory: product.category.parent ? product.category.name : undefined,
    description: product.description,
    features: stringArray(product.features),
    reviews,
    specifications: specifications ? stringRecord(specifications) : undefined,
    priceDisplay: typeof metadata?.priceDisplay === 'string' ? metadata.priceDisplay : undefined,
    priceStatus: product.priceStatus ? priceStatusMap[product.priceStatus] : undefined,
    sourceUrl: product.sourceUrl || undefined,
    imageSourceUrl: typeof images.source === 'string' ? images.source : undefined,
    badge: metadata?.badge === 'Sale' || metadata?.badge === 'New' || metadata?.badge === 'Best Seller' ? metadata.badge : undefined,
    stockStatus: product.inventory?.availabilityStatus === 'OUT_OF_STOCK' ? 'out-of-stock' : 'in-stock',
    compareAtPrice: typeof metadata?.compareAtPrice === 'string' ? metadata.compareAtPrice : undefined,
    catalogSource: product.catalogSource ? catalogSourceMap[product.catalogSource] : 'remote',
  };
};

const buildWhere = (query: ProductListQuery): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {};

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { brand: { name: { contains: query.search, mode: 'insensitive' } } },
      { category: { name: { contains: query.search, mode: 'insensitive' } } },
    ];
  }

  if (query.category) {
    const categorySlug = slugify(query.category);
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { category: { slug: categorySlug } },
          { category: { parent: { slug: categorySlug } } },
        ],
      },
    ];
  }

  if (query.brand) {
    where.brand = { slug: slugify(query.brand) };
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {
      ...(query.minPrice !== undefined && { gte: query.minPrice }),
      ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
    };
  }

  return where;
};

const buildOrderBy = (sort: ProductListQuery['sort']): Prisma.ProductOrderByWithRelationInput => {
  if (sort === 'price-asc') return { price: 'asc' };
  if (sort === 'price-desc') return { price: 'desc' };
  if (sort === 'rating') return { rating: 'desc' };
  return { createdAt: 'desc' };
};

export const productService = {
  getProducts: async (query: ProductListQuery) => {
    const where = buildWhere(query);
    const skip = (query.page - 1) * query.limit;
    const [products, total] = await Promise.all([
      productRepository.findAll({
        skip,
        take: query.limit,
        where,
        orderBy: buildOrderBy(query.sort),
      }),
      productRepository.count(where),
    ]);

    return {
      products: products.map(toProductDto),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  },

  getProductByIdOrSlug: async (idOrSlug: string): Promise<FrontendProductDto | null> => {
    const product = await productRepository.findById(idOrSlug) ?? await productRepository.findBySlug(idOrSlug);
    return product ? toProductDto(product) : null;
  },

  getCategories: async () => {
    const categories = await categoryRepository.findAllWithProductCounts();
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentSlug: category.parent?.slug,
      productCount: category._count.products,
    }));
  },
};
