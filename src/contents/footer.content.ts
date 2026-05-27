import { t, type Dictionary } from "intlayer";

const footerContent = {
  key: "footer",
  content: {
    brand: t({
      en: "SeasideHoliday",
      bg: "Почивка на морето",
    }),
    tagline: t({
      en: "Find and book properties near you.",
      bg: "Намери и резервирай имоти близо до теб.",
    }),
    builtWith: t({
      en: "built with shadcn/ui",
      bg: "изградено със shadcn/ui",
    }),
    copyright: t({
      en: "\u00A9 2026 SeasideHoliday. All rights reserved.",
      bg: "\u00A9 2026 Почивка на морето. Всички права запазени.",
    }),
    sections: {
      quickLinks: {
        title: t({ en: "Quick Links", bg: "Бързи връзки" }),
        properties: t({ en: "Browse Properties", bg: "Разгледай имоти" }),
        bookings: t({ en: "My Bookings", bg: "Моите резервации" }),
        about: t({ en: "About Us", bg: "За нас" }),
      },
      forOwners: {
        title: t({ en: "For Property Owners", bg: "За собственици" }),
        listProperty: t({ en: "List Your Property", bg: "Добави имот" }),
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
