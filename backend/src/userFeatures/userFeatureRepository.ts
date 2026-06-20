import { prisma } from '../config/prisma.js';
import { includeProductRelations } from '../repositories/productRepository.js';

export const userFeatureRepository = {
  findProductById: (productId: string) =>
    prisma.product.findUnique({
      where: { id: productId },
      include: includeProductRelations,
    }),

  getWishlist: (userId: string) =>
    prisma.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: includeProductRelations,
        },
      },
    }),

  addWishlistItem: (userId: string, productId: string) =>
    prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {},
      create: {
        userId,
        productId,
      },
      include: {
        product: {
          include: includeProductRelations,
        },
      },
    }),

  removeWishlistItem: (userId: string, productId: string) =>
    prisma.wishlist.deleteMany({
      where: { userId, productId },
    }),

  getCompareItems: (userId: string) =>
    prisma.compareItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: includeProductRelations,
        },
      },
    }),

  countCompareItems: (userId: string) =>
    prisma.compareItem.count({
      where: { userId },
    }),

  addCompareItem: (userId: string, productId: string) =>
    prisma.compareItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {},
      create: {
        userId,
        productId,
      },
      include: {
        product: {
          include: includeProductRelations,
        },
      },
    }),

  removeCompareItem: (userId: string, productId: string) =>
    prisma.compareItem.deleteMany({
      where: { userId, productId },
    }),

  getRecentlyViewed: (userId: string, take: number) =>
    prisma.productView.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        product: {
          include: includeProductRelations,
        },
      },
    }),

  findRecentlyViewedItem: (userId: string, productId: string) =>
    prisma.productView.findFirst({
      where: { userId, productId },
    }),

  createRecentlyViewedItem: (userId: string, productId: string) =>
    prisma.productView.create({
      data: { userId, productId },
      include: {
        product: {
          include: includeProductRelations,
        },
      },
    }),

  refreshRecentlyViewedItem: (id: string) =>
    prisma.productView.update({
      where: { id },
      data: { createdAt: new Date() },
      include: {
        product: {
          include: includeProductRelations,
        },
      },
    }),

  trimRecentlyViewed: async (userId: string, keep: number) => {
    const items = await prisma.productView.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: keep,
      select: { id: true },
    });

    if (items.length === 0) {
      return;
    }

    await prisma.productView.deleteMany({
      where: {
        id: { in: items.map((item) => item.id) },
      },
    });
  },
};
