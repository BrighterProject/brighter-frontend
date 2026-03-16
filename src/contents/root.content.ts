import { t, type Dictionary } from "intlayer";

const rootContent = {
  key: "root",
  content: {
    meta: {
      title: t({
        en: "Book Properties in Bulgaria | Brighter.BG",
        bg: "Резервирай имоти в България | Brighter.BG",
      }),
      description: t({
        en: "The easiest way to find and book apartments, houses, and venues. Discover great places across Bulgaria.",
        bg: "Най-лесният начин да намерите и резервирате апартаменти, къщи и обекти. Открийте страхотни места из България.",
      }),
    },
  },
} satisfies Dictionary;

export default rootContent;
