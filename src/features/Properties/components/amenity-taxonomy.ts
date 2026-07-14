import type { AmenityType } from "@Properties/api/types";

/**
 * Category → amenity grouping for the filter UI (BTR-53).
 *
 * The backend `AmenityType` enum is flat and only validates values; this const
 * is the frontend-owned grouping that drives the grouped "Amenities" filter
 * section. Category keys and amenity slugs map to intlayer labels under
 * `properties-list` → `filters.amenities.categories` / `.items`.
 *
 * Keep this in sync with the backend enum and the admin panel's copy. Values
 * are additive only — never rename/remove a slug (amenities are stored as a
 * JSON list on the property).
 */
export interface AmenityCategory {
  key: string;
  amenities: readonly AmenityType[];
}

export const AMENITY_CATEGORIES: readonly AmenityCategory[] = [
  {
    key: "views",
    amenities: [
      "sea_view",
      "mountain_view",
      "lake_view",
      "beachfront",
      "ski_to_door",
      "city_center",
    ],
  },
  {
    key: "kitchen",
    amenities: [
      "kitchen",
      "kitchenette",
      "coffee_machine",
      "dishwasher",
      "microwave",
      "oven",
      "restaurant",
    ],
  },
  {
    key: "comfort",
    amenities: [
      "wifi",
      "air_conditioning",
      "heating",
      "fireplace",
      "washing_machine",
      "dryer",
      "iron",
      "tv",
      "workspace",
    ],
  },
  {
    key: "outdoors",
    amenities: [
      "pool",
      "indoor_pool",
      "garden",
      "bbq",
      "balcony",
      "terrace",
      "hot_tub",
    ],
  },
  {
    key: "family",
    amenities: ["pet_friendly", "crib", "high_chair", "playground", "board_games"],
  },
  {
    key: "wellness",
    amenities: ["sauna", "spa", "gym", "massage"],
  },
  {
    key: "services",
    amenities: [
      "reception_24h",
      "breakfast_included",
      "airport_shuttle",
      "ev_charger",
      "luggage_storage",
      "daily_housekeeping",
      "ski_storage",
    ],
  },
  {
    key: "safety",
    amenities: [
      "smoke_alarm",
      "fire_extinguisher",
      "first_aid_kit",
      "elevator",
      "ground_floor",
      "step_free_access",
    ],
  },
] as const;

/** Flat set of every valid amenity slug — used to sanitize URL params. */
export const ALL_AMENITIES: ReadonlySet<AmenityType> = new Set(
  AMENITY_CATEGORIES.flatMap((cat) => cat.amenities),
);

/** How many amenities show per category before the "show more" toggle. */
export const AMENITY_PREVIEW_COUNT = 5;
