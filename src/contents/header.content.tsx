import { t, type Dictionary } from "intlayer";

const headerContent = {
  key: "header",
  content: {
    brand: t({
      en: "Brighter.BG",
      bg: "Brighter.BG",
    }),
    navLinks: [
      {
        href: "/properties",
        label: t({ en: "Properties", bg: "Обекти" }),
      },
      {
        href: "/about-us",
        label: t({ en: "About", bg: "За нас" }),
      },
      {
        href: "/contacts",
        label: t({ en: "Contacts", bg: "Контакти" }),
      },
    ],
    cta: t({
      en: "Find Properties",
      bg: "Намери обект",
    }),
    aria: {
      nav: t({ en: "Primary", bg: "Основна навигация" }),
      toggle: t({ en: "Toggle menu", bg: "Превключване на менюто" }),
    },
  },
} satisfies Dictionary;

export default headerContent;
