import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer, useLocaleStorage } from "react-intlayer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  useCreateBooking,
  useCreateCheckout,
  useMyBookings,
  useOccupiedSlots,
} from "../api/hooks";
import {
  type PropertyResponse,
  resolveTranslation,
} from "@/features/Properties/api/types";

interface BookingFormProps {
  property: PropertyResponse;
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Midnight on date d, with local timezone offset appended. */
function midnightISO(d: Date): string {
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const abs = Math.abs(off);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${isoDate(d)}T00:00:00${sign}${hh}:${mm}`;
}

/** Returns an array of Date|null for a calendar month grid (Monday-first, null = padding). */
function getMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0 … Sun=6
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

const DAY_BASE = "flex h-10 w-full items-center justify-center text-sm select-none transition-colors";

const DAY_CLASSES: Record<DayState, string> = {
  past: "text-muted-foreground/35 cursor-default",
  today: "font-bold text-primary ring-1 ring-inset ring-primary/40 rounded-full cursor-pointer hover:bg-primary/10",
  available: "text-foreground cursor-pointer hover:bg-primary/10 rounded-full",
  unavailable: "text-amber-600/50 cursor-default bg-amber-50/60 dark:bg-amber-950/20",
  booked: "text-red-400/60 cursor-default bg-red-50/60 dark:bg-red-950/20",
  mine: "text-blue-500/70 cursor-default bg-blue-50/70 dark:bg-blue-950/25",
  "check-in": "bg-primary text-primary-foreground cursor-pointer rounded-l-full font-semibold",
  "check-out": "bg-primary text-primary-foreground cursor-pointer rounded-r-full font-semibold",
  "in-range": "bg-primary/15 text-foreground cursor-pointer",
};

export function BookingForm({ property }: BookingFormProps) {
  const c = useIntlayer("booking-form");
  const navigate = useNavigate();
  const { getLocale } = useLocaleStorage();
  const createBooking = useCreateBooking();
  const createCheckout = useCreateCheckout(getLocale());
  const { data: myBookings = [] } = useMyBookings();
  const { data: occupiedSlots = [] } = useOccupiedSlots(property.id);
  const propertyName =
    resolveTranslation(property.translations, getLocale())?.name ?? "Untitled";

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [monthOffset, setMonthOffset] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

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
          b.property_id === property.id &&
          b.status !== "cancelled" &&
          b.status !== "no_show",
      ),
    [myBookings, property.id],
  );

  /** True when date d is blocked (past, occupied, or unavailable). */
  function isBlockedDate(d: Date): boolean {
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
    for (const u of property.unavailabilities) {
      const us = new Date(u.start_datetime).getTime();
      const ue = new Date(u.end_datetime).getTime();
      if (ds < ue && de > us) return true;
    }
    return false;
  }

  /** True if any day strictly between `from` and `to` is blocked. */
  function rangeHasBlocked(from: Date, to: Date): boolean {
    const cur = new Date(from.getTime() + 86_400_000);
    while (cur < to) {
      if (isBlockedDate(cur)) return true;
      cur.setTime(cur.getTime() + 86_400_000);
    }
    return false;
  }

  function getDayState(d: Date): DayState {
    if (d < today) return "past";

    // Selection overlay has highest priority
    if (checkIn && d.getTime() === checkIn.getTime()) return "check-in";
    if (checkOut && d.getTime() === checkOut.getTime()) return "check-out";
    if (checkIn && checkOut && d > checkIn && d < checkOut) return "in-range";

    // Occupancy states
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
    for (const u of property.unavailabilities) {
      const us = new Date(u.start_datetime).getTime();
      const ue = new Date(u.end_datetime).getTime();
      if (ds < ue && de > us) return "unavailable";
    }

    if (d.getTime() === today.getTime()) return "today";
    return "available";
  }

  function handleDayClick(d: Date) {
    setError(null);

    // Phase 1: no selection, or resetting — pick check-in
    if (!checkIn || checkOut) {
      if (isBlockedDate(d)) return;
      setCheckIn(d);
      setCheckOut(null);
      return;
    }

    // Phase 2: check-in set, picking check-out
    if (d <= checkIn) {
      // Clicked before or on check-in — restart
      if (isBlockedDate(d)) return;
      setCheckIn(d);
      setCheckOut(null);
      return;
    }

    const nights = Math.round((d.getTime() - checkIn.getTime()) / 86_400_000);

    if (nights < property.min_nights) {
      setError(
        `${c.errors.minNights.value as string} ${property.min_nights} ${c.labels.nights.value as string}`,
      );
      return;
    }
    if (property.max_nights && nights > property.max_nights) {
      setError(
        `${c.errors.maxNights.value as string} ${property.max_nights} ${c.labels.nights.value as string}`,
      );
      return;
    }
    if (rangeHasBlocked(checkIn, d)) {
      setError(c.errors.blockedInRange.value as string);
      return;
    }

    setCheckOut(d);
  }

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000);
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(
    () =>
      nights > 0
        ? (Number(property.price_per_night) * nights).toFixed(2)
        : null,
    [nights, property.price_per_night],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!checkIn || !checkOut) {
      setError(c.errors.selectDates.value as string);
      return;
    }
    let booking;
    try {
      booking = await createBooking.mutateAsync({
        property_id: property.id,
        start_datetime: midnightISO(checkIn),
        end_datetime: midnightISO(checkOut),
        notes: notes.trim() || null,
      });
    } catch (err: any) {
      const httpStatus = err?.response?.status;
      console.error("[booking]", err?.response?.data?.detail ?? err);
      setError(
        httpStatus === 409
          ? (c.errors.conflict.value as string)
          : (c.errors.generic.value as string),
      );
      return;
    }

    try {
      const { checkout_url, payment_id } = await createCheckout.mutateAsync(
        booking.id,
      );
      if (!checkout_url.startsWith("https://checkout.stripe.com/")) {
        throw new Error("Unexpected checkout URL");
      }
      sessionStorage.setItem("pending_payment_id", payment_id);
      window.location.href = checkout_url;
    } catch (err: any) {
      console.error("[checkout]", err?.response?.data?.detail ?? err);
      setError(c.errors.checkoutFailed.value as string);
      navigate({ to: "/{-$locale}/bookings" as any } as any);
    }
  };

  const dayHeaders = (c.calendar.dayHeaders.value as string).split("_");

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(
    getLocale(),
    { month: "long", year: "numeric" },
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/{-$locale}/properties/$propertyId" as any,
              params: { propertyId: property.id } as any,
            })
          }
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          {c.back}
        </button>

        <h1 className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground">
          {c.title} <span className="text-primary">{propertyName}</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Calendar */}
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-2xl border bg-card p-5 shadow-sm">
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

                {/* Day-of-week headers */}
                <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
                  {dayHeaders.map((h) => (
                    <div key={h}>{h}</div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7">
                  {monthGrid.map((d, i) => {
                    if (!d)
                      return <div key={`pad-${i}`} className="h-10" />;
                    const state = getDayState(d);
                    return (
                      <div
                        key={isoDate(d)}
                        role="button"
                        tabIndex={state === "past" ? -1 : 0}
                        aria-label={isoDate(d)}
                        onClick={() => handleDayClick(d)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleDayClick(d)
                        }
                        className={cn(DAY_BASE, DAY_CLASSES[state])}
                      >
                        {d.getDate()}
                      </div>
                    );
                  })}
                </div>

                {/* Instruction + legend */}
                <div className="mt-4 border-t pt-3">
                  <p className="mb-2 text-center text-xs text-muted-foreground">
                    {c.calendar.instruction}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {(
                      [
                        {
                          cls: "bg-primary/15 border border-primary/20",
                          label: c.legend.range,
                        },
                        {
                          cls: "bg-blue-100 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/30",
                          label: c.legend.mine,
                        },
                        {
                          cls: "bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30",
                          label: c.legend.booked,
                        },
                        {
                          cls: "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30",
                          label: c.legend.unavailable,
                        },
                      ] as const
                    ).map(({ cls, label }, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <div className={cn("size-3 rounded-sm", cls)} />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="font-display text-sm font-semibold text-foreground">
                  {c.sections.notes}
                </h2>
                <Textarea
                  value={notes}
                  maxLength={1000}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={c.notesPlaceholder.value as string}
                  rows={2}
                />
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
                {/* Price header */}
                <div>
                  <p className="truncate font-display font-semibold text-foreground">
                    {propertyName}
                  </p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-display text-2xl font-bold text-foreground">
                      {Number(property.price_per_night).toFixed(0)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {property.currency} {c.summary.perNight}
                    </span>
                  </div>
                  {(property.min_nights > 1 || property.max_nights > 0) && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {property.min_nights > 1 && (
                        <>
                          {c.summary.minLabel} {property.min_nights}{" "}
                          {c.labels.nights}
                        </>
                      )}
                      {property.min_nights > 1 && property.max_nights > 0 &&
                        " · "}
                      {property.max_nights > 0 && (
                        <>
                          {c.summary.maxLabel} {property.max_nights}{" "}
                          {c.labels.nights}
                        </>
                      )}
                    </p>
                  )}
                </div>

                <hr className="border-border" />

                {/* Booking details */}
                <div className="space-y-2 text-sm">
                  {checkIn && checkOut ? (
                    <>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{c.labels.checkIn}</span>
                        <span className="font-medium text-foreground">
                          {checkIn.toLocaleDateString(getLocale(), {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{c.labels.checkOut}</span>
                        <span className="font-medium text-foreground">
                          {checkOut.toLocaleDateString(getLocale(), {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {nights} {c.labels.nights} ×{" "}
                        {Number(property.price_per_night).toFixed(0)}{" "}
                        {property.currency}
                      </div>
                      <div className="flex justify-between border-t pt-1 text-base font-semibold text-foreground">
                        <span>{c.summary.total}</span>
                        <span>
                          {totalPrice} {property.currency}
                        </span>
                      </div>
                    </>
                  ) : checkIn ? (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {c.summary.selectCheckout}
                      </p>
                      <p className="font-medium text-foreground">
                        {checkIn.toLocaleDateString(getLocale(), {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {c.summary.noDates}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 rounded-xl shadow-lg shadow-primary/20"
                  disabled={
                    createBooking.isPending ||
                    createCheckout.isPending ||
                    !checkIn ||
                    !checkOut
                  }
                >
                  {createBooking.isPending
                    ? c.submit.submitting
                    : createCheckout.isPending
                      ? c.submit.redirecting
                      : c.submit.idle}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
