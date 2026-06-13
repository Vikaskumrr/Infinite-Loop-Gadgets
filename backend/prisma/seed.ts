import { AvailabilityStatus, CatalogSource, PriceStatus, PrismaClient } from '@prisma/client';
import { catalogSeedProducts, type CatalogSeedProduct } from '../src/catalogData.js';
import { slugify } from '../src/utils/slug.js';

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

interface MigrationReport {
  imported: number;
  skipped: Array<{ name?: string; reason: string }>;
  warnings: string[];
}

const findDuplicates = (values: Array<{ key: string; name?: string }>): string[] => {
  const seen = new Map<string, string | undefined>();
  const duplicates: string[] = [];

  for (const value of values) {
    const existingName = seen.get(value.key);
    if (seen.has(value.key)) {
      duplicates.push(`${value.key} (${existingName || 'unknown'} / ${value.name || 'unknown'})`);
    } else {
      seen.set(value.key, value.name);
    }
  }

  return duplicates;
};

const assertUniqueCatalogIdentity = (): void => {
  const identityRows = catalogSeedProducts.map((product) => ({
    id: product.id || slugify(`${product.brand}-${product.name}`),
    slug: product.slug || slugify(product.name),
    name: product.name,
  }));
  const duplicateIds = findDuplicates(identityRows.map((product) => ({ key: product.id, name: product.name })));
  const duplicateSlugs = findDuplicates(identityRows.map((product) => ({ key: product.slug, name: product.name })));

  if (duplicateIds.length > 0 || duplicateSlugs.length > 0) {
    throw new Error(`Catalog identity conflict. duplicateIds=${duplicateIds.join(', ') || 'none'} duplicateSlugs=${duplicateSlugs.join(', ') || 'none'}`);
  }
};

const toPriceStatus = (status: CatalogSeedProduct['priceStatus']): PriceStatus | undefined => {
  if (status === 'verified') return PriceStatus.VERIFIED;
  if (status === 'fallback') return PriceStatus.FALLBACK;
  if (status === 'todo') return PriceStatus.TODO;
  return undefined;
};

const toAvailabilityStatus = (status: CatalogSeedProduct['stockStatus']): AvailabilityStatus =>
  status === 'out-of-stock' ? AvailabilityStatus.OUT_OF_STOCK : AvailabilityStatus.IN_STOCK;

const ensureCategory = async (name: string, parentId?: string): Promise<string> => {
  const slug = slugify(name);
  const category = await prisma.category.upsert({
    where: { slug },
    update: {
      name,
      ...(parentId && { parentId }),
    },
    create: {
      name,
      slug,
      description: parentId ? `${name} products in the Infinite Gadget Loop catalog.` : undefined,
      parentId,
    },
  });

  return category.id;
};

const validateSeedProduct = (product: CatalogSeedProduct): string | null => {
  if (!product.name?.trim()) return 'Missing product name';
  if (!product.brand?.trim()) return 'Missing brand';
  if (!Number.isFinite(product.price) || product.price < 0) return 'Invalid price';
  if (!product.productImage?.trim()) return 'Missing product image';
  if (!product.category?.trim() && !product.subcategory?.trim()) return 'Missing category';
  return null;
};

const seedProducts = async (): Promise<MigrationReport> => {
  const report: MigrationReport = { imported: 0, skipped: [], warnings: [] };
  const seenSlugs = new Map<string, number>();
  assertUniqueCatalogIdentity();

  for (const product of catalogSeedProducts) {
    const invalidReason = validateSeedProduct(product);
    if (invalidReason) {
      report.skipped.push({ name: product.name, reason: invalidReason });
      continue;
    }

    if (!product.description) {
      report.warnings.push(`${product.name}: missing description`);
    }

    if (product.priceStatus === 'todo') {
      report.warnings.push(`${product.name}: price requires verification`);
    }

    const brandSlug = slugify(product.brand);
    const brand = await prisma.brand.upsert({
      where: { slug: brandSlug },
      update: { name: product.brand },
      create: {
        name: product.brand,
        slug: brandSlug,
      },
    });

    const parentCategoryId = product.category ? await ensureCategory(product.category) : undefined;
    const categoryId = product.subcategory
      ? await ensureCategory(product.subcategory, parentCategoryId)
      : parentCategoryId;

    if (!categoryId) {
      report.skipped.push({ name: product.name, reason: 'Unable to resolve category' });
      continue;
    }

    const baseSlug = product.slug || slugify(product.name);
    const occurrence = seenSlugs.get(baseSlug) ?? 0;
    seenSlugs.set(baseSlug, occurrence + 1);
    const slug = occurrence === 0 ? baseSlug : `${baseSlug}-${occurrence + 1}`;
    const id = product.id || slugify(`${product.brand}-${product.name}`);

    await prisma.product.upsert({
      where: { id },
      update: {
        slug,
        title: product.name,
        description: product.description || 'Product description pending catalog review.',
        brandId: brand.id,
        categoryId,
        price: product.price,
        currency: 'INR',
        images: {
          primary: product.productImage,
          source: product.imageSourceUrl,
        },
        specifications: {
          specifications: product.specifications || {},
          reviews: product.reviews || [],
          metadata: {
            color: product.color,
            priceDisplay: product.priceDisplay,
            badge: product.badge,
            compareAtPrice: product.compareAtPrice,
          },
        },
        features: product.features || [],
        rating: product.rating,
        reviewCount: product.reviews?.length || 0,
        sourceUrl: product.sourceUrl,
        catalogSource: CatalogSource.IMPORTED,
        priceStatus: toPriceStatus(product.priceStatus),
      },
      create: {
        id,
        slug,
        title: product.name,
        description: product.description || 'Product description pending catalog review.',
        brandId: brand.id,
        categoryId,
        price: product.price,
        currency: 'INR',
        images: {
          primary: product.productImage,
          source: product.imageSourceUrl,
        },
        specifications: {
          specifications: product.specifications || {},
          reviews: product.reviews || [],
          metadata: {
            color: product.color,
            priceDisplay: product.priceDisplay,
            badge: product.badge,
            compareAtPrice: product.compareAtPrice,
          },
        },
        features: product.features || [],
        rating: product.rating,
        reviewCount: product.reviews?.length || 0,
        sourceUrl: product.sourceUrl,
        catalogSource: CatalogSource.IMPORTED,
        priceStatus: toPriceStatus(product.priceStatus),
        inventory: {
          create: {
            stockQuantity: product.stockStatus === 'out-of-stock' ? 0 : 25,
            availabilityStatus: toAvailabilityStatus(product.stockStatus),
          },
        },
      },
    });

    report.imported += 1;
  }

  return report;
};

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

  const report = await seedProducts();
  const [brandCount, categoryCount, productCount] = await Promise.all([
    prisma.brand.count(),
    prisma.category.count(),
    prisma.product.count(),
  ]);

  console.info(`Seed complete: ${brandCount} brands, ${categoryCount} categories, ${productCount} products.`);
  console.info(`Product migration report: imported=${report.imported}, skipped=${report.skipped.length}, warnings=${report.warnings.length}`);

  if (report.skipped.length > 0) {
    console.warn('Skipped products:', report.skipped);
  }

  if (report.warnings.length > 0) {
    console.warn('Product migration warnings:', report.warnings);
  }
};

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
