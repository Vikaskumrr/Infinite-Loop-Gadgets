import { prisma } from '../src/config/prisma.js';
import { productRepository } from '../src/repositories/productRepository.js';
import { productService } from '../src/services/productService.js';

const runDatabaseTests = process.env.RUN_DATABASE_TESTS === 'true';
const describeDatabase = runDatabaseTests ? describe : describe.skip;

describeDatabase('product repository and service integration', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('finds seeded products through the repository', async () => {
    const total = await productRepository.count();
    const products = await productRepository.findAll({
      skip: 0,
      take: 5,
      orderBy: { rating: 'desc' },
    });

    expect(total).toBeGreaterThan(0);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]?.brand.name).toBeTruthy();
  });

  it('maps products to frontend-compatible DTOs through the service', async () => {
    const result = await productService.getProducts({
      page: 1,
      limit: 5,
      sort: 'rating',
    });

    expect(result.pagination.total).toBeGreaterThan(0);
    expect(result.products[0]).toEqual(expect.objectContaining({
      id: expect.any(String),
      slug: expect.any(String),
      name: expect.any(String),
      brand: expect.any(String),
      productImage: expect.any(String),
    }));
  });

  it('returns parent category counts including child products', async () => {
    const categories = await productService.getCategories();
    const electronics = categories.find((category) => category.slug === 'electronics');

    expect(electronics?.productCount).toBeGreaterThanOrEqual(electronics?.directProductCount || 0);
  });
});
