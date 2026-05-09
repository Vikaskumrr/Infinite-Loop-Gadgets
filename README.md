# Infinite Loop Gadgets

Infinite Loop Gadgets is a Vite + React + TypeScript ecommerce demo for browsing premium tech products, viewing product details, managing a local cart, and walking through a demo checkout flow.

## Tech Stack

- React 18 with TypeScript
- Vite for local development and production builds
- SCSS component styles with shared design tokens
- React Router for client-side routes
- Vitest and Testing Library for unit/component tests
- npm with `package-lock.json`

## Getting Started

Use Node.js 22.19.0 or newer.

```bash
npm ci
npm run dev
```

The local app starts on the Vite dev server, usually `http://localhost:5173`.

## Scripts

```bash
npm run dev        # Start Vite locally
npm run build      # Typecheck and create a production build
npm run preview    # Preview the production build
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript without emitting files
npm run test       # Run Vitest in watch mode
npm run test:run   # Run Vitest once for CI
```

## Environment Variables

Create a local `.env` from `.env.example` when you need to override defaults.

```bash
VITE_PRODUCT_BIN_ID=68bf1a1ed0ea881f4076533c
VITE_PRODUCTS_API_URL=
VITE_GA_ID=
VITE_SENTRY_DSN=
```

Product data defaults to the existing JSONBin bin. `VITE_PRODUCTS_API_URL` can point to a direct endpoint that returns either `{ "record": { "products": [] } }` or `{ "products": [] }`.

## Routes

- `/` - Product storefront
- `/account` - Account details page
- `/about` - About page
- `/products` - Category/subcategory placeholder experience

No backend, database, real payment processing, or authentication service is implemented in this repository.

## Validation

Before shipping changes, run:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```
