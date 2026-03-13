# Frontend Redesign Plan — BrighterProject

Sports property booking platform. Bold, energetic, athletic aesthetic.
Bulgarian/English i18n preserved throughout (Intlayer).

---

## Design System Reference

### Color Palette (OKLCH)
| Role | Light | Dark | Notes |
|------|-------|------|-------|
| `--primary` | `oklch(0.52 0.22 142)` | `oklch(0.68 0.22 142)` | Field green |
| `--accent` | `oklch(0.72 0.20 42)` | same | Electric orange — CTAs |
| `--background` | `oklch(0.98 0.005 265)` | `oklch(0.14 0.020 265)` | Cool white / deep navy |
| `--foreground` | `oklch(0.13 0.02 265)` | `oklch(0.96 0 0)` | |
| `--muted` | `oklch(0.94 0.005 265)` | `oklch(0.25 0.018 265)` | |
| `--card` | `oklch(1 0 0)` | `oklch(0.19 0.020 265)` | |

### Typography
- **Headings:** `Barlow Condensed` 700–800 (tight, punchy, athletic)
- **Body:** `Barlow` 400/500 (same family, clean readability)
- **Display numbers / prices / stats:** `Barlow Condensed` 800
- **Google Fonts import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=Barlow:wght@300;400;500;600;700&display=swap');
  ```

### Style Direction
- Large section spacing (`py-20` to `py-28`)
- Image-first cards with gradient overlays, no wimpy borders
- High-contrast CTAs (orange accent on dark or green background)
- Hover: subtle scale + colour shift (200ms ease)
- No emojis as icons — SVG/Lucide only
- Dark mode first for hero/dark sections; light mode for content sections

---

## Phase 1 — Design System Foundation
**File:** `src/styles.css`

**Changes:**
- Add Google Fonts `@import` (Barlow Condensed + Barlow) — must be first import
- Replace the entire `--primary` chain (currently black `oklch(0.205 0 0)`) with field green
- Add `--accent` / `--color-accent` token for electric orange CTAs
- Set `--font-display` CSS variable for Barlow Condensed
- Update dark mode variables (deep navy background, brighter green primary)
- Remove the triple-duplicate `@apply` lines in `@layer base` (lines 132–141 in current file)

**New CSS variable structure (`:root`):**
```css
--radius: 0.5rem;
--background:          oklch(0.98 0.005 265);
--foreground:          oklch(0.13 0.02 265);
--card:                oklch(1 0 0);
--card-foreground:     oklch(0.13 0.02 265);
--primary:             oklch(0.52 0.22 142);  /* field green */
--primary-foreground:  oklch(0.98 0 0);
--accent:              oklch(0.72 0.20 42);   /* electric orange */
--accent-foreground:   oklch(0.10 0 0);
--muted:               oklch(0.94 0.005 265);
--muted-foreground:    oklch(0.50 0.01 265);
--secondary:           oklch(0.94 0.008 265);
--secondary-foreground: oklch(0.25 0.02 265);
--border:              oklch(0.90 0.008 265);
--input:               oklch(0.90 0.008 265);
--ring:                oklch(0.52 0.22 142);
```

**Tailwind font registration in `@theme inline`:**
```css
--font-sans: 'Barlow', system-ui, sans-serif;
--font-display: 'Barlow Condensed', system-ui, sans-serif;
```

**Body rule:**
```css
body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
```

---

## Phase 2 — Header & Footer
**Files:** `src/components/templates/header.tsx`, `src/components/templates/footer.tsx`

### Header changes
- Replace `GalleryVerticalEnd` icon with a sport-appropriate icon (`Zap` or `Trophy`)
- Brand name: add `font-display` class (Barlow Condensed), slightly larger
- Nav links: `font-medium` weight, tighter letter-spacing
- Add accent CTA button "Резервирай" → `/properties` in header right area
- Sticky backdrop: keep `backdrop-blur-sm`, switch to `bg-background/80`
- Mobile menu: use `bg-card` instead of `bg-background/90`
- Keep all `useIntlayer` calls — classNames only

### Footer changes
- Remove `builtWith` credit text
- Remove dead links (`/about-us`, `/features`, `/pricing` — pages don't exist)
- Replace with real links: `/properties`, `/bookings`
- Replace `GalleryVerticalEnd` with `Trophy` or `Dumbbell` icon
- Keep copyright

---

## Phase 3 — Landing Page
**File:** `src/components/pages/landing.tsx`

Three bold sections. Current is 97 lines — new version ~200 lines.

### Section 1: Hero
- Full-bleed dark section (`bg-foreground text-background`)
- Massive heading: `font-display text-6xl md:text-8xl font-extrabold uppercase tracking-tight leading-none`
- Two CTAs: primary green "Намери обект" → `/properties`, ghost outline "Как работи?" → `#how-it-works` anchor
- Decorative diagonal stripe overlay (CSS `bg-[repeating-linear-gradient(...)]`, opacity 5%)
- Sport category pills using Lucide icons (no emojis): `Dumbbell`, `Trophy`, `Waves`, `Circle`

