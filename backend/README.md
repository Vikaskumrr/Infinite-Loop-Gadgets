# Infinite Gadget Loop Backend

Production-style Express API foundation for the Infinite Gadget Loop ecommerce project.

This milestone includes the backend shell, health endpoint, Prisma/PostgreSQL database foundation, product catalog API, JWT-based user identity foundation, authenticated user-feature persistence for wishlist, compare, and recently viewed products, persistent cart APIs, authenticated order creation with inventory deduction, and an RBAC-protected admin commerce module. Payments remain out of scope.

## Requirements

- Node.js 20+
- npm
- Docker, optional for the PostgreSQL placeholder

## Install

```bash
cd backend
npm install
```

## Environment

Create a local `.env` file from `.env.example`.

```bash
cp .env.example .env
```

Variables:

- `PORT`: API port. Defaults to `5000`.
- `NODE_ENV`: `development`, `test`, or `production`.
- `DATABASE_URL`: PostgreSQL connection string reserved for the Prisma milestone.
- `FRONTEND_URL`: allowed browser origin for CORS, usually `http://localhost:5173`.
- `JWT_SECRET`: signing secret for access tokens. Use at least 32 characters and never commit production secrets.
- `JWT_EXPIRES_IN`: access token lifetime, for example `1h` or `15m`.
- `COMPARE_MAX_ITEMS`: maximum compare products allowed per signed-in user.
- `RECENTLY_VIEWED_LIMIT`: maximum stored recently viewed products per signed-in user.
- `CART_MAX_QUANTITY_PER_ITEM`: maximum per-product quantity accepted by the cart API.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run test
npm run typecheck
npm run lint
```

## PostgreSQL Placeholder

PostgreSQL runs through Docker Compose for local development.

```bash
docker compose up -d postgres
```

The default connection string in `.env.example` matches the Docker Compose credentials:

```text
postgresql://infinite_loop:infinite_loop_password@localhost:5432/infinite_loop_gadgets
```

## Prisma

Generate Prisma Client:

```bash
npm run prisma:generate
```

Create and apply a local migration:

```bash
npm run prisma:migrate -- --name init
```

Seed initial reference data:

```bash
npm run prisma:seed
```

Current seed scope:

- Brands
- Categories
- Products
- Inventory

Product data is migrated from the existing frontend catalog snapshot in `src/catalogData.ts`.

Useful workflow for local database setup:

```bash
cp .env.example .env
docker compose up -d postgres
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run test
```

## API

Base path:

```text
/api/v1
```

Health:

```bash
curl http://localhost:5000/api/v1/health
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "healthy"
  },
  "message": "API is running"
}
```

Products:

```bash
curl "http://localhost:5000/api/v1/products?page=1&limit=20&category=smartphones&sort=rating"
```

Supported query parameters:

- `page`
- `limit`
- `search`
- `category`
- `brand`
- `sort`: `price-asc`, `price-desc`, `rating`, `newest`
- `minPrice`
- `maxPrice`

Product by ID or slug:

```bash
curl http://localhost:5000/api/v1/products/google-pixel-8-pro
curl http://localhost:5000/api/v1/products/pixel-8-pro
```

Categories:

```bash
curl http://localhost:5000/api/v1/categories
```

Authentication:

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"secure-password"}'
```

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"secure-password"}'
```

```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <access-token>"
```

```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer <access-token>"
```

Authentication notes:

- Passwords are hashed before storage and never returned by API responses.
- JWTs contain only the user id and expire according to `JWT_EXPIRES_IN`.
- Logout is currently stateless because refresh tokens and server-side sessions are out of scope for this milestone.
- The frontend stores the access token in localStorage for the portfolio foundation. A production deployment should move session storage to secure, httpOnly cookies before handling sensitive account data.
- Admin access is enforced server-side through the `User.role` column and the `requireAdmin` middleware. Frontend route protection is only a UX layer on top.

User features:

```bash
curl http://localhost:5000/api/v1/users/me/wishlist \
  -H "Authorization: Bearer <access-token>"
```

```bash
curl -X POST http://localhost:5000/api/v1/users/me/wishlist/<product-id> \
  -H "Authorization: Bearer <access-token>"
```

```bash
curl -X DELETE http://localhost:5000/api/v1/users/me/wishlist/<product-id> \
  -H "Authorization: Bearer <access-token>"
```

```bash
curl http://localhost:5000/api/v1/users/me/compare \
  -H "Authorization: Bearer <access-token>"
```

```bash
curl -X POST http://localhost:5000/api/v1/users/me/compare/<product-id> \
  -H "Authorization: Bearer <access-token>"
```

```bash
curl http://localhost:5000/api/v1/users/me/recently-viewed \
  -H "Authorization: Bearer <access-token>"
