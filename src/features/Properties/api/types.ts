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

export type AmenityType =
  | "wifi"
  | "air_conditioning"
  | "kitchen"
  | "washing_machine"
  | "fireplace"
  | "bbq"
  | "mountain_view"
  | "ski_storage"
  | "breakfast_included"
  | "reception_24h"
  | "sea_view"
  | "balcony"
  | "pool"
  | "garden"
  | "pet_friendly"
  | "coffee_machine";

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
  property_type: PropertyType;
  status: PropertyStatus;
  price_per_night: string;
  currency: string;
  max_guests: number;
  bedrooms: number;
  rooms: RoomEntry[];
  rating: string;
  total_reviews: number;
  thumbnail?: string | null;
}

export interface PropertyResponse {
  id: string;
  owner_id: string;
  property_type: PropertyType;
  status: PropertyStatus;
  city: string;
  latitude?: string | null;
  longitude?: string | null;
  price_per_night: string;
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
  rating: string;
  total_reviews: number;
  updated_at: string;
  translations: TranslationResponse[];
  images: PropertyImageResponse[];
  unavailabilities: PropertyUnavailabilityResponse[];
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

export interface WeekdayPriceOut {
  id: string;
  property_id: string;
  weekday: number;
  price: string;
}

export interface DatePriceOverride {
  id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  price: string;
  label?: string | null;
}

export type PriceSource = "base" | "weekday" | "date_override";

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
