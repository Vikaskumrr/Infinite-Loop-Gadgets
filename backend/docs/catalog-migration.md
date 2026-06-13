# Product Catalog Migration Mapping

Milestone 3B migrates the existing frontend catalog from `src/data/enrichedProducts.ts` into PostgreSQL through Prisma.

## Current Catalog

- Product count: 17
- Products with image URLs: 17
- Products with descriptions: 17
- Products requiring price verification: 10

## Field Mapping

| Frontend field | Database field | Notes |
| --- | --- | --- |
| `id` | `Product.id` | Preserved when present; otherwise generated as `slugify(brand-name)` to match existing localStorage identity. |
| `slug` | `Product.slug` | Preserved when present; otherwise generated from `name`. Duplicate slugs receive a numeric suffix during seed. |
| `name` | `Product.title` | API maps back to `name` for frontend compatibility. |
| `brand` | `Brand.name` / `Product.brandId` | Brands are normalized and upserted by slug. |
| `category` | Parent `Category` | Top-level categories are preserved. |
| `subcategory` | Child `Category` / `Product.categoryId` | Product points at the most specific category. |
| `price` | `Product.price` | Stored as `Decimal(12,2)`. |
| `productImage` | `Product.images.primary` | JSONB now, allowing gallery expansion later. |
| `imageSourceUrl` | `Product.images.source` | Preserves source attribution. |
| `specifications` | `Product.specifications.specifications` | Stored as JSONB to keep flexible gadget specs. |
| `reviews` | `Product.specifications.reviews` | Kept as metadata until a dedicated Review model is introduced. |
| `features` | `Product.features` | Stored as JSONB array. |
| `color` | `Product.specifications.metadata.color` | Returned as top-level `color` in API DTOs. |
| `priceDisplay` | `Product.specifications.metadata.priceDisplay` | Preserved for UI copy. |
| `priceStatus` | `Product.priceStatus` | Mapped to Prisma enum: `VERIFIED`, `FALLBACK`, `TODO`. |
| `sourceUrl` | `Product.sourceUrl` | Preserved. |
| `stockStatus` | `Inventory.availabilityStatus` | Defaults to in stock with quantity 25 unless marked out of stock. |

## Data Quality Notes

- 10 products are intentionally marked `todo` for price verification.
- No products are missing descriptions or primary image URLs in the current seed source.
- Review data remains source-backed catalog notes, not user-generated review persistence.

## Compatibility Rule

The product API returns frontend-compatible DTOs during this migration:

```json
{
  "id": "google-pixel-8-pro",
  "slug": "google-pixel-8-pro",
  "name": "Google Pixel 8 Pro",
  "brand": "Google",
  "price": 69999,
  "productImage": "https://...",
  "category": "Electronics",
  "subcategory": "Smartphones"
}
```

This avoids breaking wishlist, compare, recently viewed, route slugs, and cart behavior while the backend foundation grows.
