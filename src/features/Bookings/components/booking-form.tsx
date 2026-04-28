import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer, useLocaleStorage } from "react-intlayer";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBooking, useCreateCheckout } from "../api/hooks";
import {
  type PropertyResponse,
  resolveTranslation,
} from "@/features/Properties/api/types";
import { isoDate, parseDateParam } from "@/components/ui/date-range-picker";
import { useMe } from "@/features/Auth/api/hooks";

const COUNTRY_CODES = [
  "AF", "AL", "DZ", "AD", "AO", "AR", "AM", "AU", "AT", "AZ", "BH", "BD",
  "BY", "BE", "BA", "BR", "BG", "KH", "CA", "CL", "CN", "CO", "HR", "CY",
  "CZ", "DK", "EG", "EE", "ET", "FI", "FR", "GE", "DE", "GH", "GR", "HU",
  "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "JP", "JO", "KZ", "KE",
  "XK", "KW", "LV", "LB", "LY", "LI", "LT", "LU", "MY", "MT", "MX", "MD",
  "MC", "ME", "MA", "NL", "NZ", "NG", "MK", "NO", "PK", "PS", "PH", "PL",
  "PT", "QA", "RO", "RU", "SA", "RS", "SG", "SK", "SI", "ZA", "KR", "ES",
  "SE", "CH", "SY", "TW", "TH", "TN", "TR", "UA", "AE", "GB", "US", "UZ",
  "VN",
];

interface BookingFormProps {
  property: PropertyResponse;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
}

interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  specialRequests: string;
}

const EMPTY_GUEST: GuestInfo = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  specialRequests: "",
};

function validateEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function validatePhone(v: string): boolean {
  return /^\+?[\d\s\-().]{6,20}$/.test(v.trim());
}

export function BookingForm({
  property,
  checkIn: checkInParam,
  checkOut: checkOutParam,
  adults = 1,
  children = 0,
}: BookingFormProps) {
  const c = useIntlayer("booking-form");
  const navigate = useNavigate();
  const { getLocale } = useLocaleStorage();
  const locale = getLocale();

  const { data: me } = useMe();
  const createBooking = useCreateBooking();
  const createCheckout = useCreateCheckout(locale);
  const propertyName =
    resolveTranslation(property.translations, locale)?.name ?? "Untitled";

  const countryOptions = (() => {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    return COUNTRY_CODES
      .map((code) => ({ code, name: dn.of(code) ?? code }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));
  })();

  const checkIn = parseDateParam(checkInParam);
  const checkOut = parseDateParam(checkOutParam);

  const nights =
    checkIn && checkOut
      ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000)
      : 0;

  const totalPrice =
    nights > 0 ? (Number(property.price_per_night) * nights).toFixed(2) : null;

  const numGuests = adults + children;

  const [guest, setGuest] = useState<GuestInfo>(EMPTY_GUEST);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<GuestInfo>>({});

  useEffect(() => {
    if (!me) return;
    setGuest((prev) => ({
      ...prev,
      fullName: prev.fullName || me.full_name || "",
      email: prev.email || me.email || "",
    }));
  }, [me]);

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
    if (!guest.phone.trim())
      errs.phone = c.errors.phoneRequired.value as string;
    else if (!validatePhone(guest.phone))
      errs.phone = c.errors.phoneInvalid.value as string;
    if (!guest.country)
      errs.country = c.errors.countryRequired.value as string;
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

    let booking;
    try {
      booking = await createBooking.mutateAsync({
        property_id: property.id,
        start_date: isoDate(checkIn),
        end_date: isoDate(checkOut),
        num_guests: numGuests,
        guest_name: guest.fullName.trim(),
        guest_email: guest.email.trim(),
        guest_phone: guest.phone.trim(),
        guest_country: guest.country || null,
        special_requests: guest.specialRequests.trim() || null,
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
      ? d.toLocaleDateString(locale, {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : "—";

  const guestsLabel = (() => {
    const adultStr = `${adults} ${adults === 1 ? (c.labels.adult.value as string) : (c.labels.adults.value as string)}`;
    if (children === 0) return adultStr;
    const childStr = `${children} ${children === 1 ? (c.labels.child.value as string) : (c.labels.children.value as string)}`;
    return `${adultStr}, ${childStr}`;
  })();

  const inputClass =
    "h-10 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring";

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
          {c.title} <span className="text-primary">{propertyName}</span>
        </h1>

        {(!checkIn || !checkOut) && (
          <div className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {c.errors.noDates}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: guest info */}
            <div className="space-y-6 lg:col-span-2">
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
                      className={inputClass}
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
                      className={inputClass}
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
                      {c.form.phone.label}{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      value={guest.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      placeholder={c.form.phone.placeholder.value as string}
                      className={inputClass}
                      required
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs text-destructive">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      {c.form.country.label}{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={guest.country}
                      onChange={(e) => setField("country", e.target.value)}
                      className={`${inputClass} cursor-pointer`}
                      required
                    >
                      <option value="" disabled>
                        {c.form.country.placeholder.value as string}
                      </option>
                      {countryOptions.map(({ code, name }) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.country && (
                      <p className="mt-1 text-xs text-destructive">
                        {fieldErrors.country}
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

              {error && (
                <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                {/* Stay details card */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <h3 className="mb-4 font-display text-base font-semibold text-foreground">
                    {c.sections.stayDetails}
                  </h3>
                  <p className="mb-3 truncate text-sm font-medium text-foreground">
                    {propertyName}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{c.labels.checkIn}</span>
                      <div className="text-right font-medium text-foreground">
                        <div>{formatDate(checkIn)}</div>
                        {property.check_in_time && (
                          <div className="text-xs text-muted-foreground">
                            {property.check_in_time}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{c.labels.checkOut}</span>
                      <div className="text-right font-medium text-foreground">
                        <div>{formatDate(checkOut)}</div>
                        {property.check_out_time && (
                          <div className="text-xs text-muted-foreground">
                            {property.check_out_time}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{c.labels.guests}</span>
                      <span className="font-medium text-foreground">
                        {guestsLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing card */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-baseline gap-1">
                    <span className="font-display text-2xl font-bold text-foreground">
                      {Number(property.price_per_night).toFixed(0)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {property.currency} {c.summary.perNight}
                    </span>
                  </div>

                  {(property.min_nights > 1 || property.max_nights > 0) && (
                    <p className="mb-3 text-xs text-muted-foreground">
                      {property.min_nights > 1 && (
                        <>
                          {c.summary.minLabel} {property.min_nights}{" "}
                          {c.labels.nights}
                        </>
                      )}
                      {property.min_nights > 1 && property.max_nights > 0 && " · "}
                      {property.max_nights > 0 && (
                        <>
                          {c.summary.maxLabel} {property.max_nights}{" "}
                          {c.labels.nights}
                        </>
                      )}
                    </p>
                  )}

                  {nights > 0 && (
                    <div className="space-y-2 text-sm">
                      <div className="text-muted-foreground">
                        {nights} {c.labels.nights} ×{" "}
                        {Number(property.price_per_night).toFixed(0)}{" "}
                        {property.currency}
                      </div>
                      <div className="flex justify-between border-t pt-2 text-base font-semibold text-foreground">
                        <span>{c.summary.total}</span>
                        <span>
                          {totalPrice} {property.currency}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="mt-5 w-full gap-2 rounded-xl shadow-lg shadow-primary/20"
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
          </div>
        </form>
      </div>
    </div>
  );
}
