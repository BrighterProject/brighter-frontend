import { t, type Dictionary } from "intlayer";

const bookingCancelContent = {
  key: "booking-cancel",
  content: {
    heading: t({
      en: "Payment cancelled",
      bg: "Плащането е отменено",
    }),
    body: t({
      en: "You cancelled the payment. Your reservation has been released — no charge was made.",
      bg: "Отменихте плащането. Резервацията ви е освободена — не е направено никакво плащане.",
    }),
    browseProperties: t({
      en: "Browse properties",
      bg: "Разгледайте имоти",
    }),
    myBookings: t({
      en: "My bookings",
      bg: "Моите резервации",
    }),
  },
} satisfies Dictionary;

export default bookingCancelContent;
