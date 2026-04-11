import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { useProperty } from "@/features/Properties/api/hooks";
import { PropertyDetail } from "@/features/Properties/components/property-detail";

function PropertyDetailPage() {
  const { propertyId, locale } = Route.useParams();
  const search = Route.useSearch();
  const { data: property, isLoading, isError } = useProperty(propertyId, locale);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading property...</div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Property not found</h1>
          <p className="text-muted-foreground">
            This property doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PropertyDetail
      property={property}
      checkIn={search.checkIn}
      checkOut={search.checkOut}
    />
  );
}

export const Route = createFileRoute("/{-$locale}/properties/$propertyId/")({
  component: PropertyDetailPage,
  validateSearch: (search: Record<string, unknown>) => ({
    checkIn: typeof search.checkIn === "string" ? search.checkIn : undefined,
    checkOut: typeof search.checkOut === "string" ? search.checkOut : undefined,
    adults: typeof search.adults === "number" ? search.adults : undefined,
  }),
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("property-detail", locale).meta;
    return {
      meta: [
        { title: meta.title },
        { content: meta.description, name: "description" },
      ],
    };
  },
});
