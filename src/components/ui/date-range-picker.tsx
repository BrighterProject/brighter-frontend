import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  PropertyUnavailabilityResponse,
} from "@/features/Properties/api/types";
import type { OccupiedSlot, BookingResponse } from "@/features/Bookings/api/types";

export interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

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
}

function isoDate(d: Date): string {
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
  | "unavailable"
  | "booked"
  | "mine"
  | "check-in"
  | "check-out"
  | "in-range";

const DAY_BASE =
  "flex h-10 w-full items-center justify-center text-sm select-none transition-colors";

const DAY_CLASSES: Record<DayState, string> = {
  past: "text-muted-foreground/35 cursor-default",
  today:
    "font-bold text-primary ring-1 ring-inset ring-primary/40 rounded-full cursor-pointer hover:bg-primary/10",
  available:
    "text-foreground cursor-pointer hover:bg-primary/10 rounded-full",
  unavailable:
    "text-amber-600/50 cursor-default bg-amber-50/60 dark:bg-amber-950/20",
  booked:
    "text-red-400/60 cursor-default bg-red-50/60 dark:bg-red-950/20",
  mine: "text-blue-500/70 cursor-default bg-blue-50/70 dark:bg-blue-950/25",
  "check-in":
    "bg-primary text-primary-foreground cursor-pointer rounded-l-full font-semibold",
  "check-out":
    "bg-primary text-primary-foreground cursor-pointer rounded-r-full font-semibold",
  "in-range": "bg-primary/15 text-foreground cursor-pointer",
};

const DAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

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
}: DateRangePickerProps) {
  const { checkIn, checkOut } = value;
  const [monthOffset, setMonthOffset] = useState(0);

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
      if (d < today) return true;
      const ds = d.getTime();
      const de = ds + 86_400_000;
      for (const b of myPropertyBookings) {
        const bs = new Date(b.start_datetime).getTime();
        const be = new Date(b.end_datetime).getTime();
        if (ds < be && de > bs) return true;
      }
      for (const b of occupiedSlots) {
        const bs = new Date(b.start_datetime).getTime();
        const be = new Date(b.end_datetime).getTime();
        if (ds < be && de > bs) return true;
      }
      for (const u of unavailabilities) {
        const us = new Date(u.start_datetime).getTime();
        const ue = new Date(u.end_datetime).getTime();
        if (ds < ue && de > us) return true;
      }
      return false;
    },
    [today, myPropertyBookings, occupiedSlots, unavailabilities],
  );

  const rangeHasBlocked = useCallback(
    (from: Date, to: Date): boolean => {
      const cur = new Date(from.getTime() + 86_400_000);
      while (cur < to) {
        if (isBlockedDate(cur)) return true;
        cur.setTime(cur.getTime() + 86_400_000);
      }
      return false;
    },
    [isBlockedDate],
  );

  function getDayState(d: Date): DayState {
    if (d < today) return "past";
    if (checkIn && d.getTime() === checkIn.getTime()) return "check-in";
    if (checkOut && d.getTime() === checkOut.getTime()) return "check-out";
    if (checkIn && checkOut && d > checkIn && d < checkOut) return "in-range";

    const ds = d.getTime();
    const de = ds + 86_400_000;

    for (const b of myPropertyBookings) {
      const bs = new Date(b.start_datetime).getTime();
      const be = new Date(b.end_datetime).getTime();
      if (ds < be && de > bs) return "mine";
    }
    for (const b of occupiedSlots) {
      const bs = new Date(b.start_datetime).getTime();
      const be = new Date(b.end_datetime).getTime();
      if (ds < be && de > bs) return "booked";
    }
    for (const u of unavailabilities) {
      const us = new Date(u.start_datetime).getTime();
      const ue = new Date(u.end_datetime).getTime();
      if (ds < ue && de > us) return "unavailable";
    }

    if (d.getTime() === today.getTime()) return "today";
    return "available";
  }

  function handleDayClick(d: Date) {
    onError?.("");

    if (!checkIn || checkOut) {
      if (isBlockedDate(d)) return;
      onChange({ checkIn: d, checkOut: null });
      return;
    }

    if (d <= checkIn) {
      if (isBlockedDate(d)) return;
      onChange({ checkIn: d, checkOut: null });
      return;
    }

    const nights = Math.round((d.getTime() - checkIn.getTime()) / 86_400_000);

    if (nights < minNights) {
      onError?.(`Minimum stay: ${minNights} nights`);
      return;
    }
    if (maxNights && nights > maxNights) {
      onError?.(`Maximum stay: ${maxNights} nights`);
      return;
    }
    if (rangeHasBlocked(checkIn, d)) {
      onError?.("The selected range includes unavailable dates.");
      return;
    }

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
    <div className="rounded-xl border bg-card p-4 shadow-sm">
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
        {DAY_HEADERS.map((h) => (
          <div key={h}>{h}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {monthGrid.map((d, i) => {
          if (!d) return <div key={`pad-${i}`} className="h-10" />;
          const state = getDayState(d);
          return (
            <div
              key={isoDate(d)}
              role="button"
              tabIndex={state === "past" ? -1 : 0}
              aria-label={isoDate(d)}
              onClick={() => handleDayClick(d)}
              onKeyDown={(e) => e.key === "Enter" && handleDayClick(d)}
              className={cn(DAY_BASE, DAY_CLASSES[state])}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>

      {/* Legend (only shown when there are blocked dates to explain) */}
      {hasBlockedDates && (
        <div className="mt-3 border-t pt-3">
          <div className="flex flex-wrap justify-center gap-3">
            {myPropertyBookings.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="size-3 rounded-sm bg-blue-100 dark:bg-blue-950/30" />
                My booking
              </div>
            )}
            {occupiedSlots.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="size-3 rounded-sm bg-red-100 dark:bg-red-950/20" />
                Booked
              </div>
            )}
            {unavailabilities.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="size-3 rounded-sm bg-amber-50 dark:bg-amber-950/20" />
                Unavailable
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Midnight on date d with local timezone offset — safe for API submission. */
export function midnightISO(d: Date): string {
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const abs = Math.abs(off);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${isoDate(d)}T00:00:00${sign}${hh}:${mm}`;
}

export function parseDateParam(s: string | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
