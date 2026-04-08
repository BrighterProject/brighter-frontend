import { useIntlayer } from "react-intlayer";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Calendar,
  CreditCard,
  FileText,
  Hash,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  BookingResponse,
  BookingStatus,
  PaymentResponse,
  PaymentStatus,
} from "../api/types";

const STATUS_GRADIENT: Record<BookingStatus, string> = {
  pending: "from-amber-400 to-yellow-300",
  confirmed: "from-emerald-500 to-green-400",
  completed: "from-slate-500 to-slate-400",
  cancelled: "from-red-400 to-rose-300",
  no_show: "from-orange-400 to-amber-300",
};

const STATUS_TEXT: Record<BookingStatus, string> = {
  pending: "text-amber-900",
  confirmed: "text-emerald-900",
  completed: "text-slate-900",
  cancelled: "text-red-900",
  no_show: "text-orange-900",
};

const PAYMENT_COLOR: Record<PaymentStatus, string> = {
  pending: "text-orange-600 border-orange-200 bg-orange-50",
  paid: "text-emerald-700 border-emerald-300 bg-emerald-50",
  refunded: "text-blue-600 border-blue-200 bg-blue-50",
  failed: "text-red-600 border-red-200 bg-red-50",
};

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm">{children}</span>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b px-6 py-4 last:border-0">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-3.5 text-muted-foreground" />
        <span className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}

interface BookingDetailsSheetProps {
  booking: BookingResponse | null;
  payment: PaymentResponse | undefined;
  locale?: string;
  payingBookingId: string | null;
  isCancelPending: boolean;
  onClose: () => void;
  onPayNow: (id: string) => void;
  onCancel: (id: string) => void;
}

export function BookingDetailsSheet({
  booking,
  payment,
  locale,
  payingBookingId,
  isCancelPending,
  onClose,
  onPayNow,
  onCancel,
}: BookingDetailsSheetProps) {
  const c = useIntlayer("my-bookings");

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const durationNights = booking
    ? Math.round(
        (new Date(booking.end_date).getTime() -
          new Date(booking.start_date).getTime()) /
          86_400_000,
      )
    : 0;

  const status = booking?.status as BookingStatus | undefined;
  const isPending = status === "pending";
  const needsPayment = isPending && !payment;
  const propertyHref = `/${locale ? `${locale}/` : ""}properties/${booking?.property_id}`;

  return (
    <AnimatePresence>
      {booking && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet panel */}
          <motion.div
            key="sheet"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-card shadow-2xl sm:max-w-md"
          >
            {/* Status header */}
            <div
              className={cn(
                "relative shrink-0 bg-gradient-to-br px-6 pb-8 pt-6",
                status
                  ? STATUS_GRADIENT[status]
                  : "from-slate-400 to-slate-300",
              )}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-black/10 p-1.5 transition-colors hover:bg-black/20"
              >
                <X className="size-4 text-white" />
              </button>

              <p
                className={cn(
                  "mb-1 font-display text-xs font-bold uppercase tracking-widest opacity-70",
                  status ? STATUS_TEXT[status] : "text-slate-900",
                )}
              >
                {c.details.title}
              </p>

              <div className="mb-3 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block rounded-full bg-white/30 px-3 py-1 text-sm font-bold backdrop-blur-sm",
                    status ? STATUS_TEXT[status] : "text-slate-900",
                  )}
                >
                  {status ? c.status[status] : "—"}
                </span>
                {payment && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border bg-white/50 px-2.5 py-1 text-xs font-semibold",
                      PAYMENT_COLOR[payment.status],
                      payment.status === "pending" && "animate-pulse",
                    )}
                  >
                    <CreditCard className="size-2.5" />
                    {c.paymentStatus[payment.status]}
                  </span>
                )}
              </div>

              {booking && (
                <div
                  className={cn(
                    "space-y-0.5",
                    status ? STATUS_TEXT[status] : "text-slate-900",
                  )}
                >
                  <p className="text-xl font-bold leading-tight">
                    {fmtDate(booking.start_date)}
                  </p>
                  <p className="text-base font-medium opacity-80">
                    → {fmtDate(booking.end_date)}
                    <span className="ml-2 text-sm opacity-60">
                      ({durationNights}n)
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Schedule */}
              <Section
                icon={Calendar}
                title={c.details.schedule as unknown as string}
              >
                <Row label={c.details.start as unknown as string}>
                  {fmt(booking.start_date)}
                </Row>
                <Row label={c.details.end as unknown as string}>
                  {fmt(booking.end_date)}
                </Row>
                <Row label={c.details.duration as unknown as string}>
                  {durationNights} nights
                </Row>
              </Section>

              {/* Pricing */}
              <Section
                icon={CreditCard}
                title={c.details.pricing as unknown as string}
              >
                <Row label={c.details.rate as unknown as string}>
                  {Number(booking.price_per_night).toFixed(2)}{" "}
                  {booking.currency}
                  /night
                </Row>
                <Row label={c.total as unknown as string}>
                  <span className="text-base font-bold">
                    {Number(booking.total_price).toFixed(2)} {booking.currency}
                  </span>
                </Row>
              </Section>

              {/* Notes */}
              {booking.notes && (
                <Section
                  icon={FileText}
                  title={c.details.notes as unknown as string}
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {booking.notes}
                  </p>
                </Section>
              )}

              {/* References */}
              <Section
                icon={Hash}
                title={c.details.references as unknown as string}
              >
                <Row label={c.details.bookingId as unknown as string}>
                  <span className="font-mono text-xs text-muted-foreground">
                    {booking.id}
                  </span>
                </Row>
                <Row label={c.property as unknown as string}>
                  <a
                    href={propertyHref}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <span className="font-mono text-xs">
                      {booking.property_id.slice(0, 8)}…
                    </span>
                    <ExternalLink className="size-3" />
                  </a>
                </Row>
                <Row label={c.details.updatedAt as unknown as string}>
                  <span className="text-xs text-muted-foreground">
                    {fmt(booking.updated_at)}
                  </span>
                </Row>
              </Section>
            </div>

            {/* Footer actions */}
            {(needsPayment || isPending) && (
              <div className="flex shrink-0 gap-2 border-t bg-card px-6 py-4">
                {needsPayment && (
                  <Button
                    className="flex-1 rounded-xl"
                    disabled={payingBookingId === booking.id}
                    onClick={() => onPayNow(booking.id)}
                  >
                    {payingBookingId === booking.id ? c.paying : c.payNow}
                  </Button>
                )}
                {isPending && (
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={isCancelPending}
                    onClick={() => onCancel(booking.id)}
                  >
                    {isCancelPending ? c.cancelling : c.cancel}
                  </Button>
                )}
              </div>
            )}

            {!needsPayment && !isPending && (
              <div className="shrink-0 border-t bg-card px-6 py-4">
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={onClose}
                >
                  {c.details.close}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
