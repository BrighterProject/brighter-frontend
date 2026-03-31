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
      en: "Find the perfect place for your next stay.",
      bg: "Намерете идеалното място за следващия ви престой.",
    }),
    filters: {
      heading: t({ en: "Filter by:", bg: "Филтрирай по:" }),
      city: {
        label: t({ en: "Destination", bg: "Дестинация" }),
        placeholder: t({ en: "Where are you going?", bg: "Къде отивате?" }),
      },
      price: {
        label: t({ en: "Your budget (per night)", bg: "Бюджет (на нощувка)" }),
        currency: t({ en: "EUR", bg: "EUR" }),
      },
      propertyType: {
        label: t({ en: "Property type", bg: "Тип имот" }),
        hotel: t({ en: "Hotels", bg: "Хотели" }),
        apartment: t({ en: "Apartments", bg: "Апартаменти" }),
        house: t({ en: "Houses", bg: "Къщи" }),
        villa: t({ en: "Villas", bg: "Вили" }),
        hostel: t({ en: "Hostels", bg: "Хостели" }),
        guesthouse: t({ en: "Guest houses", bg: "Къщи за гости" }),
      },
      popularFilters: {
        label: t({ en: "Popular filters", bg: "Популярни филтри" }),
        freeCancellation: t({
          en: "Free cancellation",
          bg: "Безплатно анулиране",
        }),
        breakfastIncluded: t({
          en: "Breakfast included",
          bg: "Закуска включена",
        }),
        pool: t({ en: "Pool", bg: "Басейн" }),
        wifi: t({ en: "Free WiFi", bg: "Безплатен WiFi" }),
        parking: t({ en: "Parking", bg: "Паркинг" }),
        petFriendly: t({ en: "Pet-friendly", bg: "Домашни любимци" }),
        airConditioning: t({ en: "Air conditioning", bg: "Климатик" }),
        kitchen: t({ en: "Kitchen", bg: "Кухня" }),
      },
      rating: {
        label: t({ en: "Guest rating", bg: "Оценка от гости" }),
        above: t({ en: "+", bg: "+" }),
      },
      starRating: {
        label: t({ en: "Star rating", bg: "Брой звезди" }),
        stars: t({ en: "stars", bg: "звезди" }),
      },
      bedrooms: {
        label: t({ en: "Bedrooms", bg: "Спални" }),
      },
      clear: t({ en: "Clear all", bg: "Изчисти всички" }),
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
    loadingMore: t({ en: "Loading more...", bg: "Зареждане..." }),
    noMore: t({ en: "No more properties", bg: "Няма повече имоти" }),
    error: t({
      en: "Failed to load properties. Please try again.",
      bg: "Неуспешно зареждане на имоти. Моля, опитайте отново.",
    }),
    card: {
      perNight: t({ en: "/night", bg: "/нощ" }),
      seeAvailability: t({ en: "See availability", bg: "Виж наличност" }),
      reviews: t({ en: "reviews", bg: "отзива" }),
      review: t({ en: "review", bg: "отзив" }),
      guests: t({ en: "guests", bg: "гости" }),
      excellent: t({ en: "Excellent", bg: "Отлично" }),
      veryGood: t({ en: "Very good", bg: "Много добро" }),
      good: t({ en: "Good", bg: "Добро" }),
      includedTaxes: t({
        en: "Includes taxes and fees",
        bg: "Включва данъци и такси",
      }),
    },
  },
} satisfies Dictionary;

export default propertiesListContent;
