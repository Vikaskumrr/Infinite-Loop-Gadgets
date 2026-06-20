import { AvailabilityStatus, CatalogSource, OrderStatus, PriceStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { toProductDto } from '../services/productService.js';
import { slugify } from '../utils/slug.js';
import { adminRepository, type AdminOrderRecord, type TransactionClient } from './adminRepository.js';
import type { ProductWithRelations } from '../repositories/productRepository.js';
import type {
  AdminInventoryUpdateInput,
  AdminOrderStatusInput,
  AdminProductInput,
  AdminProductUpdateInput,
} from './validators.js';

export class AdminError extends Error {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

const orderStatusMap = {
  PAYMENT_PENDING: 'payment_pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

const toAdminProductDto = (product: ProductWithRelations) => ({
  ...toProductDto(product),
  description: product.description,
  brandId: product.brandId,
  brandSlug: product.brand.slug,
  categoryId: product.categoryId,
  categorySlug: product.category.slug,
  parentCategorySlug: product.category.parent?.slug,
  currency: product.currency,
  discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
  stockQuantity: product.inventory?.stockQuantity ?? 0,
  inventoryStatus: product.inventory?.availabilityStatus ?? 'OUT_OF_STOCK',
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});

const toAdminInventoryDto = (inventory: Awaited<ReturnType<typeof adminRepository.findInventory>>[number]) => ({
  id: inventory.id,
  productId: inventory.productId,
  stockQuantity: inventory.stockQuantity,
  availabilityStatus: inventory.availabilityStatus,
  lastUpdated: inventory.lastUpdated.toISOString(),
  product: {
    id: inventory.product.id,
    name: inventory.product.title,
    slug: inventory.product.slug,
    brand: inventory.product.brand.name,
    category: inventory.product.category.parent?.name || inventory.product.category.name,
    subcategory: inventory.product.category.parent ? inventory.product.category.name : undefined,
  },
});

const toAdminOrderDto = (order: AdminOrderRecord) => ({
  id: order.id,
  userId: order.userId,
  customer: {
    id: order.user.id,
    name: order.user.name,
    email: order.user.email,
  },
  status: orderStatusMap[order.status as keyof typeof orderStatusMap] ?? 'payment_pending',
  totalAmount: Number(order.totalAmount),
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product.title,
    quantity: item.quantity,
    price: Number(item.price),
  })),
});

const assertOrderTransition = (current: OrderStatus, next: OrderStatus) => {
  if (next === OrderStatus.CANCELLED) return;
  if (current === next) return;

  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PAYMENT_PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    CONFIRMED: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    SHIPPED: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[current].includes(next)) {
    throw new AdminError(`Cannot move order from ${current} to ${next}`, 'INVALID_ORDER_STATUS_TRANSITION', 409);
  }
};

const resolveBrand = async (brandName: string, tx: TransactionClient) => {
  const slug = slugify(brandName);
  const existing = await adminRepository.findBrandBySlug(slug);
  return existing ?? adminRepository.createBrand({ name: brandName, slug }, tx);
};

const resolveCategory = async (categoryName: string, subcategoryName: string | undefined, tx: TransactionClient) => {
  const parentSlug = slugify(categoryName);
  let parent = await adminRepository.findCategoryBySlug(parentSlug);
  if (!parent) {
    parent = await adminRepository.createCategory({ name: categoryName, slug: parentSlug }, tx);
  }

  if (!subcategoryName) {
    return parent;
  }

  const childSlug = slugify(subcategoryName);
  const existingChild = await adminRepository.findCategoryBySlug(childSlug);
  if (existingChild) {
    return existingChild;
  }

  return adminRepository.createCategory(
    {
      name: subcategoryName,
      slug: childSlug,
      parent: { connect: { id: parent.id } },
    },
    tx,
  );
};

