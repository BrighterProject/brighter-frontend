import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useProperties } from "../api/hooks";
import type { PropertyListItem } from "../api/types";
import { OfferCard, type OfferCardData } from "./offer-card";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface Filters {
  city: string;
  min_price: number;
  max_price: number;
  propertyTypes: string[];
  popularFilters: string[];
  minRating: number | null;
}

const PRICE_MIN = 0;
const PRICE_MAX = 500;

const INITIAL_FILTERS: Filters = {
  city: "",
  min_price: PRICE_MIN,
  max_price: PRICE_MAX,
  propertyTypes: [],
  popularFilters: [],
  minRating: null,
};

const PROPERTY_TYPE_KEYS = [
  "hotel",
  "apartment",
  "house",
  "villa",
  "hostel",
  "guesthouse",
] as const;

const POPULAR_FILTER_KEYS = [
  "freeCancellation",
  "breakfastIncluded",
  "pool",
  "wifi",
  "parking",
  "petFriendly",
  "airConditioning",
  "kitchen",
] as const;

const RATING_OPTIONS = [9, 8, 7] as const;

// Maps frontend popular filter keys to backend amenity names.
// freeCancellation and parking are handled separately as dedicated backend filters.
const POPULAR_FILTER_TO_AMENITY: Record<string, string> = {
  breakfastIncluded: "breakfast",
  pool: "pool",
  wifi: "wifi",
  petFriendly: "pet_friendly",
  airConditioning: "air_conditioning",
  kitchen: "kitchen",
};

