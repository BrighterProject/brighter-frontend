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
      guests: t({ en: "2 adults", bg: "2 възрастни" }),
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
      title: t({
        en: "Lorem ipsum dolor sit amet orci aliquam.",
        bg: "Lorem ipsum dolor sit amet orci aliquam.",
      }),
      location: t({ en: "Burgas", bg: "Бургас" }),
      amenity: t({ en: "Restaurant", bg: "Ресторант" }),
      roomType: t({
        en: "Deluxe King Studio - Ground Floor",
        bg: "Делукс Кинг Студио - Партер",
      }),
      roomDetails: t({
        en: "Entire studio \u2022 1 bathroom \u2022 50 m\u00B2",
        bg: "Цяло студио \u2022 1 баня \u2022 50 м\u00B2",
      }),
      bedInfo: t({ en: "1 king bed", bg: "1 кинг-сайз легло" }),
      scarcity: t({
        en: "Only 3 rooms left at this price on our site",
        bg: "Само 3 стаи останаха на тази цена на нашия сайт",
      }),
      perk: t({ en: "Breakfast included", bg: "Включена закуска" }),
      description: t({
        en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel nisi non quam lacinia aliquet ut non arcu. Sed erat ante, bibendum in efficitur egestas, ultricies id tortor. Proin tincidunt tempus orci bibendum cursus. Curabitur dui felis, congue quis congue fermentum, bibendum nec orci. Fusce sollicitudin augue tempor, vulputate lectus quis, consequat elit. Proin porta",
        bg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel nisi non quam lacinia aliquet ut non arcu. Sed erat ante, bibendum in efficitur egestas, ultricies id tortor. Proin tincidunt tempus orci bibendum cursus. Curabitur dui felis, congue quis congue fermentum, bibendum nec orci. Fusce sollicitudin augue tempor, vulputate lectus quis, consequat elit. Proin porta",
      }),
      rating: t({ en: "Excellent", bg: "Отлично" }),
      ratingScore: "8.6",
      priceLabel: t({ en: "1 night, 2 adults", bg: "1 нощувка, 2 възрастни" }),
      price: "BGN 165",
      priceNote: t({
        en: "Includes taxes and fees",
        bg: "Включва данъци и такси",
      }),
      cta: t({ en: "See availability", bg: "Виж наличност" }),
    },
  },
} satisfies Dictionary;

export default landingContent;
