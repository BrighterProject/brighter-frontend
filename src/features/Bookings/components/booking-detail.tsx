import { useState } from "react";
import { useIntlayer } from "react-intlayer";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  ExternalLink,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useBooking,
  useBookingPayment,
  useCancelBooking,
  useCreateCheckout,
} from "../api/hooks";
import type { BookingStatus, PaymentStatus } from "../api/types";
import { useProperty } from "@Properties/api/hooks";
import { resolveTranslation } from "@Properties/api/types";

const STATUS_COLOR: Record<BookingStatus, string> = {
  pending:
    "text-yellow-600 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-950/30",
  confirmed:
    "text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/30",
  completed: "text-muted-foreground border-border bg-muted",
  cancelled:
    "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/30",
  no_show:
    "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/30",
};

const PAYMENT_COLOR: Record<PaymentStatus, string> = {
  pending:
    "text-orange-600 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:bg-orange-950/30",
  paid: "text-emerald-700 border-emerald-300 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/30",
  refunded:
    "text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-950/30",
  failed:
    "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/30",
};

function nightCount(start: string, end: string) {
  return Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000,
  );
}

function formatLong(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Row({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm">{children}</span>
    </div>
  );
}

function SectionBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen pb-12">
      <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-6">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-48 w-full animate-pulse rounded-2xl bg-muted sm:h-64" />
        <div className="mt-4 space-y-2">
          <div className="h-6 w-52 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface BookingDetailProps {
  bookingId: string;
  locale: string;
}

export function BookingDetail({ bookingId, locale }: BookingDetailProps) {
  const c = useIntlayer("booking-detail");
  const navigate = useNavigate();
  const { data: booking, isLoading: isLoadingBooking } = useBooking(bookingId);
  const { data: payment } = useBookingPayment(bookingId);
  const { data: property, isLoading: isLoadingProperty } = useProperty(
    booking?.property_id ?? "",
    locale,
  );
  const cancelBooking = useCancelBooking();
  const createCheckout = useCreateCheckout(locale);
  const [isPaying, setIsPaying] = useState(false);

  if (isLoadingBooking) return <DetailSkeleton />;

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{c.notFound}</p>
      </div>
    );
  }

  const status = booking.status as BookingStatus;
  const isPending = status === "pending";
  // "Pay now" is an online Stripe (card) checkout. Only offer it for a card
  // booking whose property still accepts card — otherwise checkout just errors
  // (cash-only properties, or owners who disabled card/bank transfer).
  const canPayOnline =
    booking.payment_method === "card" &&
    (property?.payment_config?.accepted_methods.includes("card") ?? false);
  const needsPayment = isPending && !payment && canPayOnline;
  const nights = nightCount(booking.start_date, booking.end_date);

  const translation = property
    ? resolveTranslation(property.translations, locale)
    : null;
  const propertyName = translation?.name ?? property?.city ?? null;
  const thumbnailUrl =
    property?.images.find((i) => i.is_thumbnail)?.url ??
    property?.images[0]?.url ??
    null;
  const propertyHref = `/${locale}/properties/${booking.property_id}`;

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      const { checkout_url, payment_id } =
        await createCheckout.mutateAsync(bookingId);
      if (!checkout_url.startsWith("https://checkout.stripe.com/"))
        throw new Error("Unexpected checkout URL");
      sessionStorage.setItem("pending_payment_id", payment_id);
      window.location.href = checkout_url;
    } catch (err: unknown) {
      console.error("[checkout]", err);
      toast.error(c.toasts.paymentError.value as string);
    } finally {
      setIsPaying(false);
    }
  };

  const handleCancel = () => {
    cancelBooking.mutate(bookingId, {
      onError: () => toast.error(c.toasts.cancelError.value as string),
      onSuccess: () =>
        navigate({ to: `/${locale}/bookings` as any }),
    });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Back nav */}
      <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-6">
        <button
          onClick={() => navigate({ to: `/${locale}/bookings` as any })}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {c.backToBookings}
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Property image */}
        <div className="mt-4">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={propertyName ?? ""}
              className="h-52 w-full rounded-2xl object-cover sm:h-72"
            />
          ) : (
            <div className="flex h-52 w-full items-center justify-center rounded-2xl bg-muted sm:h-72">
              <Building2 className="size-16 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Property name + city + status badge */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {isLoadingProperty ? (
              <>
                <div className="h-6 w-52 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-28 animate-pulse rounded bg-muted" />
              </>
            ) : (
              <>
                <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
                  {propertyName}
                </h1>
                {property?.city && (
                  <p className="mt-0.5 text-muted-foreground">
                    {property.city}
                  </p>
                )}
              </>
            )}
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold",
              STATUS_COLOR[status],
            )}
          >
            {c.status[status]}
          </span>
        </div>

        {/* Detail sections */}
        <div className="mt-6 space-y-3">
          {/* Schedule */}
          <SectionBlock icon={Calendar} title={c.schedule}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {c.checkIn}
                </p>
                <p className="font-semibold">
                  {formatLong(booking.start_date, locale)}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {c.checkOut}
                </p>
                <p className="font-semibold">{formatLong(booking.end_date, locale)}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {nights} {c.nights}
            </p>
          </SectionBlock>

          {/* Pricing */}
          <SectionBlock icon={CreditCard} title={c.pricing}>
            <Row label={c.rate}>
              {Number(booking.price_per_night).toFixed(2)} {booking.currency}{" "}
              {c.perNight}
            </Row>
            {booking.gap_adjustment_pct != null &&
              booking.gap_adjustment_pct > 0 && (
                <Row label={`${c.shortStayPremium} (${booking.gap_adjustment_pct}%)`}>
                  {c.included}
                </Row>
              )}
            <div className="mt-2 border-t pt-2">
              <Row label={c.total}>
                <span className="text-base font-bold tabular-nums">
                  {Number(booking.total_price).toFixed(2)} {booking.currency}
                </span>
              </Row>
            </div>
          </SectionBlock>

          {/* Payment */}
          {payment && (
            <SectionBlock icon={CreditCard} title={c.payment}>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
                  PAYMENT_COLOR[payment.status],
                  payment.status === "pending" && "animate-pulse",
                )}
              >
                <CreditCard className="size-3" />
                {c.paymentStatus[payment.status]}
              </span>
            </SectionBlock>
          )}

          {/* References */}
          <SectionBlock icon={Hash} title={c.references}>
            <Row label={c.bookingId}>
              <span className="font-mono text-xs text-muted-foreground">
                {booking.id}
              </span>
            </Row>
            <div className="mt-2 border-t pt-2">
              <a
                href={propertyHref}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                {c.viewProperty}
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </SectionBlock>
        </div>

        {/* Actions */}
        {(needsPayment || isPending) && (
          <div className="mt-6 flex gap-3">
            {needsPayment && (
              <Button
                className="flex-1 rounded-xl"
                disabled={isPaying}
                onClick={handlePayNow}
              >
                {isPaying ? c.paying : c.payNow}
              </Button>
            )}
            {isPending && (
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={cancelBooking.isPending}
                onClick={handleCancel}
              >
                {cancelBooking.isPending ? c.cancelling : c.cancel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
