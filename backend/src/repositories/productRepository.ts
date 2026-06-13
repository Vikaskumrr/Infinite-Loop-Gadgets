import type { Prisma, Product } from '@prisma/client';
import { prisma } from '../config/prisma.js';

export interface ProductQuery {
  skip: number;
  take: number;
  where?: Prisma.ProductWhereInput;
  orderBy?: Prisma.ProductOrderByWithRelationInput;
}

const includeProductRelations = {
  brand: true,
  category: {
    include: {
      parent: true,
    },
  },
  inventory: true,
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof includeProductRelations;
}>;

export const productRepository = {
  findAll: (query: ProductQuery): Promise<ProductWithRelations[]> =>
    prisma.product.findMany({
      ...query,
      include: includeProductRelations,
    }),

  findById: (id: string): Promise<ProductWithRelations | null> =>
    prisma.product.findUnique({
      where: { id },
      include: includeProductRelations,
    }),

  findBySlug: (slug: string): Promise<ProductWithRelations | null> =>
    prisma.product.findUnique({
      where: { slug },
      include: includeProductRelations,
    }),

  search: (query: ProductQuery): Promise<ProductWithRelations[]> =>
    productRepository.findAll(query),

  findByCategory: (categorySlug: string, query: Omit<ProductQuery, 'where'>): Promise<ProductWithRelations[]> =>
    productRepository.findAll({
      ...query,
      where: {
        OR: [
          { category: { slug: categorySlug } },
          { category: { parent: { slug: categorySlug } } },
        ],
      },
    }),

  findByBrand: (brandSlug: string, query: Omit<ProductQuery, 'where'>): Promise<ProductWithRelations[]> =>
    productRepository.findAll({
      ...query,
      where: {
        brand: { slug: brandSlug },
      },
    }),

  count: (where?: Prisma.ProductWhereInput): Promise<number> => prisma.product.count({ where }),
};

export type ProductRecord = Product;
