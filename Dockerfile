# syntax=docker/dockerfile:1
# Black Bird: Revolução — static web build served by Nginx.
# Internal HTTP port: 8080
# Health check: GET /health.html

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG BUILD_COMMIT=unknown
ENV BUILD_COMMIT=$BUILD_COMMIT
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health.html >/dev/null || exit 1

USER nginx
