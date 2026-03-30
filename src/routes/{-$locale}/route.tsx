import NotFound from "@/components/pages/not-found";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { defaultLocale, getIntlayer, validatePrefix } from "intlayer";

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
    const { locale } = params;
    const meta = getIntlayer("root", locale).meta;

    const currentUrl = `https://площадка.бг/${locale}`;

    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
        {
          property: "og:image",
          content: `https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyZHhhNXFsYnRncXpyNTB6Mnl6amFkOWRucWV3YTVsZmJsMWF2c2tyNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dGLwOt8LiqNaNvUODg/200w.gif`,
        },
        { property: "og:url", content: currentUrl },
        { property: "og:type", content: "website" },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: meta.title },
        { name: "twitter:description", content: meta.description },
      ],
    };
  },
  component: Outlet,
  // notFoundComponent is called when a child route doesn't exist
  // e.g., /en/non-existent-page triggers this within the /en layout
  notFoundComponent: NotFound,
});
