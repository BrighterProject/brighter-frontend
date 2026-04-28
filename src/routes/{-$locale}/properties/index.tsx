import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { PropertiesList } from "@/features/Properties/components/properties-list";

export const Route = createFileRoute("/{-$locale}/properties/")({
  component: PropertiesList,
  validateSearch: (search: Record<string, unknown>) => ({
    city: typeof search.city === "string" ? search.city : undefined,
    checkIn: typeof search.checkIn === "string" ? search.checkIn : undefined,
    checkOut: typeof search.checkOut === "string" ? search.checkOut : undefined,
    adults: typeof search.adults === "number" ? search.adults : undefined,
    children: typeof search.children === "number" ? search.children : undefined,
  }),
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("properties-list", locale).meta;
    return {
      meta: [
        { title: meta.title },
        { content: meta.description, name: "description" },
      ],
    };
  },
});
