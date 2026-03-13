import { t, type Dictionary } from "intlayer";

const footerContent = {
  key: "footer",
  content: {
    brand: t({
      en: "Brighter.BG",
      bg: "Brighter.BG",
    }),
    tagline: t({
      en: "Find and book sports properties near you.",
      bg: "Намери и резервирай спортни обекти близо до теб.",
    }),
    builtWith: t({
      en: "built with shadcn/ui",
      bg: "изградено със shadcn/ui",
    }),
    copyright: t({
      en: "© 2026 Brighter.BG. All rights reserved.",
      bg: "© 2026 Brighter.BG. Всички права запазени.",
    }),
    sections: {
      quickLinks: {
        title: t({ en: "Quick Links", bg: "Бързи връзки" }),
        properties: t({ en: "Browse Properties", bg: "Разгледай обекти" }),
        bookings: t({ en: "My Bookings", bg: "Моите резервации" }),
        about: t({ en: "About Us", bg: "За нас" }),
      },
      forOwners: {
        title: t({ en: "For Property Owners", bg: "За собственици" }),
        listProperty: t({ en: "List Your Property", bg: "Добави обект" }),
        contact: t({ en: "Contact Us", bg: "Свържи се с нас" }),
      },
      connect: {
        title: t({ en: "Connect", bg: "Свържи се" }),
        contact: t({ en: "Contact Us", bg: "Свържи се с нас" }),
      },
    },
  },
} satisfies Dictionary;

export default footerContent;
