import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PropertyUnavailabilityResponse } from "@/features/Properties/api/types";
import type {
  OccupiedSlot,
  BookingResponse,
} from "@/features/Bookings/api/types";

export interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

export interface DateRangePickerLabels {
  myBooking?: string;
  booked?: string;
  unavailable?: string;
  turnoverCheckoutOnly?: string;
  minNights?: (n: number) => string;
  maxNights?: (n: number) => string;
  rangeUnavailable?: string;
}

const DEFAULT_LABELS: Required<DateRangePickerLabels> = {
  myBooking: "My booking",
  booked: "Booked",
  unavailable: "Unavailable",
  turnoverCheckoutOnly: "You can only check out here.",
  minNights: (n) => `Minimum stay: ${n} nights`,
  maxNights: (n) => `Maximum stay: ${n} nights`,
  rangeUnavailable: "The selected range includes unavailable dates.",
};

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  unavailabilities?: PropertyUnavailabilityResponse[];
  occupiedSlots?: OccupiedSlot[];
  myBookings?: BookingResponse[];
  propertyId?: string;
  minNights?: number;
  maxNights?: number;
  onError?: (msg: string) => void;
  locale?: string;
  labels?: DateRangePickerLabels;
  /** ISO date → price string. When provided, shows the price below each non-past day number. */
  pricingMap?: Record<string, string>;
}

