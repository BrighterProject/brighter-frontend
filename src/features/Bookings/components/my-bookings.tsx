import { useEffect, useRef, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Building2, Calendar, CalendarSearch, ChevronRight, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMyBookings,
  useCancelBooking,
  useMyPayments,
  useCreateCheckout,
  useAbandonPayment,
} from "../api/hooks";
import type { BookingResponse, BookingStatus, PaymentStatus } from "../api/types";
import { usePropertiesForBookings } from "@Properties/api/hooks";
import { resolveTranslation } from "@Properties/api/types";
import type { PropertyResponse } from "@Properties/api/types";

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

const UPCOMING_STATUSES: Set<BookingStatus> = new Set(["pending", "confirmed"]);
const PAST_STATUSES: Set<BookingStatus> = new Set([
  "completed",
  "cancelled",
  "no_show",
]);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function nightCount(start: string, end: string) {
  return Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000,
  );
}

function BookingSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-card shadow-sm">
      <div className="flex gap-4 p-4">
        <div className="h-[72px] w-[72px] shrink-0 rounded-xl bg-muted" />
        <div className="flex-1 space-y-2 py-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1.5">
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-3.5 w-24 rounded bg-muted" />
            </div>
            <div className="h-5 w-16 rounded-full bg-muted" />
          </div>
          <div className="h-3.5 w-36 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  count,
}: {
  title: React.ReactNode;
  count: number;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
      <div className="flex-1 border-t" />
      <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
        {count}
      </span>
    </div>
  );
}

interface BookingCardProps {
  booking: BookingResponse;
  property: PropertyResponse | null;
  isPropertyLoading: boolean;
  locale: string;
  payment: { status: PaymentStatus } | undefined;
  isLoadingPayments: boolean;
  payingBookingId: string | null;
  isCancelPending: boolean;
  onNavigate: () => void;
  onPayNow: (id: string) => void;
  onCancel: (id: string) => void;
  labels: {
    status: Record<BookingStatus, React.ReactNode>;
    paymentStatus: Record<PaymentStatus, React.ReactNode>;
    payNow: React.ReactNode;
    paying: React.ReactNode;
    cancel: React.ReactNode;
    cancelling: React.ReactNode;
    nightsShort: React.ReactNode;
  };
}

