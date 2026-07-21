import { defaultLocale, getIntlayer } from "intlayer";
import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/pages/landing";
import { buildSeo, type SeoLocale } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/")({
  component: Landing,
  head: ({ params }) => {
    const locale = (params.locale ?? defaultLocale) as SeoLocale;
    const metaContent = getIntlayer("landing-page", locale);
    // Home page: canonical + hreflang to the locale root.
    return buildSeo({
      locale,
      path: "",
      title: metaContent.meta.title,
      description: metaContent.meta.description,
    });
  },
});
