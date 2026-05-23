import { t, type Dictionary } from "intlayer";

const bankTransferInstructionsContent = {
  key: "bank-transfer-instructions",
  content: {
    loading: t({ en: "Loading…", bg: "Зарежда…" }),
    error: t({
      en: "Could not load payment details.",
      bg: "Неуспешно зареждане на данните за плащане.",
    }),
    heading: t({
      en: "Bank Transfer Instructions",
      bg: "Инструкции за банков превод",
    }),
    body: t({
      en: "Your booking is reserved. Please transfer the amount below within 48 hours to confirm it. Always include the reference number.",
      bg: "Резервацията ви е запазена. Моля, преведете сумата по-долу в рамките на 48 часа, за да я потвърдите. Винаги включвайте референтния номер.",
    }),
    within48h: t({ en: "48 hours", bg: "48 часа" }),
    labels: {
      bank: t({ en: "Bank", bg: "Банка" }),
      accountHolder: t({ en: "Account holder", bg: "Титуляр" }),
      iban: t({ en: "IBAN", bg: "IBAN" }),
      bic: t({ en: "BIC / SWIFT", bg: "BIC / SWIFT" }),
      reference: t({ en: "Reference", bg: "Референция" }),
      amount: t({ en: "Amount", bg: "Сума" }),
    },
    footer: t({
      en: "Your booking will be confirmed once the property owner verifies receipt. You will be notified by email.",
      bg: "Резервацията ви ще бъде потвърдена, след като собственикът потвърди получаването. Ще бъдете уведомени по имейл.",
    }),
    viewBookings: t({ en: "View my bookings →", bg: "Моите резервации →" }),
  },
} satisfies Dictionary;

export default bankTransferInstructionsContent;
