import { prisma } from '../config/prisma.js';

export const categoryRepository = {
  findAllWithProductCounts: () =>
    prisma.category.findMany({
      orderBy: [{ parentId: 'asc' }, { name: 'asc' }],
      include: {
        parent: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    }),
};