export const adminService = {
  getDashboard: async () => {
    const [products, orders, inventory, recentOrders] = await Promise.all([
      adminRepository.findProducts(),
      adminRepository.findOrders({}),
      adminRepository.findInventory(),
      adminRepository.findOrders({}),
    ]);

    return {
      productCount: products.length,
      orderCount: orders.length,
      lowStockItems: inventory.filter((item) => item.stockQuantity <= 5).slice(0, 5).map(toAdminInventoryDto),
      recentOrders: recentOrders.slice(0, 5).map(toAdminOrderDto),
    };
  },

  getProducts: async (search?: string) => {
    const products = await adminRepository.findProducts(search);
    return products.map((product) => toAdminProductDto(product));
  },

  createProduct: async (input: AdminProductInput) => prisma.$transaction(async (tx: TransactionClient) => {
    const desiredSlug = slugify(input.slug || input.title);
    const existingProduct = await adminRepository.findProductBySlug(desiredSlug);
    if (existingProduct) {
      throw new AdminError('Product slug must be unique', 'PRODUCT_SLUG_CONFLICT', 409);
    }

    const brand = await resolveBrand(input.brand, tx);
    const category = await resolveCategory(input.category, input.subcategory, tx);
    const primaryImage = input.images[0];
    const product = await adminRepository.createProduct({
      slug: desiredSlug,
      title: input.title,
      description: input.description,
      brand: { connect: { id: brand.id } },
      category: { connect: { id: category.id } },
      price: input.price,
      discountPrice: input.discountPrice ?? undefined,
      currency: input.currency,
      images: {
        primary: primaryImage,
        gallery: input.images,
      },
      specifications: {
        specifications: input.specifications,
        metadata: {
          color: '',
        },
      },
      features: input.features,
      priceStatus: input.priceStatus ? PriceStatus[input.priceStatus] : PriceStatus.TODO,
      sourceUrl: input.sourceUrl ?? undefined,
      catalogSource: CatalogSource.ADMIN,
    }, tx);

    await adminRepository.upsertInventory(
      product.id,
      input.stockQuantity,
      AvailabilityStatus[input.availabilityStatus],
      tx,
    );

    return toAdminProductDto(await adminRepository.findProductById(product.id) as ProductWithRelations);
  }),

  updateProduct: async (id: string, input: AdminProductUpdateInput) => prisma.$transaction(async (tx: TransactionClient) => {
    const existing = await adminRepository.findProductById(id);
    if (!existing) {
      throw new AdminError('Product not found', 'PRODUCT_NOT_FOUND', 404);
    }

    let brandConnect = undefined;
    if (input.brand) {
      const brand = await resolveBrand(input.brand, tx);
      brandConnect = { connect: { id: brand.id } };
    }

    let categoryConnect = undefined;
    if (input.category) {
      const category = await resolveCategory(input.category, input.subcategory, tx);
      categoryConnect = { connect: { id: category.id } };
    }

    const nextSlug = input.slug || (input.title ? slugify(input.title) : undefined);
    if (nextSlug && nextSlug !== existing.slug) {
      const slugConflict = await adminRepository.findProductBySlug(nextSlug);
      if (slugConflict && slugConflict.id !== id) {
        throw new AdminError('Product slug must be unique', 'PRODUCT_SLUG_CONFLICT', 409);
      }
    }

    const currentImages = Array.isArray((existing.images as { gallery?: unknown }).gallery)
      ? ((existing.images as { gallery?: unknown }).gallery as string[])
      : [];
    const product = await adminRepository.updateProduct(
      id,
      {
        ...(nextSlug ? { slug: nextSlug } : {}),
        ...(input.title ? { title: input.title } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.discountPrice !== undefined ? { discountPrice: input.discountPrice } : {}),
        ...(input.currency ? { currency: input.currency } : {}),
        ...(brandConnect ? { brand: brandConnect } : {}),
        ...(categoryConnect ? { category: categoryConnect } : {}),
        ...(input.images
          ? {
              images: {
                primary: input.images[0],
                gallery: input.images,
              },
            }
          : currentImages.length > 0
            ? undefined
            : {}),
        ...(input.specifications || input.features
          ? {
              specifications: {
                specifications: input.specifications ?? {},
                metadata: {
                  color: '',
                },
              },
              features: input.features ?? [],
            }
          : {}),
        ...(input.priceStatus ? { priceStatus: PriceStatus[input.priceStatus] } : {}),
        ...(input.sourceUrl !== undefined ? { sourceUrl: input.sourceUrl ?? null } : {}),
      },
      tx,
    );

    if (input.stockQuantity !== undefined || input.availabilityStatus !== undefined) {
      await adminRepository.upsertInventory(
        product.id,
        input.stockQuantity ?? product.inventory?.stockQuantity ?? 0,
        AvailabilityStatus[input.availabilityStatus ?? product.inventory?.availabilityStatus ?? 'OUT_OF_STOCK'],
        tx,
      );
    }

    return toAdminProductDto(await adminRepository.findProductById(product.id) as ProductWithRelations);
  }),

  deleteProduct: async (id: string) => {
    const existing = await adminRepository.findProductById(id);
    if (!existing) {
      throw new AdminError('Product not found', 'PRODUCT_NOT_FOUND', 404);
    }

    const [cartRefs, orderRefs, wishlistRefs, compareRefs] = await adminRepository.countProductDependencies(id);
    if (cartRefs > 0 || orderRefs > 0 || wishlistRefs > 0 || compareRefs > 0) {
      throw new AdminError('Product is referenced by existing commerce data and cannot be deleted safely.', 'PRODUCT_IN_USE', 409);
    }

    await prisma.$transaction(async (tx: TransactionClient) => {
      await adminRepository.deleteProduct(id, tx);
    });
  },

  getInventory: async () => {
    const inventory = await adminRepository.findInventory();
    return inventory.map(toAdminInventoryDto);
  },

  updateInventory: async (productId: string, input: AdminInventoryUpdateInput) => {
    const product = await adminRepository.findProductById(productId);
    if (!product) {
      throw new AdminError('Product not found', 'PRODUCT_NOT_FOUND', 404);
    }

    const inventory = await adminRepository.updateInventory(
      productId,
      input.stockQuantity,
      AvailabilityStatus[input.availabilityStatus],
    );
    return toAdminInventoryDto(inventory);
  },

  getOrders: async (filters: { status?: string; customer?: string; date?: string }) => {
    const where = {
      ...(filters.status ? { status: filters.status as OrderStatus } : {}),
      ...(filters.customer
        ? {
            OR: [
              { user: { email: { contains: filters.customer, mode: 'insensitive' as const } } },
              { user: { name: { contains: filters.customer, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
      ...(filters.date
        ? {
            createdAt: {
              gte: new Date(`${filters.date}T00:00:00.000Z`),
              lte: new Date(`${filters.date}T23:59:59.999Z`),
            },
          }
        : {}),
    };
    const orders = await adminRepository.findOrders(where);
    return orders.map(toAdminOrderDto);
  },

  getOrderById: async (id: string) => {
    const order = await adminRepository.findOrderById(id);
    if (!order) {
      throw new AdminError('Order not found', 'ORDER_NOT_FOUND', 404);
    }

    return toAdminOrderDto(order);
  },

  updateOrderStatus: async (id: string, input: AdminOrderStatusInput) => {
    const order = await adminRepository.findOrderById(id);
    if (!order) {
      throw new AdminError('Order not found', 'ORDER_NOT_FOUND', 404);
    }

    const nextStatus = OrderStatus[input.status];
    assertOrderTransition(order.status, nextStatus);
    const updatedOrder = await adminRepository.updateOrderStatus(id, nextStatus);
    return toAdminOrderDto(updatedOrder);
  },
};
