import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useProperties } from "../api/hooks";
import { PropertyCard } from "./property-card";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SportType } from "../api/types";

const SPORT_VALUES: SportType[] = [
  "football",
  "basketball",
  "tennis",
  "volleyball",
  "swimming",
  "gym",
  "padel",
  "other",
];

interface Filters {
  sport_type: SportType | "";
  city: string;
  is_indoor: boolean | undefined;
  min_price: string;
  max_price: string;
}

const INITIAL_FILTERS: Filters = {
  sport_type: "",
  city: "",
  is_indoor: undefined,
  min_price: "",
  max_price: "",
};

function buildParams(filters: Filters) {
  const params: Record<string, unknown> = {};
  if (filters.sport_type) params.sport_type = filters.sport_type;
  if (filters.city.trim()) params.city = filters.city.trim();
  if (filters.is_indoor !== undefined) params.is_indoor = filters.is_indoor;
  if (filters.min_price) params.min_price = filters.min_price;
  if (filters.max_price) params.max_price = filters.max_price;
  return params;
}

export function PropertiesList() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
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
    data: properties,
    isLoading,
    isError,
  } = useProperties(buildParams(queryFilters));

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const hasActiveFilters =
    filters.sport_type ||
    filters.city ||
    filters.is_indoor !== undefined ||
    filters.min_price ||
    filters.max_price;

  const typeOptions = [
    { label: c.filters.type.all, value: undefined },
    { label: c.filters.type.indoor, value: true },
    { label: c.filters.type.outdoor, value: false },
  ] as const;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {c.title}
          </h1>
          <p className="mt-1 text-muted-foreground">{c.subtitle}</p>
        </div>

        {/* Filter bar */}
        <div className="mb-8 rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-3">
            {/* Sport type */}
            <div className="flex min-w-36 flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {c.filters.sport.label}
              </label>
              <select
                value={filters.sport_type}
                onChange={(e) =>
                  set("sport_type", e.target.value as SportType | "")
                }
                className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">{c.filters.sport.all}</option>
                {SPORT_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {c.sports[v]}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="flex min-w-36 flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {c.filters.city.label}
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={c.filters.city.placeholder.value as string}
                  value={filters.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="h-9 rounded-lg border border-input bg-transparent pl-8 pr-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Price range */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {c.filters.price.label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={c.filters.price.min.value as string}
                  min={0}
                  value={filters.min_price}
                  onChange={(e) => set("min_price", e.target.value)}
                  className="h-9 w-20 rounded-lg border border-input bg-transparent px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm text-muted-foreground">–</span>
                <input
                  type="number"
                  placeholder={c.filters.price.max.value as string}
                  min={0}
                  value={filters.max_price}
                  onChange={(e) => set("max_price", e.target.value)}
                  className="h-9 w-20 rounded-lg border border-input bg-transparent px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Indoor toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {c.filters.type.label}
              </label>
              <div className="flex h-9 overflow-hidden rounded-lg border border-input text-sm">
                {typeOptions.map(({ label, value }) => (
                  <button
                    key={String(label.value)}
                    onClick={() => set("is_indoor", value)}
                    className={
                      filters.is_indoor === value
                        ? "bg-primary px-3 font-medium text-primary-foreground"
                        : "px-3 text-muted-foreground transition-colors hover:bg-muted/40"
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="gap-1.5 self-end text-muted-foreground"
              >
                <X className="size-3.5" />
                {c.filters.clear}
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border bg-muted/50"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="py-20 text-center text-muted-foreground">
            {c.error}
          </div>
        )}

        {!isLoading && !isError && properties?.length === 0 && (
          <div className="py-20 text-center">
            <SlidersHorizontal className="mx-auto mb-4 size-10 text-muted-foreground/40" />
            <p className="text-lg font-semibold text-foreground">
              {c.empty.title}
            </p>
            <p className="mt-1 text-muted-foreground">{c.empty.subtitle}</p>
          </div>
        )}

        {!isLoading && !isError && properties && properties.length > 0 && (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {properties.length}{" "}
              {properties.length === 1 ? c.results.property : c.results.properties}{" "}
              {c.results.found}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() =>
                    navigate({
                      to: "/{-$locale}/properties/$propertyId" as any,
                      params: { propertyId: property.id } as any,
                    })
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
