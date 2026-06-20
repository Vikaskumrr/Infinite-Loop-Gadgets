import { z } from 'zod';

export const checkoutSchema = z.object({
  email: z.string().trim().email().optional(),
  fullName: z.string().trim().min(1).max(120).optional(),
  shippingAddress: z.string().trim().min(1).max(240).optional(),
  paymentMethod: z.string().trim().min(1).max(120).optional(),
  couponCode: z.string().trim().min(1).max(60).optional(),
});

export const orderIdParamSchema = z.object({
  id: z.string().trim().min(1).max(120),
});
