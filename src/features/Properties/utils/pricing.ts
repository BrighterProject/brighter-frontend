import type { DatePrice } from "../api/types";

function isoDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Build an ISO date string -> price map from the property's per-date price rows.
 * The calendar is the sole source of truth: a date absent from `datePrices` is
 * unpriced and therefore unavailable — it simply never enters the map. There
 * are no recurring weekday defaults and no base-price fallback.
 */
export function buildPricingMap(
  datePrices: DatePrice[],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const dp of datePrices) map[dp.date] = dp.price;
  return map;
}

/**
 * Sum the per-night prices for a stay from `checkIn` (inclusive) to `checkOut`
 * (exclusive) using a per-date price map. Returns null if any night in the
 * range is unpriced — unpriced days are blocked in the picker up front, so this
 * is a fail-closed guard rather than an expected path.
 */
export function resolveTotal(
  checkIn: Date,
  checkOut: Date,
  pricingMap: Record<string, string>,
): number | null {
  let total = 0;
  const cur = new Date(
    checkIn.getFullYear(),
    checkIn.getMonth(),
    checkIn.getDate(),
  );
  while (cur < checkOut) {
    const price = pricingMap[isoDateStr(cur)];
    if (price === undefined) return null;
    total += parseFloat(price);
    cur.setDate(cur.getDate() + 1);
  }
  return total;
}
