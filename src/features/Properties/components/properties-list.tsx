import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { SlidersHorizontal } from "lucide-react";
import { useInfiniteProperties } from "../api/hooks";
import type { PropertyListItem, PropertyType } from "../api/types";
import { useFormatRooms } from "../utils/format-rooms";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { SearchCard } from "@/components/ui/search-card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OfferCard, type OfferCardData } from "./offer-card";
import { PropertiesSidebar } from "./properties-sidebar";
import { PropertyMapModal } from "./property-map-modal";
import {
  type Filters,
  type FilterSearch,
  type SortOption,
  DEFAULT_SORT,
  SORT_OPTIONS,
  INITIAL_FILTERS,
  PRICE_MIN,
  PRICE_MAX,
  buildParams,
  filtersFromSearch,
  searchFromFilters,
} from "./properties-filters";
import type { SearchParams } from "@/hooks/useSearchParams";

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
  roomsC: ReturnType<typeof useIntlayer<"rooms">>,
  formatRooms: (rooms: PropertyListItem["rooms"]) => {
    roomLine: string;
    bedLine: string;
  },
  onClick: () => void,
): OfferCardData {
  const rating = Number(property.rating);
  const { roomLine, bedLine } = formatRooms(property.rooms);
  return {
    title: property.name,
    location: property.city,
    description: property.description,
    roomType: roomsC.propertyTypes[property.property_type as PropertyType]
      .value as string,
    roomDetails: roomLine,
    bedInfo: bedLine,
    bedrooms: property.bedrooms,
    maxGuests: property.max_guests,
    totalReviews: property.total_reviews,
    isNew: property.total_reviews === 0,
    rating: getRatingLabel(rating, c),
    ratingScore: rating.toFixed(1),
    // With a searched date range the API returns the resolved stay total; show
    // it (labelled "N nights") instead of the per-night "from" price.
    priceLabel:
      property.stay_total != null && property.stay_nights != null
        ? `${property.stay_nights} ${
            property.stay_nights === 1
              ? (c.night.value as string)
              : (c.nights.value as string)
          }`
        : undefined,
    price:
      property.stay_total != null
        ? `${Number(property.stay_total).toFixed(0)} ${property.currency}`
        : property.price_from != null
          ? `${c.priceFrom.value as string} ${Number(property.price_from).toFixed(0)} ${property.currency}`
          : (c.priceOnRequest.value as string),
    priceNote: c.includedTaxes as string,
    cta: c.seeAvailability as string,
    image: property.thumbnail,
    onClick,
  };
}

