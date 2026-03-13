import { t, type Dictionary } from "intlayer";

const rootContent = {
  key: "root",
  content: {
    meta: {
      title: t({
        en: "Book Sports Properties in Bulgaria | Brighter.BG",
        bg: "Резервирай спортни игрища в България | Brighter.BG",
      }),
      description: t({
        en: "The easiest way to find and book football, basketball, and tennis courts. Join the community of athletes in Bulgaria.",
        bg: "Най-лесният начин да намерите и резервирате футболни, баскетболни и тенис игрища. Присъединете се към спортната общност в България.",
      }),
    },
  },
} satisfies Dictionary;

export default rootContent;
