import { t, type Dictionary } from "intlayer";

const pricingContent = {
  key: "pricing-page",
  content: {
    meta: {
      title: t({
        en: "Pricing | Brighter.BG",
        bg: "Ценови планове | Brighter.BG",
      }),
      description: t({
        en: "Choose a plan to start listing your properties.",
        bg: "Изберете план, за да публикувате имотите си.",
      }),
    },
    hero: {
      title: t({ en: "Choose your plan", bg: "Изберете своя план" }),
      subtitle: t({
        en: "Start listing properties and reach more guests.",
        bg: "Публикувайте имоти и достигнете до повече гости.",
      }),
    },
    plan: {
      listings: t({ en: "listings", bg: "обяви" }),
      cta: {
        getStarted: t({ en: "Get started", bg: "Започнете" }),
        currentPlan: t({ en: "Current plan", bg: "Текущ план" }),
        trialing: t({ en: "Currently trialing", bg: "В пробен период" }),
        contactUs: t({ en: "Contact us", bg: "Свържете се с нас" }),
        upgrade: t({ en: "Choose plan", bg: "Изберете план" }),
      },
    },
    banner: {
      cancelled: t({
        en: "Checkout cancelled. You can try again whenever you're ready.",
        bg: "Плащането беше отменено. Можете да опитате отново по всяко време.",
      }),
      dismiss: t({ en: "Dismiss", bg: "Затвори" }),
    },
    enterprise: {
      name: t({ en: "Enterprise", bg: "Enterprise" }),
      description: t({
        en: "Custom pricing for large operations. Contact us.",
        bg: "Персонализирани условия за големи операции. Свържете се с нас.",
      }),
    },
  },
} satisfies Dictionary;

export default pricingContent;
