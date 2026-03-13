# brighter-frontend

Public-facing property booking portal. Supports property browsing, booking grid, and Stripe payment flow.

**Runtime:** Vite + Bun | **Port (dev):** `3000`

## Stack

- TanStack Router v1 / Start (SSR, file-based routing)
- TanStack Query v5 + TanStack Form v1
- Tailwind 4 + shadcn/ui + framer-motion
- intlayer (i18n, `en` / `bg`, prefix-all mode)

## Commands

```bash
bun install
bun run dev          # dev server on :3000
bun run build        # production build
bun run test         # vitest
bunx intlayer build  # regenerate i18n types after editing *.content.ts
```

## Project layout

```
src/
  routes/{-$locale}/   # file-based routes; $locale = en | bg
  features/
    Auth/              # login, signup, token storage
    Bookings/          # 7-day grid, my-bookings list, details sheet
    Properties/            # listing, filters, detail page
  lib/
    api-client.ts      # shared axios → http://localhost:80, injects Bearer token
```

> `src/routeTree.gen.ts` is auto-generated — never edit manually.

## Key notes

- API calls go through `src/lib/api-client.ts` (Traefik on port 80).
- After Stripe Checkout, Stripe redirects to `/en/bookings?payment=success|cancelled`.
- i18n content declarations live next to components as `*.content.ts` files.
- HTML attributes (placeholder, aria-label) need `.value as string` — intlayer nodes render fine as JSX children.
- Booking grid weekday mapping: `String((new Date().getDay() + 6) % 7)` → `"0"` = Monday.
