# Takı E-Ticaret Demo — Backend

Spring Boot 3 / Java 17 REST API for the jewelry e-commerce demo. Implements the contract in
`../API_CONTRACT.md`: categories, products (search/filter/sort/pagination), JWT auth, and a
demo checkout that persists orders as `RECEIVED` — no real payment gateway is integrated.

## Stack

- Spring Boot 3.3, Spring Web, Spring Data JPA, Spring Security (JWT via `jjwt`)
- PostgreSQL (runtime), H2 (tests)
- Bean Validation, Lombok, springdoc-openapi (Swagger UI)
- Spring Boot Actuator with Kubernetes-style health probe groups

## Running locally

### 1. Start Postgres

Use the repo-root `docker-compose.yml` (db `takidemo`, user `takidemo`), or point at any local
Postgres instance and set the env vars below to match.

### 2. Run the app

```bash
mvn spring-boot:run
```

This defaults to the `dev` profile and connects to `localhost:5432/takidemo` with user/password
`takidemo` — no extra configuration needed if you're using the default docker-compose setup.

On first boot it seeds 4 categories and 20 products automatically (skipped if data already exists).

### Environment variables (all optional, sane dev defaults provided)

| Variable | Default | Purpose |
|---|---|---|
| `DB_HOST` | `localhost` | Postgres host |
| `DB_PORT` | `5432` | Postgres port |
| `DB_NAME` | `takidemo` | Database name |
| `DB_USER` | `takidemo` | Database user |
| `DB_PASSWORD` | `takidemo` | Database password |
| `JWT_SECRET` | dev-only fallback | HMAC signing key for JWTs — **override this in any non-local environment** |
| `JWT_EXPIRATION_MS` | `86400000` (24h) | JWT token lifetime |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:80,http://localhost` | Comma-separated allowed frontend origins |
| `SPRING_PROFILES_ACTIVE` | `dev` | `dev`, `docker`, or `test` |

## API docs

With the app running, open:

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

Protected endpoints (`/api/auth/me`, `GET /api/orders`) need a bearer token — use the "Authorize"
button in Swagger UI with the token returned from `/api/auth/login`.

## Health checks

Kubernetes-style liveness/readiness probes are exposed via Actuator:

- `GET /actuator/health/liveness`
- `GET /actuator/health/readiness`

Both return 200 once the app has started and (for readiness) the database connection is healthy.

## Tests

```bash
mvn test
```

Tests run against an in-memory H2 database (`test` profile) — no live Postgres required.
Includes a `ProductService` unit test and `MockMvc` integration tests covering register/login/me,
product listing/filtering, and the guest checkout flow.

## Building

```bash
mvn clean package
java -jar target/backend.jar
```

## Docker

```bash
docker build -t taki-backend .
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e JWT_SECRET=change-me \
  taki-backend
```

Multi-stage build: Maven build stage → slim `eclipse-temurin:17-jre-alpine` runtime, exposing
port 8080, running as a non-root user.

## Security notes (demo-appropriate, not production-hardened)

- Passwords are hashed with BCrypt; minimum 8 characters enforced at registration.
- JWTs are signed with HS256; only non-sensitive identity claims (id, email, role) are embedded.
- `/api/auth/login` has a simple in-memory brute-force guard (5 failed attempts locks the email
  for 15 minutes). This is per-instance and resets on restart — fine for a demo, not a substitute
  for a real rate limiter in production.
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, a restrictive
  `Content-Security-Policy`) are set on every response.
- CSRF protection is disabled — the API is stateless and JWT-only (no cookie-based auth), so
  there's no ambient credential for CSRF to exploit.
- All error responses go through a single `@RestControllerAdvice` that maps exceptions to the
  `{timestamp, status, error, message, path}` shape from `API_CONTRACT.md`; raw stack traces,
  SQL, or internal exception text are never returned to the client.
