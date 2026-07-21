import { createFileRoute } from "@tanstack/react-router";
import { defaultLocale, getIntlayer } from "intlayer";
import { PropertiesList } from "@/features/Properties/components/properties-list";
import { sanitizeFilterSearch } from "@/features/Properties/components/properties-filters";
import { buildSeo, type SeoLocale } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/properties/")({
  component: PropertiesList,
  validateSearch: (search: Record<string, unknown>) => ({
    city: typeof search.city === "string" ? search.city : undefined,
    settlement_ekatte: typeof search.settlement_ekatte === "string" ? search.settlement_ekatte : undefined,
    region_code: typeof search.region_code === "string" ? search.region_code : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    checkIn: typeof search.checkIn === "string" ? search.checkIn : undefined,
    checkOut: typeof search.checkOut === "string" ? search.checkOut : undefined,
    adults: search.adults !== undefined ? Number(search.adults) || undefined : undefined,
    children: search.children !== undefined ? Number(search.children) || undefined : undefined,
    // Sidebar filter state (URL-persisted). sanitizeFilterSearch never throws —
    // it clamps/strips junk so a hand-edited URL renders a result, not an error.
    ...sanitizeFilterSearch(search),
  }),
  head: ({ params }) => {
    const locale = (params.locale ?? defaultLocale) as SeoLocale;
    const meta = getIntlayer("properties-list", locale).meta;
    // Canonicalize to the param-less locale URL so every ?city/?checkIn/filter
    // permutation consolidates onto a single indexable page (1.4).
    return buildSeo({
      locale,
      path: "/properties",
      title: meta.title,
      description: meta.description,
    });
  },
});
