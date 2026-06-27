import { t, type Dictionary } from "intlayer";

const headerContent = {
  key: "header",
  content: {
    brand: t({
      en: "SeasideHoliday",
      bg: "Почивка на морето",
    }),
    signIn: t({ en: "Sign in", bg: "Вход" }),
    createAccount: t({ en: "Create account", bg: "Регистрация" }),
    pricing: t({ en: "Pricing", bg: "Планове" }),
    aria: {
      nav: t({ en: "Primary", bg: "Основна навигация" }),
      toggle: t({ en: "Toggle menu", bg: "Превключване на менюто" }),
      help: t({ en: "Help", bg: "Помощ" }),
    },
  },
} satisfies Dictionary;

export default headerContent;
