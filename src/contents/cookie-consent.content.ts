import { t, type Dictionary } from "intlayer";

const cookieConsentContent = {
  key: "consent-banner",
  content: {
    text: t({
      en: "We use essential cookies to make the Platform work. With your consent, we'd also like to use analytics cookies to understand how the Platform is used. See our",
      bg: "Използваме необходими бисквитки, за да можем да предоставяме Платформата. С вашето съгласие бихме искали да използваме и аналитични бисквитки, за да разберем как се използва Платформата. Вижте нашата",
    }),
    link: t({ en: "Privacy Policy", bg: "Политика за поверителност" }),
    acceptAll: t({ en: "Accept all", bg: "Приемам всички" }),
    necessaryOnly: t({ en: "Necessary only", bg: "Само необходими" }),
  },
} satisfies Dictionary;

export default cookieConsentContent;
