import { Terms } from "@/components/pages/terms";
import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";

export const Route = createFileRoute("/{-$locale}/terms-and-conditions")({
  component: Terms,
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("terms", locale).meta;

    return {
      meta: [
        { title: meta.title },
        { content: meta.description, name: "description" },
      ],
    };
  },
});
