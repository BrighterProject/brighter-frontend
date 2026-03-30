export interface Filters {
  city: string;
  min_price: number;
  max_price: number;
  propertyTypes: string[];
  popularFilters: string[];
  minRating: number | null;
}

export const PRICE_MIN = 0;
export const PRICE_MAX = 500;

export const INITIAL_FILTERS: Filters = {
  city: "",
  min_price: PRICE_MIN,
  max_price: PRICE_MAX,
  propertyTypes: [],
  popularFilters: [],
  minRating: null,
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

export function buildParams(filters: Filters): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  if (filters.city.trim()) params.city = filters.city.trim();
  if (filters.min_price > PRICE_MIN) params.min_price = filters.min_price;
  if (filters.max_price < PRICE_MAX) params.max_price = filters.max_price;
  if (filters.propertyTypes.length > 0)
    params.property_type = filters.propertyTypes;
  if (filters.minRating !== null)
    params.min_rating = (filters.minRating / 2).toFixed(1); // UI is 0-10 scale, backend is 0-5

  if (filters.popularFilters.includes("freeCancellation"))
    params.free_cancellation = true;
  if (filters.popularFilters.includes("parking")) params.has_parking = true;
  const amenities = filters.popularFilters
    .filter((k) => k in POPULAR_FILTER_TO_AMENITY)
    .map((k) => POPULAR_FILTER_TO_AMENITY[k]);
  if (amenities.length > 0) params.amenities = amenities;

  return params;
}
