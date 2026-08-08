# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# The backend base URL the built app should call. Defaults to the
# nginx-proxied same-origin /api path used in the docker-compose setup below;
# override at build time with --build-arg VITE_API_BASE_URL=... if needed.
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

# Rendered via nginx's built-in envsubst-on-templates entrypoint script into
# /etc/nginx/conf.d/default.conf at container startup, so BACKEND_UPSTREAM can
# be overridden per environment without rebuilding the image.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV BACKEND_UPSTREAM=backend:8080

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
