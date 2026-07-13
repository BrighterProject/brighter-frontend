export type BedType =
  | "single"
  | "double"
  | "queen"
  | "king"
  | "sofa_bed"
  | "bunk"
  | "crib";

export type RoomType =
  | "bedroom"
  | "living_room"
  | "kitchen"
  | "bathroom"
  | "studio";

export interface BedEntry {
  bed_type: BedType;
  count: number;
}

export interface RoomEntry {
  room_type: RoomType;
  count: number;
  beds: BedEntry[];
  area_m2?: number | null;
}

export type PropertyStatus =
  | "active"
  | "inactive"
  | "maintenance"
  | "pending_approval";

export type PropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "hotel"
  | "hostel"
  | "guesthouse"
  | "room"
  | "other";

export type CancellationPolicy = "free" | "moderate" | "strict";

// Flat amenity taxonomy mirroring the backend `AmenityType` enum (BTR-53).
// Category grouping for the filter UI lives in `components/amenity-taxonomy.ts`.
export type AmenityType =
  // Views & location
  | "sea_view"
  | "mountain_view"
  | "lake_view"
  | "beachfront"
  | "ski_to_door"
  | "city_center"
  // Kitchen & dining
  | "kitchen"
  | "kitchenette"
  | "coffee_machine"
  | "dishwasher"
  | "microwave"
  | "oven"
  | "restaurant"
  // Comfort
  | "wifi"
  | "air_conditioning"
  | "heating"
  | "fireplace"
  | "washing_machine"
  | "dryer"
  | "iron"
  | "tv"
  | "workspace"
  // Outdoors
  | "pool"
  | "indoor_pool"
  | "garden"
  | "bbq"
  | "balcony"
  | "terrace"
  | "hot_tub"
  // Family
  | "pet_friendly"
  | "crib"
  | "high_chair"
  | "playground"
  | "board_games"
  // Wellness
  | "sauna"
  | "spa"
  | "gym"
  | "massage"
  // Services
  | "reception_24h"
  | "breakfast_included"
  | "airport_shuttle"
  | "ev_charger"
  | "luggage_storage"
  | "daily_housekeeping"
  | "ski_storage"
  // Safety & accessibility
  | "smoke_alarm"
  | "fire_extinguisher"
  | "first_aid_kit"
  | "elevator"
  | "ground_floor"
  | "step_free_access";

export interface TranslationResponse {
  id: string;
  property_id: string;
  locale: string;
  name: string;
  description: string;
  address: string;
  house_rules?: string | null;
}

export interface PropertyListItem {
  id: string;
  name: string;
  description: string;
  city: string;
  latitude?: string | null;
  longitude?: string | null;
  property_type: PropertyType;
  status: PropertyStatus;
  /** Derived cheapest nightly rate ("from X"); null when no pricing is set. */
  price_from: string | null;
  currency: string;
  max_guests: number;
  bedrooms: number;
  rooms: RoomEntry[];
  rating: string;
  total_reviews: number;
  thumbnail?: string | null;
  // Present only when the search carried a date range: the resolved total for
  // the whole stay and the number of nights it covers.
  stay_total?: string | null;
  stay_nights?: number | null;
}

export type PaymentMethodOption = "card" | "bank_transfer" | "cash";

export interface PaymentConfig {
  accepted_methods: PaymentMethodOption[];
  deposit_pct: number;
  remaining_method: PaymentMethodOption | null;
}

export interface PropertyResponse {
  id: string;
  owner_id: string;
  property_type: PropertyType;
  status: PropertyStatus;
  city: string;
  latitude?: string | null;
  longitude?: string | null;
  /** Derived cheapest nightly rate ("from X"); null when no pricing is set. */
  price_from: string | null;
  currency: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  has_parking: boolean;
  amenities: AmenityType[];
  check_in_time?: string | null;
  check_out_time?: string | null;
  min_nights: number;
  max_nights: number;
  cancellation_policy: CancellationPolicy;
  payment_config: PaymentConfig | null;
  rating: string;
  total_reviews: number;
  updated_at: string;
  translations: TranslationResponse[];
  images: PropertyImageResponse[];
  unavailabilities: PropertyUnavailabilityResponse[];
  /** How many days in advance this property can be booked. */
  booking_window_days: number;
}

/** A contiguous run of days with no price set (`[start_date, end_date)`, end-exclusive). */
export interface UnpricedWindow {
  start_date: string;
  end_date: string;
}

export interface PricingCoverageResponse {
  unpriced_windows: UnpricedWindow[];
}

/**
 * Resolve a translation for the given locale from a PropertyResponse.
 * Fallback: requested locale -> "bg" -> first available.
 */
export function resolveTranslation(
  translations: TranslationResponse[],
  locale: string,
): TranslationResponse | undefined {
  const byLocale = Object.fromEntries(translations.map((t) => [t.locale, t]));
  return byLocale[locale] ?? byLocale["bg"] ?? translations[0];
}

export interface PropertyImageResponse {
  id: string;
  property_id: string;
  url: string;
  is_thumbnail: boolean;
  order: number;
}

export interface PropertyUnavailabilityResponse {
  id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  reason?: string | null;
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

/** A single priced night — the calendar is the sole source of truth. */
export interface DatePrice {
  id: string;
  property_id: string;
  date: string;
  price: string;
}

export type PriceSource = "date" | "unpriced";

export interface ResolvedNightPrice {
  date: string;
  price: string;
  source: PriceSource;
  label?: string | null;
}

export interface PriceResolutionResponse {
  currency: string;
  nights: ResolvedNightPrice[];
  total: string;
}
