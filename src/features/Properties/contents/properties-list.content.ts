import { t, type Dictionary } from "intlayer";

const propertiesListContent = {
  key: "properties-list",
  content: {
    meta: {
      title: t({
        en: "Browse Properties | Brighter.BG",
        bg: "Разгледайте бази | Brighter.BG",
      }),
      description: t({
        en: "Find and book sports properties near you — football, tennis, basketball and more.",
        bg: "Намерете и резервирайте спортни бази близо до вас — футбол, тенис, баскетбол и още.",
      }),
    },
    title: t({
      en: "Browse properties",
      bg: "Разгледайте бази",
    }),
    subtitle: t({
      en: "Find the perfect spot for your next game.",
      bg: "Намерете идеалното място за следващата ви игра.",
    }),
    filters: {
      sport: {
        label: t({ en: "Sport", bg: "Спорт" }),
        all: t({ en: "All sports", bg: "Всички спортове" }),
      },
      city: {
        label: t({ en: "City", bg: "Град" }),
        placeholder: t({ en: "Any city", bg: "Всеки град" }),
      },
      price: {
        label: t({ en: "Price / hr (BGN)", bg: "Цена / час (лв)" }),
        min: t({ en: "Min", bg: "Мин" }),
        max: t({ en: "Max", bg: "Макс" }),
      },
      type: {
        label: t({ en: "Type", bg: "Тип" }),
        all: t({ en: "All", bg: "Всички" }),
        indoor: t({ en: "Indoor", bg: "На закрито" }),
        outdoor: t({ en: "Outdoor", bg: "На открито" }),
      },
      clear: t({ en: "Clear", bg: "Изчисти" }),
    },
    results: {
      property: t({ en: "property", bg: "база" }),
      properties: t({ en: "properties", bg: "бази" }),
      found: t({ en: "found", bg: "намерени" }),
    },
    empty: {
      title: t({ en: "No properties found", bg: "Няма намерени бази" }),
      subtitle: t({
        en: "Try adjusting your filters.",
        bg: "Опитайте да промените филтрите.",
      }),
    },
    error: t({
      en: "Failed to load properties. Please try again.",
      bg: "Неуспешно зареждане на бази. Моля, опитайте отново.",
    }),
    card: {
      indoor: t({ en: "Indoor", bg: "На закрито" }),
      perHour: t({ en: "/hr", bg: "/ч" }),
    },
    sports: {
      football: t({ en: "Football", bg: "Футбол" }),
      basketball: t({ en: "Basketball", bg: "Баскетбол" }),
      tennis: t({ en: "Tennis", bg: "Тенис" }),
      volleyball: t({ en: "Volleyball", bg: "Волейбол" }),
      swimming: t({ en: "Swimming", bg: "Плуване" }),
      gym: t({ en: "Gym", bg: "Фитнес" }),
      padel: t({ en: "Padel", bg: "Падел" }),
      other: t({ en: "Other", bg: "Друго" }),
    },
  },
} satisfies Dictionary;

export default propertiesListContent;
