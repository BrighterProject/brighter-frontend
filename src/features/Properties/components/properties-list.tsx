import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { SlidersHorizontal } from "lucide-react";
import { useProperties } from "../api/hooks";
import type { PropertyListItem } from "../api/types";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { OfferCard, type OfferCardData } from "./offer-card";
import { PropertiesSidebar } from "./properties-sidebar";
import {
  type Filters,
  INITIAL_FILTERS,
  PRICE_MIN,
  PRICE_MAX,
  buildParams,
} from "./properties-filters";

function getRatingLabel(
  rating: number,
  c: { excellent: unknown; veryGood: unknown; good: unknown },
): string {
  if (rating >= 9) return c.excellent as string;
  if (rating >= 7) return c.veryGood as string;
  return c.good as string;
}

function propertyToOfferData(
  property: PropertyListItem,
  c: ReturnType<typeof useIntlayer<"properties-list">>["card"],
  onClick: () => void,
): OfferCardData {
  const rating = Number(property.rating);
  return {
    title: property.name,
    location: property.city,
    description: property.description ?? undefined,
    roomType:
      property.property_type.charAt(0).toUpperCase() +
      property.property_type.slice(1).replace(/_/g, " "),
    bedrooms: property.bedrooms,
    maxGuests: property.max_guests,
    totalReviews: property.total_reviews,
    rating: getRatingLabel(rating, c),
    ratingScore: rating.toFixed(1),
    price: `${Number(property.price_per_night).toFixed(0)} ${property.currency}`,
    priceNote: c.includedTaxes as string,
    cta: c.seeAvailability as string,
    image: property.thumbnail,
    onClick,
  };
}

export function PropertiesList() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const c = useIntlayer("properties-list");

  const debouncedCity = useDebounce(filters.city, 400);
  const debouncedMinPrice = useDebounce(filters.min_price, 400);
  const debouncedMaxPrice = useDebounce(filters.max_price, 400);

  const queryFilters: Filters = {
    ...filters,
    city: debouncedCity,
    min_price: debouncedMinPrice,
    max_price: debouncedMaxPrice,
  };

  const { data: rawData, isLoading, isError } = useProperties(
    buildParams(queryFilters),
  );

  const properties = Array.isArray(rawData) ? rawData : [];

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleArrayFilter = (
    key: "propertyTypes" | "popularFilters",
    value: string,
  ) => {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const hasActiveFilters =
    !!filters.city ||
    filters.min_price > PRICE_MIN ||
    filters.max_price < PRICE_MAX ||
    filters.propertyTypes.length > 0 ||
    filters.popularFilters.length > 0 ||
    filters.minRating !== null;

  const activeFilterCount =
    (filters.city ? 1 : 0) +
    (filters.min_price > PRICE_MIN || filters.max_price < PRICE_MAX ? 1 : 0) +
    filters.propertyTypes.length +
    filters.popularFilters.length +
    (filters.minRating !== null ? 1 : 0);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {c.title}
          </h1>
          <p className="mt-1 text-muted-foreground">{c.subtitle}</p>
        </div>

        <div className="mb-4 lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="gap-2"
          >
            <SlidersHorizontal className="size-4" />
            {c.filters.heading}
            {activeFilterCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        <div className="flex gap-6">
          <aside
            className={`w-full shrink-0 lg:block lg:w-64 ${
              sidebarOpen ? "block" : "hidden"
            }`}
          >
            <div className="sticky top-24 rounded-lg border border-border bg-card p-4 shadow-sm">
              <PropertiesSidebar
                filters={filters}
                hasActiveFilters={hasActiveFilters}
                onSet={set}
                onToggleArray={toggleArrayFilter}
                onClear={() => setFilters(INITIAL_FILTERS)}
              />
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            {!isLoading && !isError && properties.length > 0 && (
              <p className="mb-3 text-sm text-muted-foreground">
                {properties.length}{" "}
                {properties.length === 1
                  ? c.results.property
                  : c.results.properties}{" "}
                {c.results.found}
              </p>
            )}

            {isLoading && (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-44 animate-pulse rounded-lg border border-border bg-muted/50"
                  />
                ))}
              </div>
            )}

            {isError && (
              <div className="py-20 text-center text-muted-foreground">
                {c.error}
              </div>
            )}

            {!isLoading && !isError && properties.length === 0 && (
              <div className="py-20 text-center">
                <SlidersHorizontal className="mx-auto mb-4 size-10 text-muted-foreground/40" />
                <p className="text-lg font-semibold text-foreground">
                  {c.empty.title}
                </p>
                <p className="mt-1 text-muted-foreground">{c.empty.subtitle}</p>
              </div>
            )}

            {!isLoading && !isError && properties.length > 0 && (
              <div className="flex flex-col gap-4">
                {properties.map((property) => (
                  <OfferCard
                    key={property.id}
                    data={propertyToOfferData(property, c.card, () =>
                      navigate({
                        to: "/{-$locale}/properties/$propertyId" as any,
                        params: { propertyId: property.id } as any,
                      }),
                    )}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
