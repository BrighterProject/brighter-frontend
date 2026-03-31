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
    sections: {
      guestInfo: t({ en: "Guest information", bg: "Информация за госта" }),
      notes: t({ en: "Notes (optional)", bg: "Бележки (незадължително)" }),
    },
    form: {
      fullName: {
        label: t({ en: "Full name", bg: "Пълно име" }),
        placeholder: t({ en: "Jane Doe", bg: "Иван Иванов" }),
      },
      email: {
        label: t({ en: "Email address", bg: "Имейл адрес" }),
        placeholder: t({ en: "jane@example.com", bg: "ivan@example.com" }),
      },
      phone: {
        label: t({ en: "Phone number", bg: "Телефонен номер" }),
        placeholder: t({ en: "+1 555 000 0000", bg: "+359 88 000 0000" }),
      },
      specialRequests: {
        label: t({ en: "Special requests", bg: "Специални изисквания" }),
        placeholder: t({
          en: "Early check-in, baby cot, allergies...",
          bg: "Ранно настаняване, бебешко легло, алергии...",
        }),
      },
    },
    errors: {
      noDates: t({
        en: "No dates selected. Please go back and choose your dates.",
        bg: "Не са избрани дати. Моля върнете се и изберете дати.",
      }),
      fullNameRequired: t({
        en: "Full name is required.",
        bg: "Пълното име е задължително.",
      }),
      emailInvalid: t({
        en: "Please enter a valid email address.",
        bg: "Моля въведете валиден имейл адрес.",
      }),
      phoneInvalid: t({
        en: "Please enter a valid phone number.",
        bg: "Моля въведете валиден телефонен номер.",
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
    labels: {
      checkIn: t({ en: "Check-in", bg: "Настаняване" }),
      checkOut: t({ en: "Check-out", bg: "Напускане" }),
      nights: t({ en: "nights", bg: "нощ." }),
    },
    summary: {
      perNight: t({ en: "/ night", bg: "/ нощ" }),
      total: t({ en: "Total", bg: "Общо" }),
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
      en: "Any additional notes...",
      bg: "Допълнителни бележки...",
    }),
  },
} satisfies Dictionary;

export default bookingFormContent;
