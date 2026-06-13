# Infinite Gadget Loop Backend

Production-style Express API foundation for the Infinite Gadget Loop ecommerce project.

This milestone includes the backend shell, health endpoint, Prisma/PostgreSQL database foundation, product catalog API, and JWT-based user identity foundation. Cart persistence, orders, payments, and admin workflows will be added in later milestones.

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
- `prisma/schema.prisma`: database schema.
- `prisma/seed.ts`: seed script for reference data.
- `docs/catalog-migration.md`: frontend-to-database product migration mapping.
