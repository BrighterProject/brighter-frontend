import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { BookingDetail } from "@/features/Bookings/components/booking-detail";

export const Route = createFileRoute("/{-$locale}/bookings/$bookingId")({
  component: function BookingDetailPage() {
    const { bookingId, locale } = Route.useParams();
    return <BookingDetail bookingId={bookingId} locale={locale ?? "en"} />;
  },
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("booking-detail", locale).meta;
    return {
      meta: [
        { title: meta.title },
      ],
    };
  },
});
