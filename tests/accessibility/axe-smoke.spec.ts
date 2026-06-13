import { describe, expect, test } from 'vitest';

// Axe accessibility smoke blueprint. Install @axe-core/playwright before enabling in CI.
export const axeRoutes = ['/', '/products', '/categories/electronics/smartphones', '/checkout/contact'];

describe('Axe accessibility blueprint', () => {
  test('documents critical routes for future axe scans', () => {
    expect(axeRoutes).toContain('/checkout/contact');
  });
});
