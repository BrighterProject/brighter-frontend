import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { CheckinLobby } from "@/features/Checkin/components/checkin-lobby";

export const Route = createFileRoute("/{-$locale}/checkin/$token")({
  component: RouteComponent,
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("checkin-lobby", locale).meta;
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        // Guest identity data must never be indexed or cached by crawlers.
        { name: "robots", content: "noindex, nofollow" },
      ],
    };
  },
});

function RouteComponent() {
  const { token, locale } = Route.useParams();
  return <CheckinLobby token={token} locale={locale ?? "bg"} />;
}
