import { t, type Dictionary } from "intlayer";

const landingContent = {
  key: "landing-page",
  content: {
    meta: {
      title: t({
        en: "Brighter.BG | Book Properties Instantly",
        bg: "Brighter.BG | Резервирайте имоти моментално",
      }),
      description: t({
        en: "The easiest way to book apartments, houses, and venues near you.",
        bg: "Най-лесният начин да резервирате апартаменти, къщи и обекти близо до вас.",
      }),
    },
    hero: {
      titlePrefix: t({ en: "Find your next ", bg: "Намерете следващото си " }),
      titleHighlight: t({ en: "dream place", bg: "мечтано място" }),
      titleSuffix: "...",
      subtitle: t({
        en: "Search deals on hotels, homes, and much more...",
        bg: "Търсете оферти за хотели, жилища и много повече...",
      }),
    },
    search: {
      destination: t({
        en: "Enter a destination or property",
        bg: "Въведете дестинация или обект",
      }),
      checkIn: t({ en: "Check-in date", bg: "Дата на настаняване" }),
      checkOut: t({ en: "Check-out date", bg: "Дата на напускане" }),
      button: t({ en: "Search", bg: "Търсене" }),
    },
    offers: {
      title: t({ en: "Offers", bg: "Оферти" }),
      subtitle: t({
        en: "Promotions, deals, and special offers for you",
        bg: "Промоции, сделки и специални оферти за вас",
      }),
    },
    offerCard: {
      priceNote: t({
        en: "Includes taxes and fees",
        bg: "Включва данъци и такси",
      }),
      cta: t({ en: "See availability", bg: "Виж наличност" }),
    },
  },
} satisfies Dictionary;

export default landingContent;
