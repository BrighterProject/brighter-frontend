import { t, type Dictionary } from "intlayer";

const propertyDetailContent = {
  key: "property-detail",
  content: {
    meta: {
      title: t({
        en: "Property | Brighter.BG",
        bg: "База | Brighter.BG",
      }),
      description: t({
        en: "View property details, working hours, amenities and book your slot.",
        bg: "Вижте детайли за базата, работно време, удобства и резервирайте своя час.",
      }),
    },
    back: t({ en: "Browse properties", bg: "Разгледайте бази" }),
    noImages: t({ en: "No images", bg: "Няма снимки" }),
    indoor: t({ en: "Indoor", bg: "На закрито" }),
    outdoor: t({ en: "Outdoor", bg: "На открито" }),
    upTo: t({ en: "Up to", bg: "До" }),
    people: t({ en: "people", bg: "човека" }),
    sections: {
      about: t({ en: "About this property", bg: "За тази база" }),
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
    status: {
      active: t({ en: "Active", bg: "Активна" }),
      inactive: t({ en: "Inactive", bg: "Неактивна" }),
      maintenance: t({ en: "Maintenance", bg: "Поддръжка" }),
      pending_approval: t({
        en: "Pending approval",
        bg: "Очаква одобрение",
      }),
    },
    bookingCard: {
      perHour: t({ en: "/ hour", bg: "/ час" }),
      today: t({ en: "Today", bg: "Днес" }),
      capacity: t({ en: "Capacity", bg: "Капацитет" }),
      people: t({ en: "people", bg: "човека" }),
      type: t({ en: "Type", bg: "Тип" }),
      closed: t({ en: "Closed", bg: "Затворено" }),
      bookNow: t({ en: "Book Now", bg: "Резервирай" }),
      unavailable: t({ en: "Unavailable", bg: "Недостъпна" }),
      statusNote: t({
        en: "This property is currently",
        bg: "Тази база в момента е",
      }),
    },
  },
} satisfies Dictionary;

export default propertyDetailContent;
