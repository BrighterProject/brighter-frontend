import NotFound from "@/components/pages/not-found";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { defaultLocale, getIntlayer, validatePrefix } from "intlayer";
import { buildSiteDefaults, type SeoLocale } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}")({
  // beforeLoad runs before the route renders (on both server and client)
  // It's the ideal place to validate the locale prefix
  beforeLoad: ({ params }) => {
    const localeParam = params.locale;

    // No locale prefix at all (e.g. visiting /) — redirect to home with default locale
    if (!localeParam) {
      throw redirect({
        to: "/{-$locale}" as const,
        params: { locale: defaultLocale } as any,
      });
    }

    // validatePrefix checks if the locale is valid according to your intlayer config
    const { isValid, localePrefix } = validatePrefix(localeParam);

    if (!isValid) {
      // Invalid locale prefix - redirect to the 404 page with a valid locale prefix
      throw redirect({
        to: "/{-$locale}/404",
        params: { locale: localePrefix },
      });
    }
  },
  head: ({ params }) => {
    const locale = (params.locale ?? defaultLocale) as SeoLocale;
    const meta = getIntlayer("root", locale).meta;

    // Site-wide fallback META for the locale layout (safe to inherit/override).
    // No canonical/hreflang here — those are per-page (see buildSiteDefaults).
    return buildSiteDefaults({
      locale,
      title: meta.title,
      description: meta.description,
    });
  },
  component: Outlet,
  // notFoundComponent is called when a child route doesn't exist
  // e.g., /en/non-existent-page triggers this within the /en layout
  notFoundComponent: NotFound,
});
