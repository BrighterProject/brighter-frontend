import { t, type Dictionary } from "intlayer";

const bookingDetailContent = {
  key: "booking-detail",
  content: {
    meta: {
      title: t({
        en: "Booking Details | SeasideHoliday",
        bg: "Детайли за резервация | Почивка на морето",
      }),
    },
    backToBookings: t({ en: "My Bookings", bg: "Моите резервации" }),
    checkIn: t({ en: "Check-in", bg: "Настаняване" }),
    checkOut: t({ en: "Check-out", bg: "Напускане" }),
    nights: t({ en: "nights", bg: "нощи" }),
    schedule: t({ en: "Schedule", bg: "График" }),
    pricing: t({ en: "Pricing", bg: "Цена" }),
    rate: t({ en: "Rate", bg: "Тарифа" }),
    perNight: t({ en: "/ night", bg: "/ нощ" }),
    shortStayPremium: t({
      en: "Short stay premium",
      bg: "Малка пролука",
    }),
    included: t({ en: "included", bg: "включено" }),
    total: t({ en: "Total", bg: "Общо" }),
    payment: t({ en: "Payment", bg: "Плащане" }),
    references: t({ en: "References", bg: "Референции" }),
    bookingId: t({ en: "Booking ID", bg: "ID на резервация" }),
    viewProperty: t({ en: "View property", bg: "Вижте имота" }),
    payNow: t({ en: "Pay Now", bg: "Плати" }),
    paying: t({ en: "Loading...", bg: "Зарежда..." }),
    cancel: t({ en: "Cancel booking", bg: "Откажи резервацията" }),
    cancelling: t({ en: "Cancelling...", bg: "Отказване..." }),
    notFound: t({
      en: "Booking not found.",
      bg: "Резервацията не е намерена.",
    }),
    status: {
      pending: t({ en: "Pending", bg: "Изчаква" }),
      confirmed: t({ en: "Confirmed", bg: "Потвърдена" }),
      completed: t({ en: "Completed", bg: "Завършена" }),
      cancelled: t({ en: "Cancelled", bg: "Отказана" }),
      no_show: t({ en: "No show", bg: "Не се явил" }),
    },
    paymentStatus: {
      pending: t({ en: "Awaiting payment", bg: "Очаква плащане" }),
      paid: t({ en: "Paid", bg: "Платено" }),
      refunded: t({ en: "Refunded", bg: "Възстановено" }),
      failed: t({ en: "Payment failed", bg: "Неуспешно плащане" }),
    },
    toasts: {
      paymentError: t({
        en: "Could not start payment. Please try again.",
        bg: "Грешка при плащане. Моля опитайте отново.",
      }),
      cancelError: t({
        en: "Could not cancel booking.",
        bg: "Грешка при отказване.",
      }),
    },
  },
} satisfies Dictionary;

export default bookingDetailContent;
