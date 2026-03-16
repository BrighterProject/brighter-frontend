import { t, type Dictionary } from "intlayer";

const headerContent = {
  key: "header",
  content: {
    brand: t({
      en: "BrighterProject",
      bg: "BrighterProject",
    }),
    signIn: t({ en: "Sign in", bg: "Вход" }),
    createAccount: t({ en: "Create account", bg: "Регистрация" }),
    aria: {
      nav: t({ en: "Primary", bg: "Основна навигация" }),
      toggle: t({ en: "Toggle menu", bg: "Превключване на менюто" }),
      help: t({ en: "Help", bg: "Помощ" }),
    },
  },
} satisfies Dictionary;

export default headerContent;
