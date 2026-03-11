###############################################
# CRM Frontend — Production Dockerfile
# Multi-stage: build with Node, serve with nginx
###############################################

# ---- Stage 1: Install dependencies ----
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm ci --ignore-scripts --cache /tmp/.npm

# ---- Stage 2: Build the Vite app ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ---- Stage 3: Serve with nginx ----
FROM nginx:1.27-alpine AS production

LABEL maintainer="CRM Team"
LABEL description="CRM Frontend — React SPA served via nginx"

RUN apk add --no-cache gettext

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY nginx-ssl.conf /etc/nginx/nginx-ssl.conf.template

ENV DOMAIN=localhost

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
