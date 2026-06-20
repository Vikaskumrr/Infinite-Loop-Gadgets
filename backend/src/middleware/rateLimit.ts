import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const defaultWindowMs = 60 * 1000;

const keyGenerator = (request: Parameters<ReturnType<typeof rateLimit>>[0]) =>
  request.auth?.userId || ipKeyGenerator(request.ip || 'anonymous');

export const createAuthenticatedRateLimit = (max: number, message: string) =>
  rateLimit({
    windowMs: defaultWindowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    message: {
      success: false,
      message,
      errorCode: 'RATE_LIMITED',
    },
  });

export const userFeatureRateLimit = createAuthenticatedRateLimit(
  120,
  'Too many user feature requests. Please slow down and try again shortly.',
);

export const cartRateLimit = createAuthenticatedRateLimit(
  90,
  'Too many cart requests. Please slow down and try again shortly.',
);
