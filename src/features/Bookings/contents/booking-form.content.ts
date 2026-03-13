import { t, type Dictionary } from "intlayer";

const bookingFormContent = {
  key: "booking-form",
  content: {
    meta: {
      title: t({
        en: "Book Property | Brighter.BG",
        bg: "Резервирай база | Brighter.BG",
      }),
      description: t({
        en: "Book your slot at this property.",
        bg: "Резервирайте своя час в тази база.",
      }),
    },
    back: t({ en: "Back to property", bg: "Към базата" }),
    title: t({ en: "Book", bg: "Резервирай" }),
    grid: {
      instruction: t({
        en: "Click a slot to start, click another to set the end",
        bg: "Кликни за начало, кликни отново за края",
      }),
      prev: t({ en: "← Prev", bg: "← Назад" }),
      next: t({ en: "Next →", bg: "Напред →" }),
      legend: {
        available: t({ en: "Available", bg: "Свободно" }),
        closed: t({ en: "Closed", bg: "Затворено" }),
        unavailable: t({ en: "Unavailable", bg: "Недостъпно" }),
        mine: t({ en: "My booking", bg: "Моя резервация" }),
        booked: t({ en: "Booked", bg: "Заето" }),
        selected: t({ en: "Selected", bg: "Избрано" }),
      },
    },
    sections: {
      notes: t({ en: "Notes (optional)", bg: "Бележки (незадължително)" }),
    },
    labels: {
      hours: t({ en: "h", bg: "ч" }),
    },
    errors: {
      minDuration: t({
        en: "Minimum booking duration is 1 hour.",
        bg: "Минималната продължителност е 1 час.",
      }),
      selectSlot: t({
        en: "Please select a time slot on the grid.",
        bg: "Моля изберете час от таблицата.",
      }),
      conflict: t({
        en: "This slot is no longer available. Please choose another time.",
        bg: "Този час вече не е свободен. Моля изберете друг.",
      }),
      generic: t({
        en: "Something went wrong. Please try again.",
        bg: "Нещо се обърка. Моля опитайте отново.",
      }),
      checkoutFailed: t({
        en: "Booking created, but payment setup failed. Pay from My Bookings.",
        bg: "Резервацията е направена, но плащането не успя. Платете от Моите резервации.",
      }),
    },
    summary: {
      perHour: t({ en: "/ hr", bg: "/ час" }),
      total: t({ en: "Total", bg: "Общо" }),
      noTime: t({
        en: "Select a slot on the grid",
        bg: "Изберете час от таблицата",
      }),
    },
    submit: {
      idle: t({ en: "Confirm & Pay", bg: "Потвърди и плати" }),
      submitting: t({ en: "Booking...", bg: "Резервиране..." }),
      redirecting: t({
        en: "Redirecting to payment...",
        bg: "Пренасочване към плащане...",
      }),
    },
    notesPlaceholder: t({
      en: "Any special requests...",
      bg: "Специални изисквания...",
    }),
  },
} satisfies Dictionary;

export default bookingFormContent;
