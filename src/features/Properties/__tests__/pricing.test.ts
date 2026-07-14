import { describe, it, expect } from "vitest";
import { buildPricingMap, resolveTotal } from "../utils/pricing";
import type { DatePrice } from "../api/types";

const dp = (date: string, price: string): DatePrice => ({
  id: date,
  property_id: "p1",
  date,
  price,
});

describe("buildPricingMap", () => {
  it("maps each per-date row to its price", () => {
    const map = buildPricingMap([
      dp("2026-07-12", "80.00"),
      dp("2026-07-13", "90.00"),
    ]);
    expect(map).toEqual({ "2026-07-12": "80.00", "2026-07-13": "90.00" });
  });

  it("returns an empty map when there are no priced rows", () => {
    expect(buildPricingMap([])).toEqual({});
  });
});

describe("resolveTotal", () => {
  const map: Record<string, string> = {
    "2026-07-12": "80.00",
    "2026-07-13": "90.00",
    "2026-07-14": "100.00",
  };

  it("sums the nightly prices for the stay (checkout exclusive)", () => {
    const total = resolveTotal(
      new Date(2026, 6, 12),
      new Date(2026, 6, 14),
      map,
    );
    expect(total).toBe(170);
  });

  it("returns null when any night in the range is unpriced", () => {
    const total = resolveTotal(
      new Date(2026, 6, 12),
      new Date(2026, 6, 16),
      map,
    );
    expect(total).toBeNull();
  });
});
