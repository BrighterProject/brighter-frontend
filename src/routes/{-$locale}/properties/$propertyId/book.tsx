import { createFileRoute, redirect } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import apiClient from "@/lib/api-client";
import { useProperty } from "@/features/Properties/api/hooks";
import { BookingForm } from "@/features/Bookings/components/booking-form";

function BookPropertyPage() {
  const { propertyId } = Route.useParams();
  const { checkIn, checkOut, adults, children } = Route.useSearch();
  const { data: property, isLoading, isError } = useProperty(propertyId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Property not found</h1>
        </div>
      </div>
    );
  }

  return <BookingForm property={property} checkIn={checkIn} checkOut={checkOut} adults={adults} children={children} />;
}

export const Route = createFileRoute("/{-$locale}/properties/$propertyId/book")({
  component: BookPropertyPage,
  validateSearch: (search: Record<string, unknown>) => ({
    checkIn: typeof search.checkIn === "string" ? search.checkIn : undefined,
    checkOut: typeof search.checkOut === "string" ? search.checkOut : undefined,
    adults: typeof search.adults === "number" ? search.adults : undefined,
    children: typeof search.children === "number" ? search.children : undefined,
  }),
  beforeLoad: async ({ location, params, search }) => {
    if (typeof window === "undefined") return;

    // Auth guard
    try {
      await apiClient.get("/users/@me/get");
    } catch {
      throw redirect({
        to: "/{-$locale}/auth/login",
        params: { locale: location.pathname.split("/")[1] || "bg" },
        search: { redirect: location.href },
      });
    }

    // Dates guard — redirect to property detail if missing
    if (!search.checkIn || !search.checkOut) {
      throw redirect({
        to: "/{-$locale}/properties/$propertyId" as any,
        params: { locale: params.locale ?? "bg", propertyId: params.propertyId } as any,
        search: {} as any,
      });
    }
  },
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("booking-form", locale).meta;
    return {
      meta: [
        { title: meta.title },
        { content: meta.description, name: "description" },
      ],
    };
  },
});
