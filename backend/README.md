# Infinite Gadget Loop Backend

Production-style Express API foundation for the Infinite Gadget Loop ecommerce project.

This milestone includes the backend shell, health endpoint, and Prisma/PostgreSQL database foundation. Product APIs, authentication, and business workflows will be added in later milestones.

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

Products are intentionally not seeded yet. Product catalog migration belongs to the next database milestone.

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

## Architecture

- `src/app.ts`: Express initialization, middleware, routes, error handling.
- `src/server.ts`: server startup and graceful shutdown.
- `src/config/env.ts`: Zod-backed environment validation.
- `src/config/prisma.ts`: singleton Prisma Client and database shutdown helper.
- `src/middleware`: request logging, not-found handling, centralized error handling.
- `src/routes`: versioned API routes.
- `src/utils`: shared API response helpers and async route wrapper.
- `src/types`: shared API response types.
- `prisma/schema.prisma`: database schema.
- `prisma/seed.ts`: seed script for reference data.
