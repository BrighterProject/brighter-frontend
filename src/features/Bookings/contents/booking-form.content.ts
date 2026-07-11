import { t, type Dictionary } from "intlayer";

const bookingFormContent = {
  key: "booking-form",
  content: {
    meta: {
      title: t({
        en: "Book Property | SeasideHoliday",
        bg: "Резервирай имот | Почивка на морето",
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
      stayDetails: t({ en: "Stay details", bg: "Детайли за престоя" }),
      paymentMethod: t({ en: "Payment method", bg: "Метод на плащане" }),
    },
    payment: {
      card: t({ en: "Credit / Debit Card", bg: "Кредитна / дебитна карта" }),
      cardFee: t({
        en: "Online payment via Stripe (1.5% + €0.25 processing fee)",
        bg: "Онлайн плащане чрез Stripe (такса 1.5% + €0.25)",
      }),
      bankTransfer: t({ en: "Bank Transfer", bg: "Банков превод" }),
      bankTransferNote: t({
        en: "Transfer to our bank account. Booking confirmed after receipt.",
        bg: "Превод по банкова сметка. Резервацията се потвърждава след получаване.",
      }),
      cash: t({ en: "Cash (on arrival)", bg: "Брой (при пристигане)" }),
      cashNote: t({
        en: "Pay cash directly at the property on arrival.",
        bg: "Платете на място при пристигане.",
      }),
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
      country: {
        label: t({ en: "Country / Region", bg: "Държава / Регион" }),
        placeholder: t({ en: "Select country", bg: "Изберете държава" }),
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
      phoneRequired: t({
        en: "Phone number is required.",
        bg: "Телефонният номер е задължителен.",
      }),
      phoneInvalid: t({
        en: "Please enter a valid phone number.",
        bg: "Моля въведете валиден телефонен номер.",
      }),
      countryRequired: t({
        en: "Please select a country.",
        bg: "Моля изберете държава.",
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
      guests: t({ en: "Guests", bg: "Гости" }),
      adult: t({ en: "adult", bg: "възрастен" }),
      adults: t({ en: "adults", bg: "възрастни" }),
      child: t({ en: "child", bg: "дете" }),
      children: t({ en: "children", bg: "деца" }),
    },
    summary: {
      perNight: t({ en: "/ night", bg: "/ нощ" }),
      total: t({ en: "Total", bg: "Общо" }),
      minLabel: t({ en: "Min", bg: "Мин" }),
      maxLabel: t({ en: "Max", bg: "Макс" }),
    },
    submit: {
      idle: t({ en: "Confirm & Pay", bg: "Потвърди и плати" }),
      idleCard: t({
        en: "Confirm & Pay by Card",
        bg: "Потвърди и плати с карта",
      }),
      idleBankTransfer: t({
        en: "Confirm & Get Bank Details",
        bg: "Потвърди и виж банкова информация",
      }),
      idleCash: t({
        en: "Confirm & Pay on Arrival",
        bg: "Потвърди и плати при пристигане",
      }),
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
    cancellation: {
      title: t({
        en: "Cancellation policy",
        bg: "Политика за отказ",
        ru: "Политика отмены",
      }),
      free: t({
        en: "Free cancellation: full refund up to 24 hours before check-in.",
        bg: "Безплатен отказ: пълно връщане до 24 часа преди настаняване.",
        ru: "Бесплатная отмена: полный возврат до 24 часов до заезда.",
      }),
      moderate: t({
        en: "Moderate: full refund up to 5 days before check-in; 50% afterwards.",
        bg: "Умерена: пълно връщане до 5 дни преди настаняване; 50% след това.",
        ru: "Умеренная: полный возврат до 5 дней до заезда; 50% после.",
      }),
      strict: t({
        en: "Strict: 50% refund up to 7 days before check-in; no refund afterwards.",
        bg: "Строга: 50% връщане до 7 дни преди настаняване; без връщане след това.",
        ru: "Строгая: 50% возврат до 7 дней до заезда; без возврата после.",
      }),
    },
  },
} satisfies Dictionary;

export default bookingFormContent;
