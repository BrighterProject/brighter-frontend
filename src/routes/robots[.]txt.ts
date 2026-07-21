import { createFileRoute } from "@tanstack/react-router";
import { isIndexable } from "@/lib/site-meta";
import { siteUrl } from "@/lib/seo";
import { buildRobotsTxt } from "@/lib/sitemap";

/**
 * Dynamic `robots.txt`. Env-aware so non-indexable deploys (staging/preview)
 * disallow everything while production advertises the sitemap and keeps
 * private flows out. Replaces the former static `public/robots.txt`.
 */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const body = buildRobotsTxt({ indexable: isIndexable(), siteUrl: siteUrl() });
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
