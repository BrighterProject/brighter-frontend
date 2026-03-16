import { t, type Dictionary } from "intlayer";

const propertiesListContent = {
  key: "properties-list",
  content: {
    meta: {
      title: t({
        en: "Browse Properties | Brighter.BG",
        bg: "Разгледайте имоти | Brighter.BG",
      }),
      description: t({
        en: "Find and book properties near you — apartments, houses, venues and more.",
        bg: "Намерете и резервирайте имоти близо до вас — апартаменти, къщи, обекти и още.",
      }),
    },
    title: t({
      en: "Browse properties",
      bg: "Разгледайте имоти",
    }),
    subtitle: t({
      en: "Find the perfect place for your next booking.",
      bg: "Намерете идеалното място за следващата ви резервация.",
    }),
    filters: {
      city: {
        label: t({ en: "City", bg: "Град" }),
        placeholder: t({ en: "Any city", bg: "Всеки град" }),
      },
      price: {
        label: t({ en: "Price / hr (BGN)", bg: "Цена / час (лв)" }),
        min: t({ en: "Min", bg: "Мин" }),
        max: t({ en: "Max", bg: "Макс" }),
      },
      clear: t({ en: "Clear", bg: "Изчисти" }),
    },
    results: {
      property: t({ en: "property", bg: "имот" }),
      properties: t({ en: "properties", bg: "имоти" }),
      found: t({ en: "found", bg: "намерени" }),
    },
    empty: {
      title: t({ en: "No properties found", bg: "Няма намерени имоти" }),
      subtitle: t({
        en: "Try adjusting your filters.",
        bg: "Опитайте да промените филтрите.",
      }),
    },
    error: t({
      en: "Failed to load properties. Please try again.",
      bg: "Неуспешно зареждане на имоти. Моля, опитайте отново.",
    }),
    card: {
      perHour: t({ en: "/hr", bg: "/ч" }),
    },
  },
} satisfies Dictionary;

export default propertiesListContent;
