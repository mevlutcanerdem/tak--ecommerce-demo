# API Contract — Takı E-Ticaret Demo

Backend base URL (dev): `http://localhost:8080/api`
All responses JSON. Errors: `{ "timestamp", "status", "error", "message", "path" }`.

## Auth
- `POST /api/auth/register` — body `{ name, email, password }` → 201 `{ id, name, email }`
- `POST /api/auth/login` — body `{ email, password }` → 200 `{ token, user: { id, name, email } }` (JWT, `Authorization: Bearer <token>` for protected routes)
- `GET /api/auth/me` — auth required → `{ id, name, email }`

## Categories
- `GET /api/categories` → `[{ id, name, slug, imageUrl }]`

## Products
- `GET /api/products?category=<slug>&search=<q>&sort=price_asc|price_desc|newest&page=0&size=12`
  → `{ content: [Product], totalElements, totalPages, page, size }`
- `GET /api/products/{slug}` → `Product`
- `GET /api/products/featured` → `[Product]` (subset flagged `featured=true`)

`Product` shape:
```json
{
  "id": 1,
  "slug": "altin-kalp-kolye",
  "name": "Altın Kalp Kolye",
  "description": "...",
  "price": 1499.90,
  "discountPrice": 1199.90,
  "material": "18 Ayar Altın",
  "stock": 12,
  "rating": 4.8,
  "featured": true,
  "isNew": false,
  "images": ["https://images.unsplash.com/...","..."],
  "category": { "id": 2, "name": "Kolyeler", "slug": "kolyeler" }
}
```

## Orders (demo checkout — no real payment gateway)
- `POST /api/orders` — guest or authed. Body:
```json
{
  "items": [{ "productId": 1, "quantity": 2 }],
  "shipping": { "fullName": "", "phone": "", "address": "", "city": "", "postalCode": "" },
  "email": "guest@example.com"
}
```
→ 201 `{ id, orderNumber, status: "RECEIVED", total, items: [...], createdAt }`
- `GET /api/orders/{id}` → order detail
- `GET /api/orders` — auth required → user's own orders

No real payment is processed — `POST /api/orders` just persists the order as a demo confirmation (status `RECEIVED`). Do not integrate any real payment gateway.

`GET /api/orders/{id}` is looked up by the **`orderNumber`** (e.g. `TK-20260808-A1B2C3`), not the numeric database id — the numeric id is sequential and would let anyone enumerate other customers' orders (IDOR). `orderNumber` is random/non-sequential, so it's safe to expose publicly for guest order confirmation while still being effectively unguessable.

## Seed data
Backend seeds ~4 categories (Yüzükler, Kolyeler, Küpeler, Bileklikler) and ~20 products on startup (CommandLineRunner / data.sql) so the frontend has real data to render against from day one. Use real Unsplash photo URLs (jewelry-related, `?w=800&q=80`) for images — do not use broken placeholders.

## Ports (local dev / docker-compose)
- Postgres: `5432` (db `takidemo`, user `takidemo`, password via `.env`)
- Backend (Spring Boot): `8080`
- Frontend (Vite dev): `5173` / (nginx in Docker): `80`, proxies `/api` → backend service `takidb-backend:8080` inside docker network / k8s service `backend`.
