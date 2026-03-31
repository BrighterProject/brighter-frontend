import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer, useLocaleStorage } from "react-intlayer";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateBooking,
  useCreateCheckout,
} from "../api/hooks";
import {
  type PropertyResponse,
  resolveTranslation,
} from "@/features/Properties/api/types";
import { midnightISO, parseDateParam } from "@/components/ui/date-range-picker";

interface BookingFormProps {
  property: PropertyResponse;
  checkIn?: string;
  checkOut?: string;
}

interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

const EMPTY_GUEST: GuestInfo = {
  fullName: "",
  email: "",
  phone: "",
  specialRequests: "",
};

function validateEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function validatePhone(v: string): boolean {
  return /^\+?[\d\s\-().]{6,20}$/.test(v.trim());
}

export function BookingForm({ property, checkIn: checkInParam, checkOut: checkOutParam }: BookingFormProps) {
  const c = useIntlayer("booking-form");
  const navigate = useNavigate();
  const { getLocale } = useLocaleStorage();

  const createBooking = useCreateBooking();
  const createCheckout = useCreateCheckout(getLocale());

  const propertyName =
    resolveTranslation(property.translations, getLocale())?.name ?? "Untitled";

  // Dates come from route search params — set on the property detail page
  const checkIn = parseDateParam(checkInParam);
  const checkOut = parseDateParam(checkOutParam);

  const nights =
    checkIn && checkOut
      ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000)
      : 0;

  const totalPrice =
    nights > 0
      ? (Number(property.price_per_night) * nights).toFixed(2)
      : null;

  const [guest, setGuest] = useState<GuestInfo>(EMPTY_GUEST);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<GuestInfo>>({});

  const setField = <K extends keyof GuestInfo>(key: K, value: string) => {
    setGuest((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function validate(): boolean {
    const errs: Partial<GuestInfo> = {};
    if (!guest.fullName.trim())
      errs.fullName = c.errors.fullNameRequired.value as string;
    if (!validateEmail(guest.email))
      errs.email = c.errors.emailInvalid.value as string;
    if (guest.phone.trim() && !validatePhone(guest.phone))
      errs.phone = c.errors.phoneInvalid.value as string;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!checkIn || !checkOut) {
      setError(c.errors.noDates.value as string);
      return;
    }
    if (!validate()) return;

    // Pack guest info into notes as structured JSON
    // TODO: add guest_name, guest_email, guest_phone fields to bookings-ms schema
    const guestBlock = JSON.stringify({
      guest_name: guest.fullName.trim(),
      guest_email: guest.email.trim(),
      guest_phone: guest.phone.trim() || null,
      special_requests: guest.specialRequests.trim() || null,
    });
    const combinedNotes = notes.trim()
      ? `${guestBlock}\n${notes.trim()}`
      : guestBlock;

    let booking;
    try {
      booking = await createBooking.mutateAsync({
        property_id: property.id,
        start_datetime: midnightISO(checkIn),
        end_datetime: midnightISO(checkOut),
        notes: combinedNotes,
      });
    } catch (err: any) {
      const httpStatus = err?.response?.status;
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
    } catch {
      setError(c.errors.checkoutFailed.value as string);
      navigate({ to: "/{-$locale}/bookings" as any } as any);
    }
  };

  const formatDate = (d: Date | null) =>
    d
      ? d.toLocaleDateString(getLocale(), {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : "—";

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

        {/* No dates guard */}
        {(!checkIn || !checkOut) && (
          <div className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {c.errors.noDates}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: guest info + notes */}
            <div className="space-y-6 lg:col-span-2">
              {/* Guest information */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="mb-5 font-display text-base font-semibold text-foreground">
                  {c.sections.guestInfo}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Full name */}
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      {c.form.fullName.label}{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={guest.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      placeholder={c.form.fullName.placeholder.value as string}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                    {fieldErrors.fullName && (
                      <p className="mt-1 text-xs text-destructive">
                        {fieldErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      {c.form.email.label}{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      value={guest.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder={c.form.email.placeholder.value as string}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-xs text-destructive">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      {c.form.phone.label}
                    </label>
                    <input
                      type="tel"
                      value={guest.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      placeholder={c.form.phone.placeholder.value as string}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs text-destructive">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Special requests */}
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      {c.form.specialRequests.label}
                    </label>
                    <Textarea
                      value={guest.specialRequests}
                      onChange={(e) =>
                        setField("specialRequests", e.target.value)
                      }
                      placeholder={
                        c.form.specialRequests.placeholder.value as string
                      }
                      rows={2}
                      maxLength={500}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="mb-3 font-display text-sm font-semibold text-foreground">
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

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{c.labels.checkIn}</span>
                    <span className="font-medium text-foreground">
                      {formatDate(checkIn)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{c.labels.checkOut}</span>
                    <span className="font-medium text-foreground">
                      {formatDate(checkOut)}
                    </span>
                  </div>
                  {nights > 0 && (
                    <>
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
