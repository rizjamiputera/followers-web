# syntax=docker/dockerfile:1.6

# ─── Builder ───────────────────────────────────────────────
FROM node:23.11.1-alpine3.22 AS builder
RUN apk add --no-cache python3 make g++
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ─── Runtime ───────────────────────────────────────────────
FROM node:23.11.1-alpine3.22 AS runtime
RUN apk add --no-cache tini
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

COPY --from=builder /app/.output ./.output

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "./.output/server/index.mjs"]
