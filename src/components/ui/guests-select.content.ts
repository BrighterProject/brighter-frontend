import { t, type Dictionary } from "intlayer";

const guestsSelectContent = {
  key: "guests-select",
  content: {
    adults: t({ en: "Adults", bg: "Възрастни" }),
    children: t({ en: "Children", bg: "Деца" }),
    summary: {
      adult: t({ en: "adult", bg: "възрастен" }),
      adults: t({ en: "adults", bg: "възрастни" }),
      child: t({ en: "child", bg: "дете" }),
      children: t({ en: "children", bg: "деца" }),
    },
  },
} satisfies Dictionary;

export default guestsSelectContent;
