/**
 * Pure generators for `robots.txt` and `sitemap.xml`. The Nitro server routes
 * (`src/routes/robots[.]txt.ts`, `src/routes/sitemap[.]xml.ts`) supply the
 * runtime data (indexable flag, site URL, active listing IDs) and stream the
 * strings these functions return.
 */
import { SEO_LOCALES, type SeoLocale } from "./seo";

const DEFAULT_LOCALE: SeoLocale = "bg";

export interface RobotsOptions {
  /** Whether this deployment may be indexed (mirrors `isIndexable()`). */
  indexable: boolean;
  /** Absolute site origin, no trailing slash. */
  siteUrl: string;
}

/**
 * Build a `robots.txt` body. Non-indexable deploys (staging/preview) disallow
 * everything so they never compete with production; indexable deploys allow
 * crawling but keep private flows (auth, bookings, check-in, booking form) out
 * and advertise the sitemap.
 */
export function buildRobotsTxt({ indexable, siteUrl }: RobotsOptions): string {
  if (!indexable) {
    return ["User-agent: *", "Disallow: /", ""].join("\n");
  }
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /*/auth/",
    "Disallow: /*/bookings/",
    "Disallow: /*/checkin/",
    "Disallow: /*/book",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
}

export interface SitemapRoute {
  /** Locale-less path, e.g. `/properties/123` or `""` for the home page. */
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

export interface SitemapOptions {
  siteUrl: string;
  locales: readonly SeoLocale[];
  routes: SitemapRoute[];
}

/** Escape the five XML-significant characters for safe attribute/text output. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function localeUrl(siteUrl: string, locale: SeoLocale, path: string): string {
  const normalized = !path || path === "/" ? "" : path;
  return `${siteUrl}/${locale}${normalized}`;
}

/**
 * Build a `sitemap.xml` with one `<url>` per locale variant of every route,
 * each carrying `xhtml:link` hreflang alternates (all locales + `x-default`→bg)
 * per Google's multilingual sitemap guidance.
 */
export function buildSitemapXml({ siteUrl, locales, routes }: SitemapOptions): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const route of routes) {
    const alternates = locales.map(
      (loc) =>
        `    <xhtml:link rel="alternate" hreflang="${loc}" href="${escapeXml(localeUrl(siteUrl, loc, route.path))}"/>`,
    );
    alternates.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(localeUrl(siteUrl, DEFAULT_LOCALE, route.path))}"/>`,
    );

    for (const locale of locales) {
      lines.push("  <url>");
      lines.push(`    <loc>${escapeXml(localeUrl(siteUrl, locale, route.path))}</loc>`);
      if (route.lastmod) lines.push(`    <lastmod>${escapeXml(route.lastmod)}</lastmod>`);
      if (route.changefreq) lines.push(`    <changefreq>${escapeXml(route.changefreq)}</changefreq>`);
      if (route.priority !== undefined) lines.push(`    <priority>${route.priority}</priority>`);
      lines.push(...alternates);
      lines.push("  </url>");
    }
  }

  lines.push("</urlset>", "");
  return lines.join("\n");
}

/** Static (non-listing) routes always present in the sitemap. */
export const STATIC_SITEMAP_ROUTES: SitemapRoute[] = [
  { path: "", changefreq: "daily", priority: 1.0 },
  { path: "/properties", changefreq: "daily", priority: 0.9 },
  { path: "/about-us", changefreq: "monthly", priority: 0.3 },
  { path: "/contacts", changefreq: "monthly", priority: 0.3 },
];

export { SEO_LOCALES };