```tsx
<section className="relative bg-foreground text-background overflow-hidden py-24 lg:py-36">
  <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] bg-[length:12px_12px]" />
  <div className="container mx-auto px-6 relative z-10 text-center">
    <h1 className="font-display text-6xl md:text-8xl font-extrabold uppercase tracking-tight leading-none mb-6">
      {content.hero.title}
    </h1>
    ...
  </div>
</section>
```

### Section 2: Features Grid
- White background, 3 cards
- Card: icon in `text-primary` rounded square, heading `font-display`, description `Barlow`
- No border on cards, subtle shadow, `rounded-xl`, slight hover lift

### Section 3: How It Works (NEW)
- `id="how-it-works"`, light muted background
- 3 numbered steps: large condensed numbers in primary green, step title + description
- Steps: 1. Намери обект → 2. Резервирай → 3. Играй
- i18n key: `howItWorks` (add to `src/contents/landing.content.ts`)

### Section 4: Sports Categories
- Keep dark background
- Replace emoji icons with Lucide SVG sport icons
- Cards: 2×4 grid, dark card bg with green hover
- Category name in `font-display bold`
- Click → `/properties?sport={type}`

### i18n additions:
- `src/contents/landing.content.ts`: add `howItWorks: { title, steps: [{ number, title, description }] }`

---

## Phase 4 — Property List Page
**Files:**
- `src/features/Properties/components/property-card.tsx`
- `src/features/Properties/components/properties-list.tsx`

### PropertyCard redesign
Current: white card + border + text below image.

New — image-first with overlay:
- `aspect-[16/10]` image container with `rounded-xl overflow-hidden`
- Gradient overlay: `bg-gradient-to-t from-black/80 via-black/20 to-transparent`
- **Property name + city rendered on the image** (bottom-left, white `font-display`)
- Price badge: absolute top-right, `bg-accent text-accent-foreground rounded-full px-3 py-1`
- Sport type tags: bottom-right, small primary green pills
- Rating: bottom-left next to name, `⭐ 4.8` → replace star emoji with `Star` icon filled
- Hover: `group-hover:scale-[1.03]` on image, card shadow increase

### PropertiesList redesign
- Search bar: full-width, `rounded-xl`, left-aligned magnifier icon (`Search` from Lucide)
- Filters row: horizontal pills — Sport type, City, Indoor/Outdoor, Price range
  - Active pill: `bg-primary text-primary-foreground`
  - Inactive: `bg-muted hover:bg-muted/80`
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Empty state: `SearchX` Lucide icon + message + CTA to clear filters

---

## Phase 5 — Property Detail Page
**File:** `src/features/Properties/components/property-detail.tsx`

