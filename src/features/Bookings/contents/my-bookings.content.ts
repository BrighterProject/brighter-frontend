import { t, type Dictionary } from "intlayer";

const myBookingsContent = {
  key: "my-bookings",
  content: {
    meta: {
      title: t({
        en: "My Bookings | Brighter.BG",
        bg: "Моите резервации | Brighter.BG",
      }),
      description: t({
        en: "View and manage your property bookings.",
        bg: "Преглед и управление на вашите резервации.",
      }),
    },
    title: t({ en: "My Bookings", bg: "Моите резервации" }),
    empty: t({
      en: "No bookings yet. Browse properties to get started.",
      bg: "Нямате резервации. Разгледайте имотите, за да започнете.",
    }),
    browseProperties: t({ en: "Browse properties", bg: "Разгледайте имоти" }),
    cancel: t({ en: "Cancel", bg: "Откажи" }),
    cancelling: t({ en: "Cancelling...", bg: "Отказване..." }),
    payNow: t({ en: "Pay Now", bg: "Плати" }),
    paying: t({ en: "Loading...", bg: "Зарежда..." }),
    property: t({ en: "Property", bg: "Имот" }),
    total: t({ en: "Total", bg: "Общо" }),
    toasts: {
      paymentSuccess: t({
        en: "Payment successful! Your booking will be confirmed shortly.",
        bg: "Плащането е успешно! Резервацията ви ще бъде потвърдена скоро.",
      }),
      paymentCancelled: t({
        en: "Payment cancelled. Your booking has been released \u2014 please rebook.",
        bg: "Плащането е отказано. Резервацията ви е освободена \u2014 моля резервирайте отново.",
      }),
    },
    paymentStatus: {
      pending: t({ en: "Awaiting payment", bg: "Очаква плащане" }),
      paid: t({ en: "Paid", bg: "Платено" }),
      refunded: t({ en: "Refunded", bg: "Възстановено" }),
      failed: t({ en: "Payment failed", bg: "Неуспешно плащане" }),
    },
    status: {
      pending: t({ en: "Pending", bg: "Изчаква" }),
      confirmed: t({ en: "Confirmed", bg: "Потвърдена" }),
      completed: t({ en: "Completed", bg: "Завършена" }),
      cancelled: t({ en: "Cancelled", bg: "Отказана" }),
      no_show: t({ en: "No show", bg: "Не се явил" }),
    },
    details: {
      title: t({ en: "Booking Details", bg: "Детайли за резервацията" }),
      schedule: t({ en: "Schedule", bg: "График" }),
      start: t({ en: "Start", bg: "Начало" }),
      end: t({ en: "End", bg: "Край" }),
      duration: t({ en: "Duration", bg: "Продължителност" }),
      pricing: t({ en: "Pricing", bg: "Цена" }),
      rate: t({ en: "Rate", bg: "Тарифа" }),
      payment: t({ en: "Payment", bg: "Плащане" }),
      notes: t({ en: "Notes", bg: "Бележки" }),
      references: t({ en: "References", bg: "Референции" }),
      bookingId: t({ en: "Booking ID", bg: "ID на резервация" }),
      viewProperty: t({ en: "View property \u2192", bg: "Вижте имота \u2192" }),
      close: t({ en: "Close", bg: "Затвори" }),
      updatedAt: t({ en: "Last updated", bg: "Последна промяна" }),
    },
  },
} satisfies Dictionary;

export default myBookingsContent;
