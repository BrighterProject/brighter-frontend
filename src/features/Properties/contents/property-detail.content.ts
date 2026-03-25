import { t, type Dictionary } from "intlayer";

const propertyDetailContent = {
  key: "property-detail",
  content: {
    meta: {
      title: t({
        en: "Property | Brighter.BG",
        bg: "Имот | Brighter.BG",
      }),
      description: t({
        en: "View property details, working hours, amenities and book your slot.",
        bg: "Вижте детайли за имота, работно време, удобства и резервирайте своя час.",
      }),
    },
    back: t({ en: "Browse properties", bg: "Разгледайте имоти" }),
    noImages: t({ en: "No images", bg: "Няма снимки" }),
    upTo: t({ en: "Up to", bg: "До" }),
    people: t({ en: "people", bg: "човека" }),
    sections: {
      about: t({ en: "About this property", bg: "За този имот" }),
      amenities: t({ en: "Amenities", bg: "Удобства" }),
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
    },
  },
} satisfies Dictionary;

export default propertyDetailContent;
