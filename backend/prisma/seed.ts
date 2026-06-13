import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const brands = [
  { name: 'Apple', slug: 'apple' },
  { name: 'Google', slug: 'google' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Sony', slug: 'sony' },
  { name: 'Nintendo', slug: 'nintendo' },
  { name: 'Logitech', slug: 'logitech' },
];

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Phones, laptops, tablets, wearables, and everyday personal technology.',
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    description: 'Consoles, PC gaming gear, and immersive entertainment hardware.',
  },
  {
    name: 'Home & Office',
    slug: 'home-and-office',
    description: 'Smart home, productivity, monitors, and office technology.',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Audio, charging, power, and companion accessories.',
  },
];

const main = async (): Promise<void> => {
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name },
      create: brand,
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
  }

  const [brandCount, categoryCount] = await Promise.all([
    prisma.brand.count(),
    prisma.category.count(),
  ]);

  console.info(`Seed complete: ${brandCount} brands, ${categoryCount} categories.`);
};

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
