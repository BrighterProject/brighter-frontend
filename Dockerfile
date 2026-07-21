# syntax=docker/dockerfile:1.4

# ---- deps stage ----
FROM oven/bun:1-alpine AS deps
WORKDIR /app

COPY package.json bun.lock* ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# ---- build stage ----
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

ARG VITE_TURNSTILE_SITE_KEY
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY

# SEO: absolute origin for canonical/hreflang/OG URLs (never hardcoded in code).
ARG VITE_SITE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL

# SEO: "true" only on the prod build allows search indexing; unset otherwise
# emits robots noindex (fail-safe so non-prod images never leak).
ARG VITE_SEO_INDEXABLE
ENV VITE_SEO_INDEXABLE=$VITE_SEO_INDEXABLE

# Self-hosted Umami analytics (cookieless, consent-gated). Both required or
# the script no-ops. Public values — they ship in the client bundle.
ARG VITE_UMAMI_SRC
ENV VITE_UMAMI_SRC=$VITE_UMAMI_SRC

ARG VITE_UMAMI_WEBSITE_ID
ENV VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun run build

# ---- production stage ----
FROM oven/bun:1-alpine AS production
WORKDIR /app

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