- Hero: full-width `aspect-[21/9]` image with dark overlay, property name in `font-display text-5xl`
- Gallery: horizontal scrollable thumbnail strip below hero (click to swap main image)
- Layout: 2-col on desktop — left (60%): info + working hours + amenities; right (40%): sticky booking card
- Booking card (sticky): price in `font-display text-3xl font-bold`, date/time pickers, green CTA
- Working hours: 7-day grid, bold = open, `text-muted-foreground` = closed
- Amenities: icon grid (Lucide: `ParkingCircle`, `Droplets`, `Wind`, `Wifi`, etc.)

---

## Phase 6 — Booking Flow
**Files:**
- `src/features/Bookings/components/booking-form.tsx`
- `src/features/Bookings/components/my-bookings.tsx`
- `src/features/Bookings/components/booking-details-sheet.tsx`

### Booking Form
- Single-column card `max-w-md` centered, `py-12`
- Date picker: primary green selected state
- Time slots: pill grid, green = available, muted = taken/past
- Price summary: subtotal + `font-display text-2xl` total
- Submit: full-width green `font-display font-bold text-lg`

### My Bookings
- Replace table with card list
- Booking card: property name (`font-display`), date range, status badge, price, action buttons
- Status badge colours: PENDING=amber, CONFIRMED=green, CANCELLED=destructive, COMPLETED=muted
- Tabs: Всички / Активни / Минали (search param `?tab=active`)
- Empty state per tab with sport icon + helpful CTA

### Booking Details Sheet
- Header: property name in `font-display`, sport type tag
- Status timeline (linear progress: Pending → Confirmed → Completed)
- Actions: Cancel (destructive variant), Pay (accent orange)

---

## Phase 7 — Auth Pages
**Files:**
- `src/features/Auth/components/form-wrapper.tsx`
- `src/features/Auth/components/login-form.tsx`
- `src/features/Auth/components/signup-form.tsx`

### FormWrapper
- Replace `/placeholder.svg` with sports-themed dark panel:
  - `bg-foreground` background (deep navy)
  - Decorative diagonal stripe (same CSS pattern as hero)
  - Large `font-display` tagline: "Намери своя обект. Резервирай. Играй."
  - `Brighter.BG` brand at bottom in muted white

### Login / Signup forms
- Brand logo + name (`font-display`) at top of left panel
- Input height: `h-11` (slightly larger than default)
- Submit: full-width primary green, `font-display font-bold`
- Google OAuth: bordered button with Google SVG icon
- Switch link: `text-primary underline-offset-4 hover:underline`

---

## Implementation Order

| Phase | What | Files | Est. |
|-------|------|-------|------|
| 1 | CSS variables + fonts | `styles.css` | ~20min |
| 2 | Header + Footer | `header.tsx`, `footer.tsx` | ~30min |
| 3 | Landing page | `landing.tsx`, `landing.content.ts` | ~60min |
| 4 | Property list + cards | `property-card.tsx`, `properties-list.tsx` | ~45min |
| 5 | Property detail | `property-detail.tsx` | ~45min |
| 6 | Booking flow | `booking-form.tsx`, `my-bookings.tsx`, `booking-details-sheet.tsx` | ~45min |
| 7 | Auth pages | `form-wrapper.tsx`, `login-form.tsx`, `signup-form.tsx` | ~30min |

Each phase is independently deployable. Phase 1 must go first (colours/fonts unblock everything else).

---

## Files NOT touched by this redesign
- All API hooks (`src/features/*/api/`) — no changes
- All Zod schemas — no changes
- TanStack Router config (`src/router.tsx`, `src/routes/`) — no changes
- i18n config (`intlayer.config.ts`) — no changes
- UI primitives in `src/components/ui/` — classNames only, no rewrites

---

## i18n Additions Required
| File | New keys | Phase |
|------|----------|-------|
| `src/contents/landing.content.ts` | `howItWorks.title`, `howItWorks.steps[3]` | 3 |
| `src/features/Properties/contents/properties.content.ts` | `filters.sport`, `filters.city`, `filters.indoor`, `filters.price` | 4 |

---

*Plan written: 2026-02-28. Start with Phase 1.*
