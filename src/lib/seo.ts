/**
 * Centralized SEO head builder — the single source of truth for `<title>`,
 * meta, canonical/hreflang links, Open Graph / Twitter cards and JSON-LD.
 *
 * Every route `head()` funnels through {@link buildSeo} so metadata stays
 * consistent and absolute URLs are derived from `VITE_SITE_URL` rather than
 * hardcoded per route.
 */

/** Locales carried in the URL (intlayer `prefix-all`, bg default). */
export const SEO_LOCALES = ["bg", "en"] as const;
export type SeoLocale = (typeof SEO_LOCALES)[number];
const DEFAULT_LOCALE: SeoLocale = "bg";

/** Production host — fallback only; real value comes from `VITE_SITE_URL`. */
const SITE_FALLBACK = "https://pochivka-na-moreto.bg";

/** Localized brand name used for `og:site_name`. */
export const SITE_NAME: Record<SeoLocale, string> = {
  bg: "Почивка на морето",
  en: "SeasideHoliday",
};

/** `og:locale` values keyed by URL locale. */
const OG_LOCALE: Record<SeoLocale, string> = {
  bg: "bg_BG",
  en: "en_US",
};

/** Default share image when a page supplies none — a real asset in `public/`. */
const DEFAULT_OG_IMAGE = "/logo512.png";

/** A `<meta>` descriptor accepted by TanStack Router's `head()`. */
export interface SeoMeta {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
}

/** A `<link>` descriptor accepted by TanStack Router's `head()`. */
export interface SeoLink {
  rel: string;
  href: string;
  hrefLang?: string;
}

/** An inline `<script>` descriptor (used for JSON-LD). */
export interface SeoScript {
  type: string;
  children: string;
}

export interface BuildSeoResult {
  meta: SeoMeta[];
  links: SeoLink[];
  scripts: SeoScript[];
}

export interface BuildSeoInput {
  /** URL locale (`bg` | `en`). */
  locale: SeoLocale;
  /** Locale-less path, e.g. `/properties/123` (leading slash optional). */
  path: string;
  /** Full `<title>`. */
  title: string;
  /** Meta description. */
  description: string;
  /** Share image — absolute URL or a site-relative path (absolutized here). */
  image?: string;
  /** Open Graph type. Defaults to `website`. */
  type?: "website" | "article";
  /** JSON-LD node(s); falsy entries are dropped. */
  jsonLd?: JsonLd | (JsonLd | null | undefined)[];
  /** Emit `robots: noindex, nofollow` (auth pages, booking flow, thin pages). */
  noindex?: boolean;
  /** 1-based page number for paginated lists; > 1 renders a self-canonical `?page=N`. */
  page?: number;
}

export type JsonLd = Record<string, unknown>;

/** Base site URL from `VITE_SITE_URL`, trailing slash stripped. */
export function siteUrl(): string {
  const raw = import.meta.env.VITE_SITE_URL?.trim();
  return (raw || SITE_FALLBACK).replace(/\/+$/, "");
}

/** Normalize a locale-less path: leading slash, no trailing slash. */
function normalizePath(path: string): string {
  if (!path || path === "/") return "";
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  return withLeading.replace(/\/+$/, "");
}

/** Absolute page URL for a locale, with an optional `?page=N` suffix. */
function pageUrl(locale: SeoLocale, path: string, page?: number): string {
  const query = page && page > 1 ? `?page=${page}` : "";
  return `${siteUrl()}/${locale}${path}${query}`;
}

/** Absolutize an image path against the site URL; pass absolute URLs through. */
function absoluteImage(image: string): string {
  if (/^https?:\/\//i.test(image)) return image;
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${siteUrl()}${path}`;
}

export interface SiteDefaultsInput {
  locale: SeoLocale;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
}

/**
 * Override-safe head **meta** defaults for the locale layout — title,
 * description and OG/Twitter cards, all keyed so a child `head()` overrides
 * them cleanly. Deliberately omits canonical/hreflang links and `og:url`
 * (page-specific): TanStack concatenates `links`, so emitting a canonical here
 * would wrongly canonicalize child pages or duplicate a page's own canonical.
 * Real pages call {@link buildSeo} to add their canonical.
 */
export function buildSiteDefaults(input: SiteDefaultsInput): { meta: SeoMeta[] } {
  const { locale, title, description, type = "website" } = input;
  const image = absoluteImage(input.image ?? DEFAULT_OG_IMAGE);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:site_name", content: SITE_NAME[locale] },
      { property: "og:locale", content: OG_LOCALE[locale] },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
  };
}

/**
 * Build full page head metadata (meta, links, scripts) with absolute URLs
 * derived from `VITE_SITE_URL`. Emits the page's canonical + hreflang, so call
 * it from concrete indexable pages — not from the shared locale layout.
 */
export function buildSeo(input: BuildSeoInput): BuildSeoResult {
  const { locale, title, description, type, noindex, page } = input;
  const path = normalizePath(input.path);
  const canonical = pageUrl(locale, path, page);

  const { meta } = buildSiteDefaults({ locale, title, description, image: input.image, type });
  meta.push({ property: "og:url", content: canonical });
  if (noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }

  const links: SeoLink[] = [{ rel: "canonical", href: canonical }];
  for (const alt of SEO_LOCALES) {
    links.push({ rel: "alternate", hrefLang: alt, href: pageUrl(alt, path, page) });
  }
  links.push({
    rel: "alternate",
    hrefLang: "x-default",
    href: pageUrl(DEFAULT_LOCALE, path, page),
  });

  const nodes = input.jsonLd === undefined ? [] : ([] as (JsonLd | null | undefined)[]).concat(input.jsonLd);
  const scripts: SeoScript[] = nodes
    .filter((n): n is JsonLd => n != null)
    .map((n) => ({ type: "application/ld+json", children: JSON.stringify(n) }));

  return { meta, links, scripts };
}
