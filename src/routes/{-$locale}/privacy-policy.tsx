import { PrivacyPolicy } from "@/components/pages/privacy-policy";
import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";

export const Route = createFileRoute("/{-$locale}/privacy-policy")({
  component: PrivacyPolicy,
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("privacy-policy", locale).meta;

    return {
      meta: [
        { title: meta.title },
        { content: meta.description, name: "description" },
      ],
    };
  },
});
