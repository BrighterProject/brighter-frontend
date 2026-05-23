import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { XCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { useAbandonPayment } from "@/features/Bookings/api/hooks";

export const Route = createFileRoute("/{-$locale}/bookings/cancel")({
  component: BookingCancelPage,
});

function BookingCancelPage() {
  const { locale } = Route.useParams();
  const abandonPayment = useAbandonPayment();
  const didAbandon = useRef(false);
  const c = useIntlayer("booking-cancel");

  // Expire the pending Checkout Session so the booking is cleaned up.
  // Runs once — guarded by ref to survive React StrictMode double-invocation.
  useEffect(() => {
    if (didAbandon.current) return;
    const paymentId = sessionStorage.getItem("pending_payment_id");
    if (!paymentId) return;
    didAbandon.current = true;
    sessionStorage.removeItem("pending_payment_id");
    abandonPayment.mutate(paymentId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const bookingsHref = `/${locale ?? "en"}/bookings`;
  const propertiesHref = `/${locale ?? "en"}/properties`;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-sm px-4 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <XCircle className="size-8 text-muted-foreground" />
          </div>
        </div>

        <h1 className="mb-2 font-display text-2xl font-bold tracking-tight">
          {c.heading}
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">{c.body}</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={propertiesHref as any}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="size-3.5" />
            {c.browseProperties}
          </Link>
          <Link
            to={bookingsHref as any}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            {c.myBookings} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
