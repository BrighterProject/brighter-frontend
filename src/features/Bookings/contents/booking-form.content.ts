import { t, type Dictionary } from "intlayer";

const bookingFormContent = {
  key: "booking-form",
  content: {
    meta: {
      title: t({
        en: "Book Property | Brighter.BG",
        bg: "Резервирай имот | Brighter.BG",
      }),
      description: t({
        en: "Book your stay at this property.",
        bg: "Резервирайте престоя си в този имот.",
      }),
    },
    back: t({ en: "Back to property", bg: "Към имота" }),
    title: t({ en: "Book", bg: "Резервирай" }),
    calendar: {
      dayHeaders: t({ en: "Mo_Tu_We_Th_Fr_Sa_Su", bg: "Пн_Вт_Ср_Чт_Пт_Сб_Нд" }),
      instruction: t({
        en: "Select check-in, then check-out",
        bg: "Изберете настаняване, после напускане",
      }),
    },
    labels: {
      checkIn: t({ en: "Check-in", bg: "Настаняване" }),
      checkOut: t({ en: "Check-out", bg: "Напускане" }),
      nights: t({ en: "nights", bg: "нощ." }),
    },
    legend: {
      range: t({ en: "Selected range", bg: "Избран период" }),
      mine: t({ en: "My booking", bg: "Моя резервация" }),
      booked: t({ en: "Booked", bg: "Заето" }),
      unavailable: t({ en: "Unavailable", bg: "Недостъпно" }),
    },
    sections: {
      notes: t({ en: "Notes (optional)", bg: "Бележки (незадължително)" }),
    },
    errors: {
      selectDates: t({
        en: "Please select check-in and check-out dates.",
        bg: "Моля изберете дати за настаняване и напускане.",
      }),
      minNights: t({ en: "Minimum stay:", bg: "Минимален престой:" }),
      maxNights: t({ en: "Maximum stay:", bg: "Максимален престой:" }),
      blockedInRange: t({
        en: "The selected range includes unavailable dates. Please choose different dates.",
        bg: "Избраният период включва недостъпни дати. Моля изберете други.",
      }),
      conflict: t({
        en: "These dates are no longer available. Please choose different dates.",
        bg: "Тези дати вече не са свободни. Моля изберете други.",
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
      perNight: t({ en: "/ night", bg: "/ нощ" }),
      total: t({ en: "Total", bg: "Общо" }),
      noDates: t({
        en: "Select check-in and check-out dates",
        bg: "Изберете дати за настаняване и напускане",
      }),
      selectCheckout: t({
        en: "Check-in selected — now pick check-out",
        bg: "Настаняването е избрано — изберете напускане",
      }),
      minLabel: t({ en: "Min", bg: "Мин" }),
      maxLabel: t({ en: "Max", bg: "Макс" }),
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
