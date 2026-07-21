import { createFileRoute } from "@tanstack/react-router";
import { siteUrl, SEO_LOCALES } from "@/lib/seo";
import { buildSitemapXml, STATIC_SITEMAP_ROUTES } from "@/lib/sitemap";
import { fetchActiveListingRoutes } from "@/lib/sitemap-data";

/**
 * Dynamic `sitemap.xml`. Combines static pages with every active listing
 * (fetched server-side from properties-ms) and emits per-locale entries with
 * hreflang alternates. Cached 1h to avoid hammering properties-ms.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const listingRoutes = await fetchActiveListingRoutes();
        const xml = buildSitemapXml({
          siteUrl: siteUrl(),
          locales: SEO_LOCALES,
          routes: [...STATIC_SITEMAP_ROUTES, ...listingRoutes],
        });
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
