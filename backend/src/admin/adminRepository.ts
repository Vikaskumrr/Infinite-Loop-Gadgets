import type { AvailabilityStatus, Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { includeProductRelations, type ProductWithRelations } from '../repositories/productRepository.js';

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

const db = (tx?: TransactionClient) => tx || prisma;

const orderInclude = {
  user: true,
  items: {
    include: {
      product: {
        include: includeProductRelations,
      },
    },
  },
} satisfies Prisma.OrderInclude;

export type AdminOrderRecord = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

export const adminRepository = {
  findProducts: (search?: string): Promise<ProductWithRelations[]> =>
    prisma.product.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
              { brand: { name: { contains: search, mode: 'insensitive' } } },
              { category: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : undefined,
      include: includeProductRelations,
      orderBy: { updatedAt: 'desc' },
    }),

  findProductById: (id: string): Promise<ProductWithRelations | null> =>
    prisma.product.findUnique({ where: { id }, include: includeProductRelations }),

  findProductBySlug: (slug: string): Promise<ProductWithRelations | null> =>
    prisma.product.findUnique({ where: { slug }, include: includeProductRelations }),

  findBrandBySlug: (slug: string) => prisma.brand.findUnique({ where: { slug } }),
  createBrand: (data: Prisma.BrandCreateInput, tx?: TransactionClient) => db(tx).brand.create({ data }),
  findCategoryBySlug: (slug: string) => prisma.category.findUnique({ where: { slug } }),
  createCategory: (data: Prisma.CategoryCreateInput, tx?: TransactionClient) => db(tx).category.create({ data }),

  createProduct: (data: Prisma.ProductCreateInput, tx: TransactionClient): Promise<ProductWithRelations> =>
    tx.product.create({ data, include: includeProductRelations }),

  updateProduct: (id: string, data: Prisma.ProductUpdateInput, tx: TransactionClient): Promise<ProductWithRelations> =>
    tx.product.update({ where: { id }, data, include: includeProductRelations }),

  upsertInventory: (
    productId: string,
    stockQuantity: number,
    availabilityStatus: Prisma.EnumAvailabilityStatusFieldUpdateOperationsInput['set'] | AvailabilityStatus,
    tx: TransactionClient,
  ) =>
    tx.inventory.upsert({
      where: { productId },
      update: { stockQuantity, availabilityStatus },
      create: { product: { connect: { id: productId } }, stockQuantity, availabilityStatus },
    }),

  countProductDependencies: (productId: string) =>
    Promise.all([
      prisma.cartItem.count({ where: { productId } }),
      prisma.orderItem.count({ where: { productId } }),
      prisma.wishlist.count({ where: { productId } }),
      prisma.compareItem.count({ where: { productId } }),
    ]),

  deleteProduct: async (productId: string, tx: TransactionClient) => {
    await tx.inventory.deleteMany({ where: { productId } });
    await tx.product.delete({ where: { id: productId } });
  },

  findInventory: () =>
    prisma.inventory.findMany({
      include: {
        product: {
          include: {
            brand: true,
            category: { include: { parent: true } },
          },
        },
      },
      orderBy: [{ stockQuantity: 'asc' }, { lastUpdated: 'desc' }],
    }),

  updateInventory: (productId: string, stockQuantity: number, availabilityStatus: AvailabilityStatus) =>
    prisma.inventory.upsert({
      where: { productId },
      update: { stockQuantity, availabilityStatus },
      create: { product: { connect: { id: productId } }, stockQuantity, availabilityStatus },
      include: {
        product: {
          include: {
            brand: true,
            category: { include: { parent: true } },
          },
        },
      },
    }),

  findOrders: (where: Prisma.OrderWhereInput): Promise<AdminOrderRecord[]> =>
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    }),

  findOrderById: (id: string): Promise<AdminOrderRecord | null> =>
    prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    }),

  updateOrderStatus: (id: string, status: Prisma.OrderUpdateInput['status']) =>
    prisma.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    }),
};
