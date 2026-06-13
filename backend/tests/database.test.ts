import { prisma } from '../src/config/prisma.js';

const runDatabaseTests = process.env.RUN_DATABASE_TESTS === 'true';

const describeDatabase = runDatabaseTests ? describe : describe.skip;

describeDatabase('database connection', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('initializes Prisma and executes a basic query', async () => {
    const result = await prisma.$queryRaw<Array<{ healthcheck: number }>>`SELECT 1 as healthcheck`;

    expect(result[0]?.healthcheck).toBe(1);
  });
});
