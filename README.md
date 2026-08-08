# Takı E-Ticaret Demo

Profesyonel bir mücevher (takı) e-ticaret sitesi için uçtan uca demo proje. Gerçek bir ödeme altyapısı **kullanılmamaktadır** — sipariş akışı yalnızca demo/gösterim amaçlıdır.

## Mimari

```
┌────────────┐      /api      ┌──────────────┐      JDBC      ┌────────────┐
│  Frontend  │ ─────────────▶ │   Backend    │ ─────────────▶ │ PostgreSQL │
│ React + TS │  (nginx proxy) │ Spring Boot  │                │            │
│  Tailwind  │                │  + Spring    │                │            │
│            │ ◀───────────── │  Security/JWT│ ◀───────────── │            │
└────────────┘   JSON / REST  └──────────────┘                └────────────┘
```

- **frontend/** — React 18 + TypeScript + Vite + Tailwind CSS. Bkz. [frontend/README.md](frontend/README.md)
- **backend/** — Spring Boot 3 + Java 17 + PostgreSQL + JWT auth. Bkz. [backend/README.md](backend/README.md)
- **k8s/** — Yerel (Minikube / Docker Desktop) Kubernetes manifestleri. Bkz. [k8s/README.md](k8s/README.md)
- **.github/workflows/** — GitHub Actions: backend build+test, frontend build+lint, Docker image build & GHCR publish
- **API_CONTRACT.md** — Frontend/backend arası REST API sözleşmesi

## Hızlı başlangıç (Docker Compose — önerilen)

```bash
cp .env.example .env
docker compose up --build
```
- Frontend: http://localhost
- Backend API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui.html

## Yerel geliştirme (Docker olmadan)

Backend ve frontend'i ayrı ayrı çalıştırmak için ilgili klasörlerdeki README dosyalarına bakın. Postgres için `docker compose up postgres` yeterlidir.

## Kubernetes (yerel cluster)

Bkz. [k8s/README.md](k8s/README.md) — Minikube veya Docker Desktop Kubernetes üzerinde çalıştırma adımları.

## CI/CD

Her push/PR'da:
- `backend-ci.yml` — Maven build + test
- `frontend-ci.yml` — npm build + lint
- `docker-build.yml` — her iki servis için Docker image build (main'e push'ta GHCR'a yayınlanır)

## Kapsam dışı

Bu bir **demo/gösterim** projesidir:
- Gerçek bir ödeme sağlayıcısı (Stripe/iyzico/PayPal vb.) entegre edilmemiştir.
- k8s/docker-compose içindeki gizli anahtarlar yalnızca yerel geliştirme içindir, production'da kullanılmamalıdır.
- Ürün görselleri Unsplash'ten temin edilmiştir, gerçek ürün fotoğrafı değildir.
