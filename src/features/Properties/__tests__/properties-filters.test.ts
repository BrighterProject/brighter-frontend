import { describe, it, expect } from "vitest";
import {
  INITIAL_FILTERS,
  sanitizeFilterSearch,
  filtersFromSearch,
  searchFromFilters,
  buildParams,
  type Filters,
} from "../components/properties-filters";

describe("sanitizeFilterSearch", () => {
  it("returns an empty object for no filter params", () => {
    expect(sanitizeFilterSearch({})).toEqual({});
  });

  it("coerces numeric strings and keeps in-range prices", () => {
    expect(sanitizeFilterSearch({ minPrice: "50", maxPrice: "200" })).toEqual({
      minPrice: 50,
      maxPrice: 200,
    });
  });

  it("strips non-numeric price values", () => {
    expect(sanitizeFilterSearch({ minPrice: "abc", maxPrice: "200" })).toEqual({
      maxPrice: 200,
    });
  });

  it("clamps out-of-range prices and drops redundant bounds", () => {
    // -50 → PRICE_MIN and 9999 → PRICE_MAX are both no-op bounds → dropped.
    expect(sanitizeFilterSearch({ minPrice: -50, maxPrice: 9999 })).toEqual({});
  });

  it("keeps a meaningful in-range price after coercion", () => {
    expect(sanitizeFilterSearch({ minPrice: 400 })).toEqual({ minPrice: 400 });
  });

  it("drops BOTH price bounds when minPrice > maxPrice", () => {
    // backend 422s on min>max, so an unsanitized hand-edited URL must not render
    expect(sanitizeFilterSearch({ minPrice: 300, maxPrice: 100 })).toEqual({});
  });

  it("keeps only known property type keys", () => {
    expect(
      sanitizeFilterSearch({ types: ["hotel", "spaceship", "villa"] }),
    ).toEqual({ types: ["hotel", "villa"] });
  });

  it("keeps only known amenity keys", () => {
    expect(
      sanitizeFilterSearch({ amenities: ["wifi", "nonsense", "pool"] }),
    ).toEqual({ amenities: ["wifi", "pool"] });
  });

  it("coerces a single string param into an array", () => {
    expect(sanitizeFilterSearch({ types: "hotel" })).toEqual({
      types: ["hotel"],
    });
  });

  it("drops empty arrays", () => {
    expect(sanitizeFilterSearch({ types: [], amenities: ["junk"] })).toEqual({});
  });

  it("accepts a valid sort and drops the default/invalid ones", () => {
    expect(sanitizeFilterSearch({ sort: "price_asc" })).toEqual({
      sort: "price_asc",
    });
    expect(sanitizeFilterSearch({ sort: "recommended" })).toEqual({});
    expect(sanitizeFilterSearch({ sort: "bogus" })).toEqual({});
  });

  it("keeps valid rating and bedrooms, drops junk", () => {
    expect(sanitizeFilterSearch({ rating: "8", bedrooms: "2" })).toEqual({
      rating: 8,
      bedrooms: 2,
    });
    expect(sanitizeFilterSearch({ rating: 99, bedrooms: -1 })).toEqual({});
  });
});

describe("filtersFromSearch", () => {
  it("returns INITIAL_FILTERS for an empty search", () => {
    expect(filtersFromSearch({})).toEqual(INITIAL_FILTERS);
  });

  it("maps sanitized search onto the Filters shape", () => {
    const f = filtersFromSearch({
      minPrice: 50,
      maxPrice: 200,
      types: ["hotel"],
      amenities: ["wifi"],
      rating: 8,
      bedrooms: 2,
      sort: "price_desc",
    });
    expect(f).toEqual({
      min_price: 50,
      max_price: 200,
      propertyTypes: ["hotel"],
      popularFilters: ["wifi"],
      minRating: 8,
      bedrooms: 2,
      min_guests: null,
      sort: "price_desc",
    });
  });
});

describe("searchFromFilters", () => {
  it("omits every default (clean URL) for INITIAL_FILTERS", () => {
    expect(searchFromFilters(INITIAL_FILTERS)).toEqual({
      minPrice: undefined,
      maxPrice: undefined,
      types: undefined,
      amenities: undefined,
      rating: undefined,
      bedrooms: undefined,
      sort: undefined,
    });
  });

  it("round-trips a populated Filters through the URL shape", () => {
    const filters: Filters = {
      min_price: 50,
      max_price: 200,
      propertyTypes: ["hotel"],
      popularFilters: ["wifi"],
      minRating: 8,
      bedrooms: 2,
      min_guests: null,
      sort: "price_asc",
    };
    const roundTripped = filtersFromSearch(
      sanitizeFilterSearch(searchFromFilters(filters) as Record<string, unknown>),
    );
    expect(roundTripped).toEqual(filters);
  });
});

describe("buildParams order_by", () => {
  it("omits order_by for the recommended default", () => {
    const params = buildParams(INITIAL_FILTERS);
    expect(params.order_by).toBeUndefined();
  });

  it("emits order_by for an explicit sort", () => {
    const params = buildParams({ ...INITIAL_FILTERS, sort: "price_asc" });
    expect(params.order_by).toBe("price_asc");
  });
});
