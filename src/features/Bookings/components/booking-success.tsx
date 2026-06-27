import { Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { usePaymentBySession } from "@/features/Bookings/api/hooks";

interface BookingSuccessProps {
  sessionId: string | undefined;
  locale: string;
}

export function BookingSuccess({ sessionId, locale }: BookingSuccessProps) {
  const c = useIntlayer("booking-success");
  const { data: payment, isLoading, isError } = usePaymentBySession(sessionId);

  const bookingsHref = `/${locale}/bookings`;

  if (!sessionId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{c.invalidLink}</p>
          <Link
            to={bookingsHref as any}
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            {c.viewBookings}
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || payment?.status === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-sm px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Clock className="size-8 animate-pulse text-primary" />
            </div>
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold tracking-tight">
            {c.pending.heading}
          </h1>
          <p className="text-sm text-muted-foreground">{c.pending.body}</p>
        </div>
      </div>
    );
  }

  if (isError || payment?.status === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-sm px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="size-8 text-destructive" />
            </div>
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold tracking-tight">
            {c.failed.heading}
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">{c.failed.body}</p>
          <Link
            to={bookingsHref as any}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            {c.viewBookings} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  if (payment?.status === "paid") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-sm px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-chart-4/10">
              <CheckCircle2 className="size-8 text-chart-4" />
            </div>
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold tracking-tight">
            {c.paid.heading}
          </h1>
          <p className="mb-2 text-sm text-muted-foreground">{c.paid.body}</p>
          {payment.amount && (
            <p className="mb-8 text-lg font-semibold text-foreground">
              {Number(payment.amount).toFixed(2)} {payment.currency}
            </p>
          )}
          <Link
            to={bookingsHref as any}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {c.viewBookings} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      {c.loading}
    </div>
  );
}