export function PropertiesList() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();
  const { locale } = useParams({ strict: false }) as { locale?: string };
  const c = useIntlayer("properties-list");
  const roomsC = useIntlayer("rooms");
  const formatRooms = useFormatRooms();

  // Filters live in the URL (shareable, survive refresh/back-nav). The route's
  // validateSearch has already sanitized them.
  const searchParams = useSearch({ strict: false }) as SearchParams &
    FilterSearch;
  const urlCity = searchParams.city ?? "";
  const urlSettlementEkatte = searchParams.settlement_ekatte;
  const urlRegionCode = searchParams.region_code;
  const urlQ = searchParams.q;
  const urlAdults = searchParams.adults;
  const urlChildren = searchParams.children;
  const urlCheckIn = searchParams.checkIn;
  const urlCheckOut = searchParams.checkOut;

  const urlFilters = filtersFromSearch(searchParams);

  // The price slider keeps local state and debounces before writing the URL, so
  // dragging doesn't spam navigation/history. Everything else writes instantly.
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlFilters.min_price,
    urlFilters.max_price,
  ]);
  useEffect(() => {
    setPriceRange([urlFilters.min_price, urlFilters.max_price]);
  }, [urlFilters.min_price, urlFilters.max_price]);
  const debouncedPrice = useDebounce(priceRange, 400);

  const patchSearch = useCallback(
    (patch: Partial<FilterSearch>) =>
      navigate({
        search: ((prev: Record<string, unknown>) => ({
          ...prev,
          ...patch,
        })) as any,
        replace: true,
      }),
    [navigate],
  );

  // Commit the debounced slider position to the URL.
  useEffect(() => {
    if (
      debouncedPrice[0] === urlFilters.min_price &&
      debouncedPrice[1] === urlFilters.max_price
    )
      return;
    patchSearch({
      minPrice: debouncedPrice[0] > PRICE_MIN ? debouncedPrice[0] : undefined,
      maxPrice: debouncedPrice[1] < PRICE_MAX ? debouncedPrice[1] : undefined,
    });
  }, [debouncedPrice, urlFilters.min_price, urlFilters.max_price, patchSearch]);

  // Effective filters for the UI reflect the live slider; the query uses the
  // debounced slider so cards don't refetch on every drag tick.
  const filters: Filters = {
    ...urlFilters,
    min_price: priceRange[0],
    max_price: priceRange[1],
  };
  const queryFilters: Filters = {
    ...urlFilters,
    min_price: debouncedPrice[0],
    max_price: debouncedPrice[1],
  };

  const apiParams = buildParams(queryFilters, {
    city: urlCity,
    settlement_ekatte: urlSettlementEkatte,
    region_code: urlRegionCode,
    q: urlQ,
    min_guests:
      urlAdults !== undefined || urlChildren !== undefined
        ? (urlAdults ?? 0) + (urlChildren ?? 0) || undefined
        : undefined,
    checkIn: urlCheckIn,
    checkOut: urlCheckOut,
    lang: locale,
  });

  const {
    data,
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProperties(apiParams);

  const properties: PropertyListItem[] =
    data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages.at(-1)?.total ?? 0;

  const goToProperty = (propertyId: string) =>
    navigate({
      to: "/{-$locale}/properties/$propertyId" as any,
      params: { propertyId } as any,
      search: {
        checkIn: urlCheckIn,
        checkOut: urlCheckOut,
        adults: urlAdults,
        children: urlChildren,
      } as any,
    });

  // Apply an updated Filters set to the URL (defaults drop out → clean URL).
  const applyFilters = (next: Filters) =>
    navigate({
      search: ((prev: Record<string, unknown>) => ({
        ...prev,
        ...searchFromFilters(next),
      })) as any,
      replace: true,
    });

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    applyFilters({ ...filters, [key]: value });

  const setPrice = (range: [number, number]) => setPriceRange(range);

  const setSort = (sort: SortOption) =>
    patchSearch({ sort: sort !== DEFAULT_SORT ? sort : undefined });

  const toggleArrayFilter = (
    key: "propertyTypes" | "popularFilters" | "amenities",
    value: string,
  ) => {
    const arr = filters[key] as string[];
    applyFilters({
      ...filters,
      [key]: arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value],
    });
  };

  const clearFilters = () => {
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    applyFilters(INITIAL_FILTERS);
  };

  const hasActiveFilters =
    filters.min_price > PRICE_MIN ||
    filters.max_price < PRICE_MAX ||
    filters.propertyTypes.length > 0 ||
    filters.popularFilters.length > 0 ||
    filters.amenities.length > 0 ||
    filters.minRating !== null ||
    filters.bedrooms !== null;

  const activeFilterCount =
    (filters.min_price > PRICE_MIN || filters.max_price < PRICE_MAX ? 1 : 0) +
    filters.propertyTypes.length +
    filters.popularFilters.length +
    filters.amenities.length +
    (filters.minRating !== null ? 1 : 0) +
    (filters.bedrooms !== null ? 1 : 0);

  const sortLabels = c.sort as Record<string, unknown>;
  const sidebar = (
    <PropertiesSidebar
      filters={filters}
      hasActiveFilters={hasActiveFilters}
      onSet={set}
      onPriceChange={setPrice}
      onToggleArray={toggleArrayFilter}
      onClear={clearFilters}
    />
  );

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  const searchCardContent = {
    destination: { value: c.filters.city.placeholder.value as string },
    dates: { value: c.filters.dates.value },
    keyword: { value: c.filters.keyword.value },
    button: c.filters.heading,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Compact search bar at top of listing */}
        <div className="mb-6 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
          <SearchCard
            variant="compact"
            content={searchCardContent as any}
            defaultValues={{
              city: urlCity,
              settlement_ekatte: urlSettlementEkatte,
              region_code: urlRegionCode,
              q: urlQ,
              checkIn: urlCheckIn,
              checkOut: urlCheckOut,
              adults: urlAdults,
              children: urlChildren,
            }}
          />
        </div>

        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {c.title}
          </h1>
          <p className="mt-1 text-muted-foreground">{c.subtitle}</p>
        </div>

        {/* Mobile filter sheet trigger */}
        <div className="mb-4 lg:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="size-4" />
                {c.filters.heading}
                {activeFilterCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-border">
                <SheetTitle>{c.filters.heading}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-4">{sidebar}</div>
              <SheetFooter className="border-t border-border">
                <Button className="w-full" onClick={() => setSheetOpen(false)}>
                  {c.showResults} ({total})
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-6">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-lg border border-border bg-card p-4 shadow-sm">
              {sidebar}
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            {!isLoading && !isError && (
              <div
                className="mb-3 flex items-center justify-between gap-3"
                aria-busy={isFetching}
              >
                <p className="text-sm text-muted-foreground">
                  {total}{" "}
                  {total === 1 ? c.results.property : c.results.properties}{" "}
                  {c.results.found}
                </p>
                <div className="flex items-center gap-2">
                  <Select value={filters.sort} onValueChange={setSort}>
                    <SelectTrigger size="sm" aria-label={c.sort.label as string}>
                      <SelectValue placeholder={c.sort.label as string} />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {sortLabels[opt] as string}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {properties.length > 0 && (
                    <PropertyMapModal
                      properties={properties}
                      locale={locale}
                      onSelect={goToProperty}
                    />
                  )}
                </div>
              </div>
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
                    data={propertyToOfferData(
                      property,
                      c.card,
                      roomsC,
                      formatRooms,
                      () => goToProperty(property.id),
                    )}
                  />
                ))}

                {/* Infinite scroll sentinel */}
                <div
                  ref={sentinelRef}
                  className="py-4 text-center text-sm text-muted-foreground"
                >
                  {isFetchingNextPage
                    ? c.loadingMore
                    : hasNextPage
                      ? null
                      : properties.length > 0
                        ? c.noMore
                        : null}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
