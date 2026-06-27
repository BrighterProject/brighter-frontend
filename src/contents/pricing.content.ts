import { t, type Dictionary } from "intlayer";

const pricingContent = {
  key: "pricing-page",
  content: {
    meta: {
      title: t({
        en: "Pricing | BrighterProject",
        bg: "Ценови планове | BrighterProject",
      }),
      description: t({
        en: "List your holiday rental in Bulgaria, accept bookings, and receive secure online payments. Plans from €8/month.",
        bg: "Публикувайте ваканционния си имот в България, приемайте резервации и получавайте онлайн плащания. Планове от 8 €/месец.",
      }),
    },
    hero: {
      badge: t({
        en: "Secure online payments",
        bg: "Сигурни онлайн плащания",
      }),
      title: t({
        en: "Reach guests who are ready to book",
        bg: "Достигнете до гости, готови да резервират",
      }),
      subtitle: t({
        en: "List your holiday rental and collect payments securely — no chasing bank transfers.",
        bg: "Публикувайте ваканционния си имот и получавайте плащания сигурно — без банкови преводи и чакане.",
      }),
    },
    plan: {
      upTo: t({ en: "Up to", bg: "До" }),
      properties: t({ en: "properties", bg: "имота" }),
      perMonth: t({ en: "/month", bg: "/месец" }),
      perProperty: t({ en: "/property", bg: "/имот" }),
      mostPopular: t({ en: "Most popular", bg: "Най-популярен" }),
      taglines: {
        starter: t({
          en: "For owners with one property",
          bg: "За собственици с един имот",
        }),
        basic: t({
          en: "For a small portfolio",
          bg: "За малко портфолио",
        }),
        pro: t({
          en: "For active hosts",
          bg: "За активни домакини",
        }),
        business: t({
          en: "For property managers",
          bg: "За мениджъри на имоти",
        }),
      },
      cta: {
        getStarted: t({ en: "Get started", bg: "Започнете" }),
        currentPlan: t({ en: "Current plan", bg: "Текущ план" }),
        trialing: t({ en: "Currently trialing", bg: "В пробен период" }),
        contactUs: t({ en: "Contact us", bg: "Свържете се с нас" }),
        upgrade: t({ en: "Select plan", bg: "Изберете план" }),
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
      tagline: t({
        en: "For agencies and portfolio investors",
        bg: "За агенции и инвеститори",
      }),
      description: t({
        en: "Managing 15+ properties? Get custom pricing, a dedicated account manager, and volume agreements tailored to your operation.",
        bg: "Управлявате 15+ имота? Получете персонализирани условия, отделен акаунт мениджър и обемни договори.",
      }),
    },
    trust: {
      payments: t({
        en: "Stripe-secured payments",
        bg: "Плащания чрез Stripe",
      }),
      cancel: t({ en: "Cancel anytime", bg: "Отмяна по всяко време" }),
      support: t({ en: "Local support", bg: "Местна поддръжка" }),
    },
  },
} satisfies Dictionary;

export default pricingContent;
