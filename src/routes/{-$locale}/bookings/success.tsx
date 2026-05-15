import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { BookingSuccess } from "@/features/Bookings/components/booking-success";

const searchSchema = z.object({
  session_id: z.string().optional(),
});

export const Route = createFileRoute("/{-$locale}/bookings/success")({
  validateSearch: searchSchema,
  component: function BookingSuccessPage() {
    const { session_id } = Route.useSearch();
    const { locale } = Route.useParams();
    return <BookingSuccess sessionId={session_id} locale={locale ?? "en"} />;
  },
});
