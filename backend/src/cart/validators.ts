import { z } from 'zod';

export const cartItemBodySchema = z.object({
  productId: z.string().trim().min(1).max(120),
  quantity: z.number().int().positive().max(50),
});

export const cartItemUpdateBodySchema = z.object({
  quantity: z.number().int().min(0).max(50),
});

export const cartItemParamSchema = z.object({
  productId: z.string().trim().min(1).max(120),
});
