import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1).optional(),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(32).default('development-only-jwt-secret-change-before-production'),
  JWT_EXPIRES_IN: z.string().min(1).default('1h'),
  COMPARE_MAX_ITEMS: z.coerce.number().int().positive().max(10).default(4),
  RECENTLY_VIEWED_LIMIT: z.coerce.number().int().positive().max(50).default(8),
  CART_MAX_QUANTITY_PER_ITEM: z.coerce.number().int().positive().max(50).default(10),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
  throw new Error(`Invalid backend environment configuration: ${details}`);
}

export const env = parsedEnv.data;
