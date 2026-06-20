import { z } from 'zod';

export const adminProductListQuerySchema = z.object({
  search: z.string().trim().optional(),
});

export const adminProductSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(180).optional(),
  description: z.string().trim().min(1),
  price: z.number().finite().nonnegative(),
  discountPrice: z.number().finite().nonnegative().optional().nullable(),
  currency: z.string().trim().min(3).max(8).default('INR'),
  brand: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(120),
  subcategory: z.string().trim().max(120).optional(),
  images: z.array(z.string().url()).min(1),
  specifications: z.record(z.string(), z.string()).default({}),
  features: z.array(z.string()).default([]),
  availabilityStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'PREORDER', 'DISCONTINUED']).default('IN_STOCK'),
  stockQuantity: z.number().int().min(0).default(0),
  priceStatus: z.enum(['VERIFIED', 'FALLBACK', 'TODO']).optional(),
  sourceUrl: z.string().url().optional().nullable(),
});

export const adminProductUpdateSchema = adminProductSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one product field is required',
);

export const adminInventoryUpdateSchema = z.object({
  stockQuantity: z.number().int().min(0),
  availabilityStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'PREORDER', 'DISCONTINUED']),
});

export const adminOrderListQuerySchema = z.object({
  status: z.enum(['PAYMENT_PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  customer: z.string().trim().optional(),
  date: z.string().trim().optional(),
});

export const adminOrderStatusSchema = z.object({
  status: z.enum(['PAYMENT_PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export const adminIdParamSchema = z.object({
  id: z.string().trim().min(1).max(120),
});

export const adminProductIdParamSchema = z.object({
  productId: z.string().trim().min(1).max(120),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;
export type AdminProductUpdateInput = z.infer<typeof adminProductUpdateSchema>;
export type AdminInventoryUpdateInput = z.infer<typeof adminInventoryUpdateSchema>;
export type AdminOrderStatusInput = z.infer<typeof adminOrderStatusSchema>;
