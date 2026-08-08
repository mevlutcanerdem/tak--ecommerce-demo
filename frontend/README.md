# Aurelia — Takı E-Ticaret Frontend

React 18 + TypeScript + Vite frontend for the Aurelia jewelry demo store. Built
against the REST contract defined in `API_CONTRACT.md` at the repo root.

## Stack

- React 18, TypeScript, Vite
- React Router v6 for routing
- Axios for the API client (`src/lib/api.ts`)
- Zustand (with `persist`) for cart and auth state, stored in `localStorage`
- `@tanstack/react-query` for server state, caching and loading/error states
- Tailwind CSS for styling (custom cream / charcoal / gold jewelry-brand theme)
- ESLint (flat config) + Prettier

## Local development

Requires Node.js 20+.

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if your backend runs elsewhere
npm run dev
```

The app runs at `http://localhost:5173` and expects the backend at
`http://localhost:8080/api` by default (see `.env.example`). The backend does
not need to be running for the app to load — pages show loading skeletons and
graceful error/empty states when API calls fail.

### Other scripts

```bash
npm run build     # type-check (tsc -b) + production build to dist/
npm run preview   # preview the production build locally
npm run lint       # ESLint
npm run format     # Prettier --write
```

## Project structure

```
src/
  components/
    layout/     Header, Footer, Layout, ProtectedRoute, Logo, ScrollToTop
    ui/         Generic building blocks (Skeleton, Badge, PriceTag, Rating, ...)
    product/    ProductCard, ProductGrid and their skeleton states
    home/       Homepage-only sections (Hero, CategoryShowcase, ...)
  pages/        One component per route (see below)
  hooks/        React Query hooks wrapping the API client
  store/        Zustand stores (cart, auth)
  lib/          api.ts (typed Axios client), utils.ts, validation.ts
  types/        Shared TypeScript types mirroring API_CONTRACT.md
```

## Routes

| Path                         | Page                                                             |
| ---------------------------- | ---------------------------------------------------------------- |
| `/`                          | Home — hero, featured products, category showcase, trust section |
| `/urunler`                   | Shop — filters, search, sort, pagination                         |
| `/urun/:slug`                | Product detail — gallery, price, quantity, related products      |
| `/sepet`                     | Cart                                                             |
| `/odeme`                     | Checkout — shipping form + demo order submission                 |
| `/siparis-onay/:orderNumber` | Order confirmation                                               |
| `/giris`                     | Login                                                            |
| `/kayit`                     | Register                                                         |
| `/hesabim`                   | Account (protected) — order history                              |
| `*`                          | 404                                                              |

## Demo checkout

This is a demo store. Checkout does **not** integrate any real payment
gateway — no card fields are collected. `POST /api/orders` simply persists
the order as a demo confirmation, and the UI says so explicitly.

## Security notes

- No `dangerouslySetInnerHTML` is used anywhere; all API-sourced text (product
  names/descriptions, etc.) goes through React's default escaping.
- The JWT is persisted to `localStorage` via Zustand's `persist` middleware
  for simplicity (see the comment in `src/store/authStore.ts` for the
  tradeoff vs. httpOnly cookies) — it is never logged or placed in a URL.
- Login/register/checkout forms validate client-side (required fields, email
  format, phone format) before submitting, purely for UX — the backend is the
  real validation boundary.
- `VITE_API_BASE_URL` is the only environment variable baked into the client
  bundle; never put secrets in `VITE_*` variables since they ship to the
  browser in plaintext.
- `nginx.conf.template` sets `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy` and a `Content-Security-Policy` on the production build.

## Docker

```bash
docker build -t aurelia-frontend .
docker run -p 8080:80 -e BACKEND_UPSTREAM=backend:8080 aurelia-frontend
```

The multi-stage `Dockerfile` builds the app with Node, then serves the static
`dist/` output with nginx. `nginx.conf.template` serves the SPA (falling back
to `index.html` for client-side routes) and reverse-proxies `/api/*` to
`BACKEND_UPSTREAM` (default `backend:8080`, matching the docker-compose
service name in `API_CONTRACT.md`) via nginx's built-in envsubst templating,
so the upstream can be overridden per environment without rebuilding.
