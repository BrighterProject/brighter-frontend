import type { DatePriceOverride, WeekdayPriceOut } from "../api/types";

function isoDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Resolve the price for a single night (check-in night starting on `date`).
 * Priority mirrors the server: date_override > weekday_price > base_price.
 * When multiple overrides overlap, the last one in array order wins (matches
 * the server's created_at-ordered list for typical single-override cases).
 */
export function resolveNightPrice(
  date: Date,
  basePricePerNight: string,
  weekdayPrices: WeekdayPriceOut[],
  dateOverrides: DatePriceOverride[],
): string {
  const ds = isoDateStr(date);

  let overridePrice: string | null = null;
  for (const o of dateOverrides) {
    if (ds >= o.start_date && ds <= o.end_date) {
      overridePrice = o.price;
    }
  }
  if (overridePrice !== null) return overridePrice;

  // JS: Sun=0...Sat=6 → Mon=0...Sun=6 (matches server weekday convention)
  const weekday = (date.getDay() + 6) % 7;
  const wp = weekdayPrices.find((w) => w.weekday === weekday);
  if (wp) return wp.price;

  return basePricePerNight;
}

/**
 * Build a map of ISO date string → price string for a date window.
 * `from` is inclusive, `to` is exclusive.
 */
export function buildPricingMap(
  from: Date,
  to: Date,
  basePricePerNight: string,
  weekdayPrices: WeekdayPriceOut[],
  dateOverrides: DatePriceOverride[],
): Record<string, string> {
  const map: Record<string, string> = {};
  const cur = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (cur < to) {
    map[isoDateStr(cur)] = resolveNightPrice(
      cur,
      basePricePerNight,
      weekdayPrices,
      dateOverrides,
    );
    cur.setDate(cur.getDate() + 1);
  }
  return map;
}

/**
 * Compute the total price for a stay from checkIn (inclusive) to checkOut (exclusive).
 */
export function resolveTotal(
  checkIn: Date,
  checkOut: Date,
  basePricePerNight: string,
  weekdayPrices: WeekdayPriceOut[],
  dateOverrides: DatePriceOverride[],
): number {
  let total = 0;
  const cur = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());
  while (cur < checkOut) {
    total += parseFloat(
      resolveNightPrice(cur, basePricePerNight, weekdayPrices, dateOverrides),
    );
    cur.setDate(cur.getDate() + 1);
  }
  return total;
}