function buildParams(filters: Filters) {
  const params: Record<string, unknown> = {};
  if (filters.city.trim()) params.city = filters.city.trim();
  if (filters.min_price > PRICE_MIN) params.min_price = filters.min_price;
  if (filters.max_price < PRICE_MAX) params.max_price = filters.max_price;
  if (filters.propertyTypes.length > 0)
    params.property_type = filters.propertyTypes;
  if (filters.minRating !== null)
    params.min_rating = (filters.minRating / 2).toFixed(1); // UI is 0-10 scale, backend is 0-5

  // Popular filters → split into dedicated backend params + amenities list
  if (filters.popularFilters.includes("freeCancellation"))
    params.free_cancellation = true;
  if (filters.popularFilters.includes("parking")) params.has_parking = true;
  const amenities = filters.popularFilters
    .filter((k) => k in POPULAR_FILTER_TO_AMENITY)
    .map((k) => POPULAR_FILTER_TO_AMENITY[k]);
  if (amenities.length > 0) params.amenities = amenities;

  return params;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-1 text-sm font-semibold text-foreground"
      >
        {title}
        {open ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function getRatingLabel(
  rating: number,
  c: { excellent: string; veryGood: string; good: string },
) {
  if (rating >= 9) return c.excellent;
  if (rating >= 7) return c.veryGood;
  return c.good;
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

  const {
    data: rawData,
    isLoading: isRealLoading,
    isError,
  } = useProperties(buildParams(queryFilters));

  const realProperties = Array.isArray(rawData) ? rawData : undefined;

  const PLACEHOLDER_PROPERTIES: PropertyListItem[] = [
    {
      id: "p1",
      name: "Grand Hotel Sofia",
      city: "Sofia",
      property_type: "hotel",
      status: "active",
      price_per_night: "120",
      currency: "EUR",
      max_guests: 2,
      bedrooms: 1,
      rating: "4.60",
      total_reviews: 847,
      thumbnail: null,
    },
    {
      id: "p2",
      name: "Sunny Beach Apartment",
      city: "Burgas",
      property_type: "apartment",
      status: "active",
      price_per_night: "85",
      currency: "EUR",
      max_guests: 4,
      bedrooms: 2,
      rating: "4.30",
      total_reviews: 312,
      thumbnail: null,
    },
    {
      id: "p3",
      name: "Old Town Villa Plovdiv",
      city: "Plovdiv",
      property_type: "villa",
      status: "active",
      price_per_night: "195",
      currency: "EUR",
      max_guests: 6,
      bedrooms: 3,
      rating: "4.75",
      total_reviews: 124,
      thumbnail: null,
    },
    {
      id: "p4",
      name: "Mountain Lodge Bansko",
      city: "Bansko",
      property_type: "guesthouse",
      status: "active",
      price_per_night: "150",
      currency: "EUR",
      max_guests: 3,
      bedrooms: 1,
      rating: "4.05",
      total_reviews: 203,
      thumbnail: null,
    },
    {
      id: "p5",
      name: "Seaside Studio Varna",
      city: "Varna",
      property_type: "apartment",
      status: "active",
      price_per_night: "65",
      currency: "EUR",
      max_guests: 2,
      bedrooms: 1,
      rating: "3.90",
      total_reviews: 89,
      thumbnail: null,
    },
  ];

  const isLoading = isRealLoading;
  const properties = realProperties ?? PLACEHOLDER_PROPERTIES;

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleArrayFilter = (
    key: "propertyTypes" | "popularFilters",
    value: string,
  ) => {
    setFilters((prev) => {
      const arr = prev[key] as (string | number)[];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const hasActiveFilters =
    filters.city ||
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

  const propertyTypeLabels = c.filters.propertyType as Record<string, string>;
  const popularFilterLabels = c.filters.popularFilters as Record<
    string,
    string
  >;

  const sidebar = (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">
          {c.filters.heading}
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => setFilters(INITIAL_FILTERS)}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <X className="size-3" />
            {c.filters.clear}
          </button>
        )}
      </div>

      {/* Destination search */}
      <div className="border-b border-border pb-4">
        <label className="mb-2 block text-sm font-semibold text-foreground">
          {c.filters.city.label}
        </label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={c.filters.city.placeholder.value as string}
            value={filters.city}
            onChange={(e) => set("city", e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Price range */}
      <CollapsibleSection title={c.filters.price.label as string}>
        <div className="px-1">
          <Slider
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={10}
            value={[filters.min_price, filters.max_price]}
            onValueChange={([min, max]) => {
              set("min_price", min);
              set("max_price", max);
            }}
            className="mb-3"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {filters.min_price} {c.filters.price.currency}
            </span>
            <span>
              {filters.max_price === PRICE_MAX
                ? `${PRICE_MAX}+`
                : filters.max_price}{" "}
              {c.filters.price.currency}
            </span>
          </div>
        </div>
      </CollapsibleSection>

      {/* Popular filters */}
      <CollapsibleSection title={c.filters.popularFilters.label as string}>
        <div className="flex flex-col gap-2.5">
          {POPULAR_FILTER_KEYS.map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={filters.popularFilters.includes(key)}
                onCheckedChange={() => toggleArrayFilter("popularFilters", key)}
              />
              <span className="text-sm text-foreground">
                {popularFilterLabels[key]}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {/* Property type */}
      <CollapsibleSection title={c.filters.propertyType.label as string}>
        <div className="flex flex-col gap-2.5">
          {PROPERTY_TYPE_KEYS.map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={filters.propertyTypes.includes(key)}
                onCheckedChange={() => toggleArrayFilter("propertyTypes", key)}
              />
              <span className="text-sm text-foreground">
                {propertyTypeLabels[key]}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {/* Guest rating */}
      <CollapsibleSection title={c.filters.rating.label as string}>
        <div className="flex flex-col gap-2">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() =>
                set("minRating", filters.minRating === r ? null : r)
              }
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                filters.minRating === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {r}
              {c.filters.rating.above}
            </button>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {c.title}
          </h1>
          <p className="mt-1 text-muted-foreground">{c.subtitle}</p>
        </div>

        {/* Mobile filter toggle */}
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
          {/* Sidebar */}
          <aside
            className={`w-full shrink-0 lg:block lg:w-64 ${
              sidebarOpen ? "block" : "hidden"
            }`}
          >
            <div className="sticky top-24 rounded-lg border border-border bg-card p-4 shadow-sm">
              {sidebar}
            </div>
          </aside>

          {/* Results */}
          <main className="min-w-0 flex-1">
            {!isLoading &&
              !isError &&
              realProperties &&
              realProperties.length > 0 && (
                <p className="mb-3 text-sm text-muted-foreground">
                  {realProperties.length}{" "}
                  {realProperties.length === 1
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

            {isError && !properties.length && (
              <div className="py-20 text-center text-muted-foreground">
                {c.error}
              </div>
            )}

            {!isLoading && realProperties?.length === 0 && (
              <div className="py-20 text-center">
                <SlidersHorizontal className="mx-auto mb-4 size-10 text-muted-foreground/40" />
                <p className="text-lg font-semibold text-foreground">
                  {c.empty.title}
                </p>
                <p className="mt-1 text-muted-foreground">{c.empty.subtitle}</p>
              </div>
            )}

            {!isLoading && properties.length > 0 && (
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
