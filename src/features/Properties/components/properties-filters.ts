import type { AmenityType } from "@Properties/api/types";
import { ALL_AMENITIES } from "./amenity-taxonomy";

export type SortOption =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "rating_desc";

export const SORT_OPTIONS: readonly SortOption[] = [
  "recommended",
  "price_asc",
  "price_desc",
  "rating_desc",
] as const;

export const DEFAULT_SORT: SortOption = "recommended";

export interface Filters {
  min_price: number;
  max_price: number;
  propertyTypes: string[];
  popularFilters: string[];
  minRating: number | null;
  bedrooms: number | null;
  min_guests: number | null;
  sort: SortOption;
  // Grouped-amenity selection (raw backend slugs), distinct from the curated
  // `popularFilters` keys. AND semantics — a property must have all selected.
  amenities: AmenityType[];
}

export const PRICE_MIN = 0;
export const PRICE_MAX = 500;

export const INITIAL_FILTERS: Filters = {
  min_price: PRICE_MIN,
  max_price: PRICE_MAX,
  propertyTypes: [],
  popularFilters: [],
  minRating: null,
  bedrooms: null,
  min_guests: null,
  sort: DEFAULT_SORT,
  amenities: [],
};

export const PROPERTY_TYPE_KEYS = [
  "hotel",
  "apartment",
  "house",
  "villa",
  "hostel",
  "guesthouse",
] as const;

export const POPULAR_FILTER_KEYS = [
  "freeCancellation",
  "breakfastIncluded",
  "pool",
  "wifi",
  "parking",
  "petFriendly",
  "airConditioning",
  "kitchen",
] as const;

export const RATING_OPTIONS = [9, 8, 7] as const;
export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5] as const;

// ---------------------------------------------------------------------------
// URL-persisted filter state
//
// Filters live in the `/properties` URL search params so they survive refresh,
// back-navigation, and sharing. `FilterSearch` is the URL shape; `Filters` is
// the component shape. `sanitizeFilterSearch` runs inside the route's
// `validateSearch` and must NEVER throw — it strips junk and clamps so a
// hand-edited URL renders a (possibly empty) result instead of an error page.
// ---------------------------------------------------------------------------

export interface FilterSearch {
  minPrice?: number;
  maxPrice?: number;
  types?: string[];
  // Curated "popular filter" keys (freeCancellation, wifi, ...).
  amenities?: string[];
  // Grouped-amenity raw backend slugs (BTR-53), kept on a separate param so
  // the two selection surfaces never collide.
  features?: string[];
  rating?: number;
  bedrooms?: number;
  sort?: SortOption;
}

const PROPERTY_TYPE_SET: ReadonlySet<string> = new Set(PROPERTY_TYPE_KEYS);
const POPULAR_FILTER_SET: ReadonlySet<string> = new Set(POPULAR_FILTER_KEYS);

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value))
    return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string" && value !== "") return [value];
  return [];
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(Math.max(n, lo), hi);
}

export function sanitizeFilterSearch(
  raw: Record<string, unknown>,
): FilterSearch {
  const out: FilterSearch = {};

  let minPrice = toNumber(raw.minPrice);
  let maxPrice = toNumber(raw.maxPrice);
  if (minPrice !== undefined) minPrice = clamp(minPrice, PRICE_MIN, PRICE_MAX);
  if (maxPrice !== undefined) maxPrice = clamp(maxPrice, PRICE_MIN, PRICE_MAX);
  // Backend 422s on min>max — drop both rather than render an error page.
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    minPrice = undefined;
    maxPrice = undefined;
  }
  // Only keep bounds that actually constrain (redundant defaults stay off-URL).
  if (minPrice !== undefined && minPrice > PRICE_MIN) out.minPrice = minPrice;
  if (maxPrice !== undefined && maxPrice < PRICE_MAX) out.maxPrice = maxPrice;

  const types = toStringArray(raw.types).filter((t) => PROPERTY_TYPE_SET.has(t));
  if (types.length > 0) out.types = types;

  const amenities = toStringArray(raw.amenities).filter((a) =>
    POPULAR_FILTER_SET.has(a),
  );
  if (amenities.length > 0) out.amenities = amenities;

  const features = toStringArray(raw.features).filter((f) =>
    ALL_AMENITIES.has(f as AmenityType),
  );
  if (features.length > 0) out.features = features;

  const rating = toNumber(raw.rating);
  if (rating !== undefined && rating >= 0 && rating <= 10) out.rating = rating;

  const bedrooms = toNumber(raw.bedrooms);
  if (bedrooms !== undefined && Number.isInteger(bedrooms) && bedrooms >= 1)
    out.bedrooms = bedrooms;

  if (
    typeof raw.sort === "string" &&
    raw.sort !== DEFAULT_SORT &&
    SORT_OPTIONS.includes(raw.sort as SortOption)
  )
    out.sort = raw.sort as SortOption;

  return out;
}

