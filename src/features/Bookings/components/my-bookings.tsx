import { useEffect, useRef, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Calendar, CreditCard, CalendarSearch } from "lucide-react";
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
import type {
  BookingResponse,
  BookingStatus,
  PaymentStatus,
} from "../api/types";
import { BookingDetailsSheet } from "./booking-details-sheet";

const STATUS_COLOR: Record<BookingStatus, string> = {
  pending:
    "text-yellow-600 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-950/30",
  confirmed:
    "text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/30",
  completed:
    "text-muted-foreground border-border bg-muted",
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
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
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponse | null>(null);

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
    } catch (err: any) {
      console.error("[checkout]", err?.response?.data?.detail ?? err);
      toast.error(c.toasts.paymentCancelled.value as string);
    } finally {
      setPayingBookingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">{c.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground">
          {c.title}
        </h1>

        {!bookings?.length ? (
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
          <div className="space-y-3">
            {bookings.map((booking) => {
              const start = formatDate(booking.start_date);
              const end = formatDate(booking.end_date);
              const status = booking.status as BookingStatus;
              const isPending = status === "pending";
              const payment = paymentByBooking.get(booking.id);
              const needsPayment = isPending && !isLoadingPayments && !payment;

              return (
                <div
                  key={booking.id}
                  className="cursor-pointer rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {c.property}: {booking.property_id.slice(0, 8)}…
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                            STATUS_COLOR[status],
                          )}
                        >
                          {c.status[status]}
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
                            {c.paymentStatus[payment.status]}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span>{start} – {end}</span>
                      </div>

                      <p className="text-sm font-semibold text-foreground">
                        {Number(booking.total_price).toFixed(2)}{" "}
                        {booking.currency}
                      </p>
                    </div>

                    <div
                      className="flex shrink-0 flex-col gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {needsPayment && (
                        <Button
                          variant="default"
                          size="sm"
                          className="rounded-lg"
                          disabled={payingBookingId === booking.id}
                          onClick={() => handlePayNow(booking.id)}
                        >
                          {payingBookingId === booking.id ? c.paying : c.payNow}
                        </Button>
                      )}
                      {isPending && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          disabled={cancelBooking.isPending}
                          onClick={() => cancelBooking.mutate(booking.id)}
                        >
                          {cancelBooking.isPending ? c.cancelling : c.cancel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BookingDetailsSheet
        booking={selectedBooking}
        payment={
          selectedBooking ? paymentByBooking.get(selectedBooking.id) : undefined
        }
        locale={locale}
        payingBookingId={payingBookingId}
        isCancelPending={cancelBooking.isPending}
        onClose={() => setSelectedBooking(null)}
        onPayNow={(id) => {
          setSelectedBooking(null);
          handlePayNow(id);
        }}
        onCancel={(id) => {
          setSelectedBooking(null);
          cancelBooking.mutate(id);
        }}
      />
    </div>
  );
}
