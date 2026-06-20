import { z } from 'zod';

export const productIdParamSchema = z.object({
  productId: z.string().trim().min(1).max(120),
});