```

```bash
curl -X POST http://localhost:5000/api/v1/users/me/recently-viewed/<product-id> \
  -H "Authorization: Bearer <access-token>"
```

User feature notes:

- Wishlist and compare prevent duplicates.
- Compare respects `COMPARE_MAX_ITEMS`.
- Recently viewed keeps the newest products first and trims older items to `RECENTLY_VIEWED_LIMIT`.
- Guest browser data still exists on the frontend and can be imported into a signed-in account after login.

Cart:

```bash
curl http://localhost:5000/api/v1/cart \
  -H "Authorization: Bearer <access-token>"
```

```bash
curl -X POST http://localhost:5000/api/v1/cart/items \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{"productId":"pixel-8-pro","quantity":1}'
```

```bash
curl -X PATCH http://localhost:5000/api/v1/cart/items/pixel-8-pro \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{"quantity":2}'
```

```bash
curl -X DELETE http://localhost:5000/api/v1/cart/items/pixel-8-pro \
  -H "Authorization: Bearer <access-token>"
```

Orders:

```bash
curl http://localhost:5000/api/v1/orders \
  -H "Authorization: Bearer <access-token>"
```

```bash
curl http://localhost:5000/api/v1/orders/<order-id> \
  -H "Authorization: Bearer <access-token>"
```

```bash
curl -X POST http://localhost:5000/api/v1/orders/checkout \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","fullName":"Ada Lovelace","shippingAddress":"12 Loop Street","paymentMethod":"Demo card ending 4242"}'
```

Order notes:

- Checkout always recalculates totals from the backend catalog and ignores any frontend price assumptions.
- Inventory deduction, order creation, and cart clearing run inside one database transaction.
- Order items store a price snapshot so future product price changes do not rewrite old orders.
- Supported order lifecycle values are `PAYMENT_PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, and `CANCELLED`.

Admin:

```bash
curl http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer <admin-access-token>"
```

```bash
curl http://localhost:5000/api/v1/admin/products \
  -H "Authorization: Bearer <admin-access-token>"
```

```bash
curl -X POST http://localhost:5000/api/v1/admin/products \
  -H "Authorization: Bearer <admin-access-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Loop Phone Ultra","description":"Flagship demo phone","price":99999,"brand":"Infinite","category":"Phones","images":["https://example.com/phone.png"],"specifications":{"Display":"OLED"},"features":["AI camera"],"availabilityStatus":"IN_STOCK","stockQuantity":12}'
```

```bash
curl http://localhost:5000/api/v1/admin/inventory \
  -H "Authorization: Bearer <admin-access-token>"
```

```bash
curl -X PATCH http://localhost:5000/api/v1/admin/orders/<order-id>/status \
  -H "Authorization: Bearer <admin-access-token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"PROCESSING"}'
```

Admin notes:

- `User.role` defaults to `CUSTOMER`; promote an account to `ADMIN` directly in PostgreSQL or Prisma Studio for local setup.
- Admin product writes validate required fields, enforce unique slugs, and upsert inventory together with catalog changes.
- Admin order transitions allow `CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED`, plus `any -> CANCELLED`.

```bash
curl -X DELETE http://localhost:5000/api/v1/cart \
  -H "Authorization: Bearer <access-token>"
```

Cart notes:

- One active cart exists per user.
- Product pricing always comes from the backend catalog, never from frontend input.
- Inventory is checked for every add and quantity update.
- The cart API returns full product details, line subtotals, cart subtotal, and item count.
- Guest carts remain local until sign-in, then the frontend can merge them into the authenticated cart.

## Architecture

- `src/app.ts`: Express initialization, middleware, routes, error handling.
- `src/server.ts`: server startup and graceful shutdown.
- `src/config/env.ts`: Zod-backed environment validation.
- `src/config/prisma.ts`: singleton Prisma Client and database shutdown helper.
- `src/middleware`: request logging, not-found handling, centralized error handling.
- `src/routes`: versioned API routes.
- `src/controllers`: HTTP request/response orchestration.
- `src/services`: business logic, pagination, filtering, DTO mapping.
- `src/repositories`: Prisma database access.
- `src/utils`: shared API response helpers and async route wrapper.
- `src/types`: shared API response types.
- `src/auth`: authentication controller, service, repository, validators, token helpers, and auth middleware.
- `src/userFeatures`: authenticated wishlist, compare, and recently viewed controllers, services, repositories, validators, and routes.
- `src/cart`: authenticated cart controllers, services, repositories, validators, and routes.
- `prisma/schema.prisma`: database schema.
- `prisma/seed.ts`: seed script for reference data.
- `docs/catalog-migration.md`: frontend-to-database product migration mapping.
