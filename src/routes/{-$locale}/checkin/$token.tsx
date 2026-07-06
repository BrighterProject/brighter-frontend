import { createFileRoute } from "@tanstack/react-router";
import { CheckinLobby } from "@/features/Checkin/components/checkin-lobby";

export const Route = createFileRoute("/{-$locale}/checkin/$token")({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: "Complete your check-in · Brighter" },
      {
        name: "description",
        content:
          "Add guest details for your upcoming stay. Secure and encrypted.",
      },
      // Guest identity data must never be indexed or cached by crawlers.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function RouteComponent() {
  const { token, locale } = Route.useParams();
  return <CheckinLobby token={token} locale={locale ?? "bg"} />;
}
