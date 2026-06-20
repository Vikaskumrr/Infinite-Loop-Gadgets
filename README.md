# Infinite Loop Gadgets

Infinite Loop Gadgets is a Vite + React + TypeScript ecommerce storefront for browsing premium tech products, viewing product details, managing a guest or signed-in cart, placing authenticated demo orders, syncing account-backed wishlist, compare, and recently viewed data, and operating a lightweight internal commerce admin console.

## Tech Stack

- React 18 with TypeScript
- Vite for local development and production builds
- SCSS component styles with shared design tokens
- React Router for client-side routes
- Express + Prisma backend for catalog and user-feature APIs
- CartProvider for guest/authenticated cart state orchestration
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

When the backend is running locally, set:

```bash
VITE_API_URL=http://localhost:5000/api/v1
```

## Routes

- `/` - Product storefront
- `/account` - Profile editing plus authenticated order history
- `/about` - About page
- `/products` - Category product browsing, optionally filtered with `?category=smartphones`
- `/login` - Sign in
- `/register` - Create account
- `/wishlist` - Saved products
- `/compare` - Compare shortlist
- `/recently-viewed` - Browsing history
- `/admin` - Admin dashboard for commerce operations

The backend now provides product, authentication, wishlist, compare, recently viewed, cart, checkout, and order APIs. Profile editing remains browser-local for now, while order history is account-backed.

## Admin Platform

- Admin access is role-based. Users default to `CUSTOMER`; admin users must have `role = ADMIN` in the backend database.
- `/admin/products` manages catalog records.
- `/admin/inventory` manages stock and availability.
- `/admin/orders` manages order lifecycle progression.
- Frontend admin routes are protected, but backend RBAC is the real source of truth.

Guest browsing data in `localStorage` can be imported into a signed-in account after login. Guest cart items can also be merged into the authenticated cart, with backend inventory validation during import.

## Cart Architecture

- Signed-out visitors use a browser-local guest cart stored under `ilg.cart`.
- Signed-in users use the authenticated `/api/v1/cart` backend cart.
- The frontend `CartProvider` chooses the correct source automatically and exposes a single `useCart()` interface to components.
- When a user signs in and a guest cart exists, the app offers to import it into the account cart. Duplicate products merge by quantity and unavailable items are left behind locally with an error message.

## Checkout And Orders

- Checkout requires authentication and uses the persistent backend cart as the single source of truth.
- `POST /api/v1/orders/checkout` validates that the cart exists, contains items, and still has sufficient inventory.
- The backend creates an order, snapshots item pricing, deducts inventory, and clears the cart in one transaction.
- Order history is visible on `/account` for signed-in users.
- Supported lifecycle values are `payment_pending`, `confirmed`, `processing`, `shipped`, `delivered`, and `cancelled`.

## Validation

Before shipping changes, run:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```