/** Build the component `Filters` from a (sanitized) URL search object. */
export function filtersFromSearch(search: FilterSearch): Filters {
  return {
    min_price: search.minPrice ?? PRICE_MIN,
    max_price: search.maxPrice ?? PRICE_MAX,
    propertyTypes: search.types ?? [],
    popularFilters: search.amenities ?? [],
    minRating: search.rating ?? null,
    bedrooms: search.bedrooms ?? null,
    min_guests: null,
    sort: search.sort ?? DEFAULT_SORT,
    amenities: (search.features ?? []) as AmenityType[],
  };
}

/**
 * Project `Filters` back to URL search params, omitting every default so the
 * URL stays clean. Undefined keys are dropped by the router on navigate.
 */
export function searchFromFilters(filters: Filters): FilterSearch {
  return {
    minPrice: filters.min_price > PRICE_MIN ? filters.min_price : undefined,
    maxPrice: filters.max_price < PRICE_MAX ? filters.max_price : undefined,
    types: filters.propertyTypes.length > 0 ? filters.propertyTypes : undefined,
    amenities:
      filters.popularFilters.length > 0 ? filters.popularFilters : undefined,
    rating: filters.minRating ?? undefined,
    bedrooms: filters.bedrooms ?? undefined,
    sort: filters.sort !== DEFAULT_SORT ? filters.sort : undefined,
    features: filters.amenities.length > 0 ? filters.amenities : undefined,
  };
}

// Maps frontend popular filter keys to backend amenity names.
// freeCancellation and parking are handled separately as dedicated backend filters.
const POPULAR_FILTER_TO_AMENITY: Record<string, AmenityType> = {
  breakfastIncluded: "breakfast_included",
  pool: "pool",
  wifi: "wifi",
  petFriendly: "pet_friendly",
  airConditioning: "air_conditioning",
  kitchen: "kitchen",
};

export function buildParams(
  filters: Filters,
  extra?: { city?: string; settlement_ekatte?: string; region_code?: string; q?: string; min_guests?: number; checkIn?: string; checkOut?: string; lang?: string },
): Record<string, unknown> {
  const params: Record<string, unknown> = {
    status: "active",
  };

  if (extra?.region_code?.trim()) {
    params.region_code = extra.region_code.trim();
  } else if (extra?.settlement_ekatte?.trim()) {
    params.settlement_ekatte = extra.settlement_ekatte.trim();
  } else if (extra?.city?.trim()) {
    params.city = extra.city.trim();
  }
  if (extra?.q?.trim()) params.q = extra.q.trim();
  if (filters.min_price > PRICE_MIN) params.min_price = filters.min_price;
  if (filters.max_price < PRICE_MAX) params.max_price = filters.max_price;
  if (filters.propertyTypes.length > 0)
    params.property_type = filters.propertyTypes;
  if (filters.minRating !== null)
    params.min_rating = filters.minRating.toFixed(1);
  if (filters.bedrooms !== null) params.bedrooms = filters.bedrooms;

  // min_guests: prefer the URL search param (adults count), fall back to filter
  const guests = extra?.min_guests ?? filters.min_guests;
  if (guests && guests > 1) params.min_guests = guests;

  if (filters.popularFilters.includes("freeCancellation"))
    params.free_cancellation = true;
  if (filters.popularFilters.includes("parking")) params.has_parking = true;

  // Merge popular-filter-derived amenity slugs with the grouped-amenity
  // selection (AND semantics on the backend), de-duplicated.
  const amenities = [
    ...new Set<AmenityType>([
      ...filters.popularFilters
        .filter((k) => k in POPULAR_FILTER_TO_AMENITY)
        .map((k) => POPULAR_FILTER_TO_AMENITY[k]),
      ...filters.amenities,
    ]),
  ];
  if (amenities.length > 0) params.amenities = amenities;

  if (filters.sort !== DEFAULT_SORT) params.order_by = filters.sort;

  if (extra?.checkIn) params.available_from = extra.checkIn;
  if (extra?.checkOut) params.available_to = extra.checkOut;
  if (extra?.lang) params.lang = extra.lang;

  return params;
}
