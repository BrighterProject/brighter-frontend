import { t, type Dictionary } from "intlayer";

const bookingSuccessContent = {
  key: "booking-success",
  content: {
    invalidLink: t({
      en: "Invalid payment link.",
      bg: "Невалиден линк за плащане.",
    }),
    viewBookings: t({ en: "View my bookings →", bg: "Моите резервации →" }),
    pending: {
      heading: t({
        en: "Confirming your payment…",
        bg: "Потвърждаване на плащането…",
      }),
      body: t({
        en: "We're waiting for confirmation from Stripe. This usually takes a few seconds.",
        bg: "Изчакваме потвърждение от Stripe. Обикновено отнема няколко секунди.",
      }),
    },
    failed: {
      heading: t({ en: "Payment failed", bg: "Неуспешно плащане" }),
      body: t({
        en: "Your payment could not be processed. Your reservation has been released — please try booking again.",
        bg: "Плащането ви не можа да бъде обработено. Резервацията ви е освободена — моля опитайте отново.",
      }),
    },
    paid: {
      heading: t({ en: "Payment confirmed!", bg: "Плащането е потвърдено!" }),
      body: t({
        en: "Your booking is confirmed. A receipt has been sent to your email.",
        bg: "Резервацията ви е потвърдена. Разписка беше изпратена на имейла ви.",
      }),
    },
    loading: t({ en: "Loading…", bg: "Зарежда…" }),
  },
} satisfies Dictionary;

export default bookingSuccessContent;
