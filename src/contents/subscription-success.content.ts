import { t, type Dictionary } from "intlayer";

const subscriptionSuccessContent = {
  key: "subscription-success",
  content: {
    meta: {
      title: t({
        en: "Subscription Confirmed | Brighter.BG",
        bg: "Абонаментът е потвърден | Brighter.BG",
      }),
    },
    activating: {
      heading: t({
        en: "Activating your account…",
        bg: "Активиране на акаунта…",
      }),
      body: t({
        en: "Your owner account is being set up. This takes just a moment.",
        bg: "Вашият акаунт на собственик се настройва. Това отнема само миг.",
      }),
    },
    ready: {
      heading: t({ en: "You're all set!", bg: "Готово!" }),
      body: t({
        en: "Your owner account is active. Start by adding your first property.",
        bg: "Вашият акаунт на собственик е активен. Започнете, като добавите първия си имот.",
      }),
      cta: t({
        en: "Add your first property",
        bg: "Добавете първия си имот",
      }),
    },
    timeout: {
      heading: t({
        en: "Taking longer than expected",
        bg: "Отнема по-дълго от очакваното",
      }),
      body: t({
        en: "Check your email for a confirmation, or contact support if you need help.",
        bg: "Проверете имейла си за потвърждение или се свържете с поддръжката.",
      }),
    },
  },
} satisfies Dictionary;

export default subscriptionSuccessContent;
