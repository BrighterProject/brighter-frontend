import type { AmenityType } from "@Properties/api/types";

export interface Filters {
  min_price: number;
  max_price: number;
  propertyTypes: string[];
  popularFilters: string[];
  minRating: number | null;
  bedrooms: number | null;
  min_guests: number | null;
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
  extra?: { city?: string; min_guests?: number; checkIn?: string; checkOut?: string },
): Record<string, unknown> {
  const params: Record<string, unknown> = {
    status: "active",
  };

  if (extra?.city?.trim()) params.city = extra.city.trim();
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

  const amenities = filters.popularFilters
    .filter((k) => k in POPULAR_FILTER_TO_AMENITY)
    .map((k) => POPULAR_FILTER_TO_AMENITY[k]);
  if (amenities.length > 0) params.amenities = amenities;

  if (extra?.checkIn) params.available_from = extra.checkIn;
  if (extra?.checkOut) params.available_to = extra.checkOut;

  return params;
}
