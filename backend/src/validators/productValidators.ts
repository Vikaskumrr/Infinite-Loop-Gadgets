import { z } from 'zod';

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  brand: z.string().trim().min(1).optional(),
  sort: z.enum(['price-asc', 'price-desc', 'rating', 'newest']).default('newest'),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
