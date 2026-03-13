import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { PropertiesList } from "@/features/Properties/components/properties-list";

export const Route = createFileRoute("/{-$locale}/properties/")({
  component: PropertiesList,
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