export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0…Sun=6
  const cells: (Date | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

type DayState =
  | "past"
  | "today"
  | "available"
  | "out-of-reach"      // cannot be selected as checkout (after checkIn is set)
  | "unavailable"
  | "unavailable-start" // turnover: block starts here, preceding night is free
  | "booked"
  | "booked-start"      // turnover: block starts here, preceding night is free
  | "mine"
  | "mine-start"        // turnover: block starts here, preceding night is free
  | "check-in"
  | "check-out"
  | "in-range";

const DAY_BASE =
  "relative flex w-full flex-col items-center justify-center select-none transition-all duration-150";
const DAY_BASE_NO_PRICE = "h-10 text-sm";
const DAY_BASE_PRICE = "h-14 text-sm";

const DAY_CLASSES: Record<DayState, string> = {
  past: "text-muted-foreground/30 cursor-default",
  today:
    "font-semibold text-primary ring-2 ring-primary/30 rounded-full cursor-pointer hover:bg-primary/8 hover:ring-primary/50",
  available:
    "text-foreground cursor-pointer hover:bg-primary/10 rounded-full active:scale-95",
  // Dates unreachable as checkout once checkIn is selected: muted, non-interactive
  "out-of-reach": "text-muted-foreground/40 cursor-default",
  unavailable:
    "text-amber-600/50 cursor-default bg-amber-50/70 dark:bg-amber-950/20",
  // Turnover days look nearly normal — a small dot below the number carries the hint.
  // The preceding night is free so checkout here is valid; check-in is still blocked.
  "unavailable-start":
    "text-foreground/70 cursor-pointer hover:bg-primary/10 rounded-full active:scale-95",
  booked: "text-rose-400/70 cursor-default bg-rose-50/70 dark:bg-rose-950/20",
  "booked-start":
    "text-foreground/70 cursor-pointer hover:bg-primary/10 rounded-full active:scale-95",
  mine: "text-blue-500/70 cursor-default bg-blue-50/70 dark:bg-blue-950/25",
  "mine-start":
    "text-foreground/70 cursor-pointer hover:bg-primary/10 rounded-full active:scale-95",
  "check-in":
    "bg-primary text-primary-foreground cursor-pointer rounded-l-full font-semibold active:scale-95",
  "check-out":
    "bg-primary text-primary-foreground cursor-pointer rounded-r-full font-semibold active:scale-95",
  "in-range": "bg-primary/10 text-foreground cursor-pointer",
};

// Small dot rendered below the date number for turnover days
const TURNOVER_DOT_CLASS: Partial<Record<DayState, string>> = {
  "booked-start": "bg-rose-400/60",
  "mine-start": "bg-blue-400/60",
  "unavailable-start": "bg-amber-400/60",
};

export function DateRangePicker({
  value,
  onChange,
  unavailabilities = [],
  occupiedSlots = [],
  myBookings = [],
  propertyId,
  minNights = 1,
  maxNights,
  onError,
  locale = "en",
  labels: labelsProp,
  pricingMap,
}: DateRangePickerProps) {
  const L = { ...DEFAULT_LABELS, ...labelsProp };
  const { checkIn, checkOut } = value;
  const [monthOffset, setMonthOffset] = useState(0);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // Locale-aware short weekday headers Mon–Sun (2024-01-01 is a Monday)
  const dayHeaders = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        new Date(2024, 0, i + 1).toLocaleDateString(locale, {
          weekday: "short",
        }),
      ),
    [locale],
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const { viewYear, viewMonth } = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    return { viewYear: d.getFullYear(), viewMonth: d.getMonth() };
  }, [today, monthOffset]);

  const monthGrid = useMemo(
    () => getMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const myPropertyBookings = useMemo(
    () =>
      myBookings.filter(
        (b) =>
          (!propertyId || b.property_id === propertyId) &&
          b.status !== "cancelled" &&
          b.status !== "no_show",
      ),
    [myBookings, propertyId],
  );

  const isBlockedDate = useCallback(
    (d: Date): boolean => {
      const ds = isoDate(d);
      if (ds < isoDate(today)) return true;
      // Night-based: booking [start, end) — checkout date is free for next check-in.
      for (const b of myPropertyBookings) {
        if (ds >= b.start_date && ds < b.end_date) return true;
      }
      for (const b of occupiedSlots) {
        if (ds >= b.start_date && ds < b.end_date) return true;
      }
      for (const u of unavailabilities) {
        if (ds >= u.start_date && ds < u.end_date) return true;
      }
      return false;
    },
    [today, myPropertyBookings, occupiedSlots, unavailabilities],
  );

  const rangeHasBlocked = useCallback(
    (from: Date, to: Date): boolean => {
      const toStr = isoDate(to);
      const cur = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1);
      while (isoDate(cur) < toStr) {
        if (isBlockedDate(cur)) return true;
        cur.setDate(cur.getDate() + 1);
      }
      return false;
    },
    [isBlockedDate],
  );

  /**
   * Once the user has picked a checkIn, find the first date after it that is blocked.
   * Checkout AT that date is still valid (rangeHasBlocked stops before it), but the
   * next day onward is unreachable — we grey those out as "out-of-reach".
   */
  const outOfReachFrom = useMemo<string | null>(() => {
    if (!checkIn || checkOut) return null;
    const cur = new Date(checkIn);
    cur.setDate(cur.getDate() + 1);
    for (let i = 0; i < 400; i++) {
      if (isBlockedDate(cur)) {
        const cutoff = new Date(cur);
        cutoff.setDate(cutoff.getDate() + 1);
        return isoDate(cutoff);
      }
      cur.setDate(cur.getDate() + 1);
    }
    return null;
  }, [checkIn, checkOut, isBlockedDate]);

  function getDayState(d: Date): DayState {
    const ds = isoDate(d);
    const ts = isoDate(today);
    if (ds < ts) return "past";
    if (checkIn && ds === isoDate(checkIn)) return "check-in";
    if (checkOut && ds === isoDate(checkOut)) return "check-out";
    if (checkIn && checkOut && ds > isoDate(checkIn) && ds < isoDate(checkOut)) return "in-range";

    // Dynamic shading: dates after checkIn that cannot be reached as checkout
    if (checkIn && !checkOut && ds > isoDate(checkIn)) {
      const nights = Math.round((d.getTime() - checkIn.getTime()) / 86_400_000);
      if (nights < minNights) return "out-of-reach";
      if (maxNights && nights > maxNights) return "out-of-reach";
      if (outOfReachFrom && ds >= outOfReachFrom) return "out-of-reach";
    }

    // Static occupancy states — turnover (-start) days get a dot, not a background
    for (const b of myPropertyBookings) {
      if (ds === b.start_date) return "mine-start";
      if (ds > b.start_date && ds < b.end_date) return "mine";
    }
    for (const b of occupiedSlots) {
      if (ds === b.start_date) return "booked-start";
      if (ds > b.start_date && ds < b.end_date) return "booked";
    }
    for (const u of unavailabilities) {
      if (ds === u.start_date) return "unavailable-start";
      if (ds > u.start_date && ds < u.end_date) return "unavailable";
    }

    if (ds === ts) return "today";
    return "available";
  }

  /** Returns true if d is exactly the first day of any occupied block (turnover day). */
  function isTurnoverStart(d: Date): boolean {
    const ds = isoDate(d);
    return (
      myPropertyBookings.some((b) => b.start_date === ds) ||
      occupiedSlots.some((b) => b.start_date === ds) ||
      unavailabilities.some((u) => u.start_date === ds)
    );
  }

  function handleDayClick(d: Date) {
    onError?.("");
    setInfoMsg(null);

    if (!checkIn || checkOut) {
      if (isTurnoverStart(d)) {
        setInfoMsg(L.turnoverCheckoutOnly);
        return;
      }
      if (isBlockedDate(d)) return;
      onChange({ checkIn: d, checkOut: null });
      return;
    }

    if (d <= checkIn) {
      if (isTurnoverStart(d)) {
        setInfoMsg(L.turnoverCheckoutOnly);
        return;
      }
      if (isBlockedDate(d)) return;
      onChange({ checkIn: d, checkOut: null });
      return;
    }

    const nights = Math.round((d.getTime() - checkIn.getTime()) / 86_400_000);

    if (nights < minNights) {
      onError?.(L.minNights(minNights));
      return;
    }
    if (maxNights && nights > maxNights) {
      onError?.(L.maxNights(maxNights));
      return;
    }
    if (rangeHasBlocked(checkIn, d)) {
      onError?.(L.rangeUnavailable);
      return;
    }

    setInfoMsg(null);
    onChange({ checkIn, checkOut: d });
  }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(
    locale,
    { month: "long", year: "numeric" },
  );

  const hasBlockedDates =
    unavailabilities.length > 0 ||
    occupiedSlots.length > 0 ||
    myPropertyBookings.length > 0;

  return (
    <div className="rounded-xl border bg-card p-2 shadow-sm sm:p-4">
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={monthOffset <= 0}
          onClick={() => setMonthOffset((o) => o - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="font-display font-semibold capitalize text-foreground">
          {monthLabel}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setMonthOffset((o) => o + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
        {dayHeaders.map((h) => (
          <div key={h}>{h}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {monthGrid.map((d, i) => {
          if (!d)
            return (
              <div
                key={`pad-${i}`}
                className={pricingMap ? "h-14" : "h-10"}
              />
            );
          const state = getDayState(d);
          const dotClass = TURNOVER_DOT_CLASS[state];
          const interactive =
            state !== "past" &&
            state !== "booked" &&
            state !== "mine" &&
            state !== "unavailable" &&
            state !== "out-of-reach";
          const ds = isoDate(d);
          const dayPrice =
            pricingMap && state !== "past" ? pricingMap[ds] : undefined;
          return (
            <div
              key={ds}
              role="button"
              tabIndex={interactive ? 0 : -1}
              aria-label={ds}
              onClick={() => handleDayClick(d)}
              onKeyDown={(e) => e.key === "Enter" && handleDayClick(d)}
              className={cn(
                DAY_BASE,
                pricingMap ? DAY_BASE_PRICE : DAY_BASE_NO_PRICE,
                DAY_CLASSES[state],
              )}
            >
              <span>{d.getDate()}</span>
              {dayPrice !== undefined && (
                <span className="text-[9px] leading-none tabular-nums text-muted-foreground/70">
                  {Math.round(parseFloat(dayPrice))}
                </span>
              )}
              {dotClass && (
                <span
                  className={cn(
                    "absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full",
                    dotClass,
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Info message (e.g. turnover-day check-in attempt) */}
      {infoMsg && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {infoMsg}
        </p>
      )}

      {/* Legend */}
      {hasBlockedDates && (
        <div className="mt-3 border-t pt-3">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {myPropertyBookings.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="size-3 rounded-sm bg-blue-100 dark:bg-blue-950/30" />
                {L.myBooking}
              </div>
            )}
            {occupiedSlots.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="size-3 rounded-sm bg-rose-100 dark:bg-rose-950/25" />
                {L.booked}
              </div>
            )}
            {unavailabilities.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="size-3 rounded-sm border border-amber-200/60 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20" />
                {L.unavailable}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function parseDateParam(s: string | undefined): Date | null {
  if (!s) return null;
  // Parse as local midnight to avoid UTC-offset shifting the date.
  const parts = s.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [y, m, d] = parts;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}
