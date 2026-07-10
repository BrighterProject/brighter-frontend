import { t, enu, type Dictionary } from "intlayer";

const propertyDetailContent = {
  key: "property-detail",
  content: {
    meta: {
      title: t({
        en: "Property | SeasideHoliday",
        bg: "Имот | Почивка на морето",
      }),
      description: t({
        en: "View property details, working hours, amenities and book your slot.",
        bg: "Вижте детайли за имота, работно време, удобства и резервирайте своя час.",
      }),
    },
    back: t({ en: "Browse properties", bg: "Разгледайте имоти" }),
    openInMaps: t({ en: "Open in Maps", bg: "Отвори в Maps" }),
    noImages: t({ en: "No images", bg: "Няма снимки" }),
    upTo: t({ en: "Up to", bg: "До" }),
    people: t({ en: "people", bg: "човека" }),
    checkIn: t({ en: "Check-in", bg: "Настаняване" }),
    checkOut: t({ en: "Check-out", bg: "Напускане" }),
    checkInOut: t({ en: "Check-in / out", bg: "Настаняване / напускане" }),
    sections: {
      about: t({ en: "About this property", bg: "За този имот" }),
      amenities: t({ en: "Amenities", bg: "Удобства" }),
      houseRules: t({ en: "House rules", bg: "Правила на обекта" }),
      workingHours: t({ en: "Working hours", bg: "Работно време" }),
      unavailableToday: t({
        en: "Currently Unavailable",
        bg: "Недостъпно в момента",
      }),
    },
    days: {
      "0": t({ en: "Monday", bg: "Понеделник" }),
      "1": t({ en: "Tuesday", bg: "Вторник" }),
      "2": t({ en: "Wednesday", bg: "Сряда" }),
      "3": t({ en: "Thursday", bg: "Четвъртък" }),
      "4": t({ en: "Friday", bg: "Петък" }),
      "5": t({ en: "Saturday", bg: "Събота" }),
      "6": t({ en: "Sunday", bg: "Неделя" }),
    },
    closed: t({ en: "Closed", bg: "Затворено" }),
    status: {
      active: t({ en: "Active", bg: "Активен" }),
      inactive: t({ en: "Inactive", bg: "Неактивен" }),
      maintenance: t({ en: "Maintenance", bg: "Поддръжка" }),
      pending_approval: t({
        en: "Pending approval",
        bg: "Очаква одобрение",
      }),
    },
    amenityLabels: {
      wifi:               t({ en: "WiFi",                   bg: "WiFi",                     ru: "WiFi" }),
      air_conditioning:   t({ en: "Air Conditioning",       bg: "Климатик",                 ru: "Кондиционер" }),
      kitchen:            t({ en: "Kitchen",                bg: "Кухня",                    ru: "Кухня" }),
      washing_machine:    t({ en: "Washing Machine",        bg: "Перална машина",           ru: "Стиральная машина" }),
      fireplace:          t({ en: "Fireplace",              bg: "Камина",                   ru: "Камин" }),
      bbq:                t({ en: "BBQ",                    bg: "Барбекю",                  ru: "Мангал" }),
      mountain_view:      t({ en: "Mountain View",          bg: "Гледка към планината",     ru: "Вид на горы" }),
      ski_storage:        t({ en: "Ski Storage",            bg: "Съхранение на ски",        ru: "Хранение лыж" }),
      breakfast_included: t({ en: "Breakfast Included",     bg: "Закуска включена",         ru: "Завтрак включён" }),
      reception_24h:      t({ en: "24h Reception",          bg: "24ч рецепция",             ru: "Круглосуточная рецепция" }),
      sea_view:           t({ en: "Sea View",               bg: "Гледка към морето",        ru: "Вид на море" }),
      balcony:            t({ en: "Balcony",                bg: "Балкон",                   ru: "Балкон" }),
      pool:               t({ en: "Pool",                   bg: "Басейн",                   ru: "Бассейн" }),
      garden:             t({ en: "Garden",                 bg: "Градина",                  ru: "Сад" }),
      pet_friendly:       t({ en: "Pet Friendly",           bg: "Домашни любимци",          ru: "Можно с питомцами" }),
      coffee_machine:     t({ en: "Coffee Machine",         bg: "Кафемашина",               ru: "Кофемашина" }),
    },
    cancellationPolicy: {
      title: t({
        en: "Cancellation policy",
        bg: "Политика за отказ",
        ru: "Политика отмены",
      }),
      labels: {
        free: t({
          en: "Free cancellation",
          bg: "Безплатен отказ",
          ru: "Бесплатная отмена",
        }),
        moderate: t({ en: "Moderate", bg: "Умерена", ru: "Умеренная" }),
        strict: t({ en: "Strict", bg: "Строга", ru: "Строгая" }),
      },
      descriptions: {
        free: t({
          en: "Full refund up to 24 hours before check-in.",
          bg: "Пълно връщане до 24 часа преди настаняване.",
          ru: "Полный возврат до 24 часов до заезда.",
        }),
        moderate: t({
          en: "Full refund up to 5 days before check-in; 50% afterwards.",
          bg: "Пълно връщане до 5 дни преди настаняване; 50% след това.",
          ru: "Полный возврат до 5 дней до заезда; 50% после.",
        }),
        strict: t({
          en: "50% refund up to 7 days before check-in; no refund afterwards.",
          bg: "50% връщане до 7 дни преди настаняване; без връщане след това.",
          ru: "50% возврат до 7 дней до заезда; без возврата после.",
        }),
      },
    },
    bookingCard: {
      perNight: t({ en: "/ night", bg: "/ нощ" }),
      today: t({ en: "Today", bg: "Днес" }),
      capacity: t({ en: "Capacity", bg: "Капацитет" }),
      people: t({ en: "people", bg: "човека" }),
      closed: t({ en: "Closed", bg: "Затворено" }),
      bookNow: t({ en: "Book Now", bg: "Резервирай" }),
      unavailable: t({ en: "Unavailable", bg: "Недостъпен" }),
      statusNote: t({
        en: "This property is currently",
        bg: "Този имот в момента е",
      }),
      selectDates: t({
        en: "Select check-in and check-out dates",
        bg: "Изберете дати за настаняване и напускане",
      }),
      nights: enu({
        "1": t({ en: "night", bg: "нощ" }),
        ">1": t({ en: "nights", bg: "нощи" }),
      }),
      total: t({ en: "Total", bg: "Общо" }),
      dateError: t({
        en: "Invalid date range",
        bg: "Невалиден период",
      }),
      calendar: {
        myBooking: t({ en: "My booking", bg: "Моята резервация" }),
        booked: t({ en: "Booked", bg: "Заето" }),
        unavailable: t({ en: "Unavailable", bg: "Недостъпно" }),
        turnoverCheckoutOnly: t({
          en: "You can only check out here.",
          bg: "Тук можете само да напуснете.",
        }),
        minNightsPrefix: t({ en: "Minimum stay:", bg: "Минимален престой:" }),
        maxNightsPrefix: t({ en: "Maximum stay:", bg: "Максимален престой:" }),
        rangeUnavailable: t({
          en: "The selected range includes unavailable dates.",
          bg: "Избраният период включва недостъпни дати.",
        }),
      },
    },
  },
} satisfies Dictionary;

export default propertyDetailContent;
