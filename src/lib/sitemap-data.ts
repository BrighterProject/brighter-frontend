/**
 * Server-only data source for the sitemap: enumerates active listing IDs from
 * properties-ms. Fail-safe — any error yields an empty list so the sitemap
 * still renders its static routes rather than 500ing.
 *
 * Runs inside the Nitro SSR server, so it reads the internal API base from
 * `process.env` (falling back to the build-time `VITE_API_URL`).
 */
import type { PropertyListItem } from "@/features/Properties/api/types";
import type { SitemapRoute } from "./sitemap";

const PAGE_SIZE = 500;
/** Hard cap so a runaway/incorrect total can never loop forever. */
const MAX_PAGES = 100;

/** Resolve the API origin reachable from the SSR server. */
function apiBaseUrl(): string {
  return (
    process.env.SITEMAP_API_URL ||
    process.env.INTERNAL_API_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost"
  ).replace(/\/+$/, "");
}

/**
 * Fetch every active listing ID and map it to a sitemap route. Pages through
 * `GET /properties/?status=active` using the `X-Total-Count` header to know
 * when to stop. Returns `[]` on any failure.
 */
export async function fetchActiveListingRoutes(): Promise<SitemapRoute[]> {
  const base = apiBaseUrl();
  const routes: SitemapRoute[] = [];

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = `${base}/properties/?status=active&page=${page}&page_size=${PAGE_SIZE}`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) break;

      const items = (await res.json()) as PropertyListItem[];
      if (!Array.isArray(items) || items.length === 0) break;

      for (const item of items) {
        routes.push({
          path: `/properties/${item.id}`,
          changefreq: "weekly",
          priority: 0.8,
        });
      }

      const total = Number(res.headers.get("x-total-count"));
      if (Number.isFinite(total) && routes.length >= total) break;
      if (items.length < PAGE_SIZE) break;
    }
  } catch {
    return [];
  }

  return routes;
}