function BookingCard({
  booking,
  property,
  isPropertyLoading,
  locale,
  payment,
  isLoadingPayments,
  payingBookingId,
  isCancelPending,
  onNavigate,
  onPayNow,
  onCancel,
  labels,
}: BookingCardProps) {
  const status = booking.status as BookingStatus;
  const isPending = status === "pending";
  const needsPayment = isPending && !isLoadingPayments && !payment;
  const nights = nightCount(booking.start_date, booking.end_date);

  const translation = property
    ? resolveTranslation(property.translations, locale)
    : null;
  const propertyName = translation?.name ?? property?.city ?? null;
  const thumbnailUrl =
    property?.images.find((i) => i.is_thumbnail)?.url ??
    property?.images[0]?.url ??
    null;

  return (
    <div
      className={cn(
        "cursor-pointer rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        needsPayment &&
          "ring-1 ring-amber-300/60 dark:ring-amber-700/60",
      )}
      onClick={onNavigate}
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="shrink-0">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={propertyName ?? ""}
              className="h-[72px] w-[72px] rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-xl bg-muted">
              <Building2 className="size-7 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name + status + chevron */}
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <div className="min-w-0">
              {isPropertyLoading && !propertyName ? (
                <>
                  <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                  <div className="mt-1 h-3.5 w-20 animate-pulse rounded bg-muted" />
                </>
              ) : (
                <>
                  <p className="truncate font-semibold leading-tight text-foreground">
                    {propertyName ?? booking.property_id.slice(0, 8) + "…"}
                  </p>
                  {property?.city && (
                    <p className="text-sm text-muted-foreground">
                      {property.city}
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                  STATUS_COLOR[status],
                )}
              >
                {labels.status[status]}
              </span>
              <ChevronRight className="size-4 text-muted-foreground/40" />
            </div>
          </div>

          {/* Dates + nights */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="size-3.5 shrink-0" />
            <span className="tabular-nums">
              {formatDate(booking.start_date)} – {formatDate(booking.end_date)}
            </span>
            <span className="text-xs">
              · {nights}{labels.nightsShort}
            </span>
          </div>

          {/* Price + payment badge */}
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold tabular-nums">
              {Number(booking.total_price).toFixed(2)}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                {booking.currency}
              </span>
            </span>
            {payment && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                  PAYMENT_COLOR[payment.status],
                  payment.status === "pending" && "animate-pulse",
                )}
              >
                <CreditCard className="size-2.5" />
                {labels.paymentStatus[payment.status]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action footer */}
      {(needsPayment || isPending) && (
        <div
          className="flex gap-2 border-t px-4 py-3"
          onClick={(e) => e.stopPropagation()}
        >
          {needsPayment && (
            <Button
              size="sm"
              className="flex-1 rounded-lg"
              disabled={payingBookingId === booking.id}
              onClick={() => onPayNow(booking.id)}
            >
              {payingBookingId === booking.id ? labels.paying : labels.payNow}
            </Button>
          )}
          {isPending && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isCancelPending}
              onClick={() => onCancel(booking.id)}
            >
              {isCancelPending ? labels.cancelling : labels.cancel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function MyBookings() {
  const c = useIntlayer("my-bookings");
  const navigate = useNavigate();
  const { locale } = useParams({ strict: false }) as { locale?: string };
  const { data: bookings, isLoading } = useMyBookings();
  const { data: payments = [], isLoading: isLoadingPayments } = useMyPayments();
  const cancelBooking = useCancelBooking();
  const createCheckout = useCreateCheckout(locale);
  const abandonPayment = useAbandonPayment();
  const queryClient = useQueryClient();
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  const propertyIds = bookings?.map((b) => b.property_id) ?? [];
  const { propertiesById, isLoading: isLoadingProperties } =
    usePropertiesForBookings(propertyIds, locale);

  const paymentByBooking = new Map(payments.map((p) => [p.booking_id, p]));

  const hasPendingPayments = payments.some((p) => p.status === "pending");
  const prevHadPendingRef = useRef(false);
  useEffect(() => {
    if (prevHadPendingRef.current && !hasPendingPayments) {
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
    }
    prevHadPendingRef.current = hasPendingPayments;
  }, [hasPendingPayments]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const result = params.get("payment");
    if (!result) return;

    if (result === "success") {
      toast.success(c.toasts.paymentSuccess.value as string);
      sessionStorage.removeItem("pending_payment_id");
    } else if (result === "cancelled") {
      toast.warning(c.toasts.paymentCancelled.value as string);
      const pendingPaymentId = sessionStorage.getItem("pending_payment_id");
      if (pendingPaymentId) {
        sessionStorage.removeItem("pending_payment_id");
        abandonPayment.mutate(pendingPaymentId);
      }
    }

    params.delete("payment");
    const newSearch = params.toString();
    history.replaceState(
      null,
      "",
      window.location.pathname + (newSearch ? `?${newSearch}` : ""),
    );
  }, []);

  const handlePayNow = async (bookingId: string) => {
    setPayingBookingId(bookingId);
    try {
      const { checkout_url, payment_id } =
        await createCheckout.mutateAsync(bookingId);
      if (!checkout_url.startsWith("https://checkout.stripe.com/")) {
        throw new Error("Unexpected checkout URL");
      }
      sessionStorage.setItem("pending_payment_id", payment_id);
      window.location.href = checkout_url;
    } catch (err: unknown) {
      console.error("[checkout]", err);
      toast.error(c.toasts.paymentCancelled.value as string);
    } finally {
      setPayingBookingId(null);
    }
  };

  const cardLabels = {
    status: c.status as unknown as Record<BookingStatus, React.ReactNode>,
    paymentStatus: c.paymentStatus as unknown as Record<
      PaymentStatus,
      React.ReactNode
    >,
    payNow: c.payNow,
    paying: c.paying,
    cancel: c.cancel,
    cancelling: c.cancelling,
    nightsShort: c.details.nightsShort,
  };

  const upcoming =
    bookings?.filter((b) =>
      UPCOMING_STATUSES.has(b.status as BookingStatus),
    ) ?? [];
  const past =
    bookings?.filter((b) => PAST_STATUSES.has(b.status as BookingStatus)) ?? [];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-2xl font-bold tracking-tight text-foreground">
          {c.title}
        </h1>

        {isLoading ? (
          <div className="space-y-3">
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
          </div>
        ) : !bookings?.length ? (
          <div className="space-y-4 rounded-2xl border bg-card p-12 text-center shadow-sm">
            <CalendarSearch className="mx-auto size-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">{c.empty}</p>
            <Button
              variant="outline"
              onClick={() =>
                navigate({ to: "/{-$locale}/properties" as any } as any)
              }
            >
              {c.browseProperties}
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {upcoming.length > 0 && (
              <section>
                <SectionHeader title={c.upcoming} count={upcoming.length} />
                <div className="space-y-3">
                  {upcoming.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      property={propertiesById.get(booking.property_id) ?? null}
                      isPropertyLoading={isLoadingProperties}
                      locale={locale ?? "en"}
                      payment={paymentByBooking.get(booking.id)}
                      isLoadingPayments={isLoadingPayments}
                      payingBookingId={payingBookingId}
                      isCancelPending={cancelBooking.isPending}
                      onNavigate={() =>
                        navigate({
                          to: `/${locale ?? "en"}/bookings/${booking.id}` as any,
                        })
                      }
                      onPayNow={handlePayNow}
                      onCancel={(id) => cancelBooking.mutate(id)}
                      labels={cardLabels}
                    />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <SectionHeader title={c.past} count={past.length} />
                <div className="space-y-3 opacity-75">
                  {past.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      property={propertiesById.get(booking.property_id) ?? null}
                      isPropertyLoading={isLoadingProperties}
                      locale={locale ?? "en"}
                      payment={paymentByBooking.get(booking.id)}
                      isLoadingPayments={isLoadingPayments}
                      payingBookingId={payingBookingId}
                      isCancelPending={cancelBooking.isPending}
                      onNavigate={() =>
                        navigate({
                          to: `/${locale ?? "en"}/bookings/${booking.id}` as any,
                        })
                      }
                      onPayNow={handlePayNow}
                      onCancel={(id) => cancelBooking.mutate(id)}
                      labels={cardLabels}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
