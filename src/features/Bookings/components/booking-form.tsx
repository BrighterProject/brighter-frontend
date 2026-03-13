import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer, useLocaleStorage } from "react-intlayer";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  useCreateBooking,
  useCreateCheckout,
  useMyBookings,
  useOccupiedSlots,
} from "../api/hooks";
import type { PropertyResponse } from "@/features/Properties/api/types";

interface BookingFormProps {
  property: PropertyResponse;
}

// JS getDay() 0=Sun…6=Sat → Python weekday 0=Mon…6=Sun
function jsDateToPropertyKey(d: Date): string {
  return String((d.getDay() + 6) % 7);
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function offsetAwareISO(dateStr: string, hour: number): string {
  const d = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00`);
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const abs = Math.abs(off);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${dateStr}T${String(hour).padStart(2, "0")}:00:00${sign}${hh}:${mm}`;
}

type CellState =
  | "available"
  | "outside"
  | "unavailable"
  | "booked"
  | "mine"
  | "selected"
  | "past";

const CELL_CLASSES: Record<CellState, string> = {
  available:
    "bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer border-border",
  outside: "bg-muted cursor-default border-border",
  unavailable:
    "bg-amber-50 dark:bg-amber-950/20 cursor-default border-amber-200 dark:border-amber-900/30",
  booked:
    "bg-red-100 dark:bg-red-950/20 cursor-default border-red-200 dark:border-red-900/30",
  mine: "bg-blue-100 dark:bg-blue-950/20 cursor-default border-blue-200 dark:border-blue-900/30",
  selected:
    "bg-emerald-100 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 cursor-pointer",
  past: "bg-muted/50 cursor-default border-border opacity-50",
};

const LEGEND: { key: CellState; labelKey: string }[] = [
  { key: "available", labelKey: "available" },
  { key: "selected", labelKey: "selected" },
  { key: "mine", labelKey: "mine" },
  { key: "booked", labelKey: "booked" },
  { key: "unavailable", labelKey: "unavailable" },
  { key: "outside", labelKey: "closed" },
];

export function BookingForm({ property }: BookingFormProps) {
  const c = useIntlayer("booking-form");
  const navigate = useNavigate();
  const { getLocale } = useLocaleStorage();
  const createBooking = useCreateBooking();
  const createCheckout = useCreateCheckout(getLocale());
  const { data: myBookings = [] } = useMyBookings();
  const { data: occupiedSlots = [] } = useOccupiedSlots(property.id);

  const [weekOffset, setWeekOffset] = useState(0);
  const [selDate, setSelDate] = useState<string | null>(null);
  const [selStart, setSelStart] = useState<number | null>(null);
  const [selEnd, setSelEnd] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + weekOffset + i);
      return d;
    });
  }, [weekOffset]);

  const [minHour, maxHour] = useMemo(() => {
    let min = 8,
      max = 22;
    for (const v of Object.values(property.working_hours)) {
      if (!v) continue;
      const o = parseInt(v.open);
      const c = parseInt(v.close);
      if (o < min) min = o;
      if (c > max) max = c;
    }
    return [min, max];
  }, [property.working_hours]);

  const hours = useMemo(
    () => Array.from({ length: maxHour - minHour }, (_, i) => minHour + i),
    [minHour, maxHour],
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

  function getCellState(
    dateStr: string,
    hour: number,
    dateObj: Date,
  ): CellState {
    const now = new Date();
    const nowDate = isoDate(now);
    if (dateStr < nowDate || (dateStr === nowDate && hour < now.getHours())) {
      return "past";
    }

    const key = jsDateToPropertyKey(dateObj);
    const wh = property.working_hours[key] ?? property.working_hours["default"];
    if (!wh || hour < parseInt(wh.open) || hour >= parseInt(wh.close)) {
      return "outside";
    }

    const cellStart = new Date(
      `${dateStr}T${String(hour).padStart(2, "0")}:00:00`,
    );
    const cellEnd = new Date(
      `${dateStr}T${String(hour + 1).padStart(2, "0")}:00:00`,
    );
    for (const u of property.unavailabilities) {
      const us = new Date(u.start_datetime);
      const ue = new Date(u.end_datetime);
      if (cellStart < ue && cellEnd > us) return "unavailable";
    }

    for (const b of occupiedSlots) {
      const bs = new Date(b.start_datetime);
      const be = new Date(b.end_datetime);
      if (cellStart < be && cellEnd > bs) return "booked";
    }

    for (const b of myPropertyBookings) {
      const bs = new Date(b.start_datetime);
      const be = new Date(b.end_datetime);
      if (cellStart < be && cellEnd > bs) return "mine";
    }

    if (selDate === dateStr && selStart !== null) {
      const lo = selEnd !== null ? Math.min(selStart, selEnd) : selStart;
      const hi = selEnd !== null ? Math.max(selStart, selEnd) : selStart;
      if (hour >= lo && hour <= hi) return "selected";
    }

    return "available";
  }

  function handleCellClick(dateStr: string, hour: number, state: CellState) {
    if (
      state === "outside" ||
      state === "unavailable" ||
      state === "booked" ||
      state === "mine" ||
      state === "past"
    )
      return;

    if (selDate !== dateStr || selStart === null) {
      setSelDate(dateStr);
      setSelStart(hour);
      setSelEnd(null);
    } else if (selEnd === null) {
      if (hour === selStart) {
        setSelStart(null);
        setSelDate(null);
      } else {
        const lo = Math.min(selStart, hour);
        const hi = Math.max(selStart, hour);
        setSelStart(lo);
        setSelEnd(hi);
      }
    } else {
      setSelDate(dateStr);
      setSelStart(hour);
      setSelEnd(null);
    }
    setError(null);
  }

  const duration =
    selStart !== null && selEnd !== null
      ? selEnd - selStart + 1
      : selStart !== null
        ? 1
        : 0;
  const totalPrice =
    duration > 0 ? (Number(property.price_per_hour) * duration).toFixed(2) : null;

  const formattedSel = useMemo(() => {
    if (!selDate || selStart === null) return null;
    const d = new Date(selDate + "T00:00:00");
    const dateLabel = d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const endH = selEnd ?? selStart;
    return `${dateLabel} · ${String(selStart).padStart(2, "0")}:00 – ${String(endH + 1).padStart(2, "0")}:00`;
  }, [selDate, selStart, selEnd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selDate || selStart === null) {
      setError(c.errors.selectSlot.value as string);
      return;
    }
    const endH = selEnd ?? selStart;
    let booking;
    try {
      booking = await createBooking.mutateAsync({
        property_id: property.id,
        start_datetime: offsetAwareISO(selDate, selStart),
        end_datetime: offsetAwareISO(selDate, endH + 1),
        notes: notes.trim() || null,
      });
    } catch (err: any) {
      const httpStatus = err?.response?.status;
      console.error("[booking]", err?.response?.data?.detail ?? err);
      if (httpStatus === 409) {
        setError(c.errors.conflict.value as string);
      } else {
        setError(c.errors.generic.value as string);
      }
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

  const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
          {c.title} <span className="text-primary">{property.name}</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: grid */}
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                {/* Week nav */}
                <div className="mb-3 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={weekOffset <= 0}
                    onClick={() => setWeekOffset((o) => o - 7)}
                  >
                    {c.grid.prev}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {c.grid.instruction}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setWeekOffset((o) => o + 7)}
                  >
                    {c.grid.next}
                  </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr>
                        <th className="w-12" />
                        {dates.map((d) => {
                          const ds = isoDate(d);
                          const isToday = ds === isoDate(new Date());
                          return (
                            <th
                              key={ds}
                              className={cn(
                                "px-1 pb-2 text-center font-medium",
                                isToday
                                  ? "text-primary"
                                  : "text-muted-foreground",
                              )}
                            >
                              <div>{DAY_SHORT[(d.getDay() + 6) % 7]}</div>
                              <div
                                className={cn(
                                  "text-base font-bold",
                                  isToday && "text-primary",
                                )}
                              >
                                {d.getDate()}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {hours.map((hour) => (
                        <tr key={hour}>
                          <td className="w-12 py-0 pr-2 text-right tabular-nums leading-none text-muted-foreground">
                            {String(hour).padStart(2, "0")}:00
                          </td>
                          {dates.map((d) => {
                            const ds = isoDate(d);
                            const state = getCellState(ds, hour, d);
                            return (
                              <td
                                key={ds}
                                onClick={() => handleCellClick(ds, hour, state)}
                                className={cn(
                                  "h-8 border text-center transition-colors",
                                  CELL_CLASSES[state],
                                  state === "selected" &&
                                    selDate === ds &&
                                    (hour === (selStart ?? -1) ||
                                      hour === (selEnd ?? selStart ?? -1)) &&
                                    "font-bold",
                                )}
                              />
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-3 border-t pt-3">
                  {LEGEND.map(({ key, labelKey }) => (
                    <div
                      key={key}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <div
                        className={cn(
                          "size-3 rounded-sm border",
                          CELL_CLASSES[key],
                        )}
                      />
                      {(c.grid.legend as any)[labelKey]}
                    </div>
                  ))}
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

            {/* Right: summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
                <div>
                  <p className="truncate font-display font-semibold text-foreground">
                    {property.name}
                  </p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-display text-2xl font-bold text-foreground">
                      {Number(property.price_per_hour).toFixed(0)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {property.currency} {c.summary.perHour}
                    </span>
                  </div>
                </div>

                <hr className="border-border" />

                <div className="space-y-2 text-sm">
                  {formattedSel ? (
                    <>
                      <p className="font-medium text-foreground">
                        {formattedSel}
                      </p>
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          {duration} {c.labels.hours}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1 text-base font-semibold text-foreground">
                        <span>{c.summary.total}</span>
                        <span>
                          {totalPrice} {property.currency}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {c.summary.noTime}
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
                    !selDate ||
                    selStart === null
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
