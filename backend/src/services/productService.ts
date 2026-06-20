import type { Prisma } from '@prisma/client';
import { productRepository, type ProductWithRelations } from '../repositories/productRepository.js';
import { categoryRepository } from '../repositories/categoryRepository.js';
import type { ProductListQuery } from '../validators/productValidators.js';
import { slugify } from '../utils/slug.js';

export interface FrontendProductDto {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: string;
  rating: number;
  reviewCount?: number;
  productImage: string;
  images?: string[];
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
  stockQuantity?: number;
  availabilityStatus?: 'available' | 'limited' | 'out-of-stock';
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

const searchSynonyms: Record<string, string[]> = {
  phone: ['phone', 'smartphone', 'iphone', 'pixel', 'galaxy'],
  phones: ['phone', 'smartphone', 'iphone', 'pixel', 'galaxy'],
  anc: ['anc', 'noise cancellation', 'noise cancelling', 'headphone'],
  laptop: ['laptop', 'macbook', 'notebook'],
  gaming: ['gaming', 'console', 'playstation', 'nintendo'],
  charger: ['charger', 'charging', 'power bank', 'battery'],
};

const expandSearchTerms = (search: string): string[] => {
  const normalized = search.trim().toLowerCase();
  const terms = new Set([normalized]);
  for (const token of normalized.split(/\s+/)) {
    for (const synonym of searchSynonyms[token] || []) {
      terms.add(synonym);
    }
  }
  return Array.from(terms).filter(Boolean);
};

const availabilityFromInventory = (product: ProductWithRelations): FrontendProductDto['availabilityStatus'] => {
  if (product.inventory?.availabilityStatus === 'OUT_OF_STOCK' || product.inventory?.stockQuantity === 0) {
    return 'out-of-stock';
  }
  if ((product.inventory?.stockQuantity || 0) > 0 && (product.inventory?.stockQuantity || 0) <= 5) {
    return 'limited';
  }
  return 'available';
};

export const toProductDto = (product: ProductWithRelations): FrontendProductDto => {
  const images = metadataObject(product.images);
  const metadata = metadataObject(product.specifications).metadata as Record<string, unknown> | undefined;
  const specifications = metadataObject(product.specifications).specifications as Prisma.JsonValue | undefined;
  const reviews = metadataObject(product.specifications).reviews as FrontendProductDto['reviews'] | undefined;
  const productImage = typeof images.primary === 'string' ? images.primary : '';
  const imageList = Array.isArray(images.gallery)
    ? images.gallery.filter((image): image is string => typeof image === 'string')
    : [productImage].filter(Boolean);

  return {
    id: product.id,
    slug: product.slug,
    name: product.title,
    brand: product.brand.name,
    price: Number(product.price),
    compareAtPrice: typeof metadata?.compareAtPrice === 'string' ? metadata.compareAtPrice : undefined,
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    productImage,
    images: Array.from(new Set([productImage, ...imageList].filter(Boolean))),
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
    stockStatus: availabilityFromInventory(product) === 'out-of-stock' ? 'out-of-stock' : 'in-stock',
    stockQuantity: product.inventory?.stockQuantity,
    availabilityStatus: availabilityFromInventory(product),
    catalogSource: product.catalogSource ? catalogSourceMap[product.catalogSource] : 'remote',
  };
};

const buildWhere = (query: ProductListQuery): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {};

  if (query.search) {
    const searchTerms = expandSearchTerms(query.search);
    where.OR = searchTerms.flatMap((term) => [
      { title: { contains: term, mode: 'insensitive' } },
      { description: { contains: term, mode: 'insensitive' } },
      { brand: { name: { contains: term, mode: 'insensitive' } } },
      { category: { name: { contains: term, mode: 'insensitive' } } },
      { specifications: { path: ['specifications'], string_contains: term } },
      { features: { array_contains: [term] } },
    ]);
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

  getRelatedProducts: async (idOrSlug: string, limit = 4): Promise<FrontendProductDto[]> => {
    const product = await productRepository.findById(idOrSlug) ?? await productRepository.findBySlug(idOrSlug);
    if (!product) return [];

    const price = Number(product.price);
    const related = await productRepository.findAll({
      skip: 0,
      take: limit,
      where: {
        id: { not: product.id },
        OR: [
          { categoryId: product.categoryId },
          { brandId: product.brandId },
          { price: { gte: Math.max(0, price * 0.75), lte: price * 1.25 } },
        ],
      },
      orderBy: { rating: 'desc' },
    });

    return related.map(toProductDto);
  },

  getCategories: async () => {
    const categories = await categoryRepository.findAllWithProductCounts();
    const childCountByParentSlug = new Map<string, number>();

    for (const category of categories) {
      if (category.parent?.slug) {
        childCountByParentSlug.set(
          category.parent.slug,
          (childCountByParentSlug.get(category.parent.slug) || 0) + category._count.products,
        );
      }
    }

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentSlug: category.parent?.slug,
      productCount: category._count.products + (childCountByParentSlug.get(category.slug) || 0),
      directProductCount: category._count.products,
    }));
  },
};
