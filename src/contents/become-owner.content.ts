import { t, type Dictionary } from "intlayer";

const becomeOwnerContent = {
  key: "become-owner",
  content: {
    meta: {
      title: t({
        en: "Become an Owner | Brighter.BG",
        bg: "Станете собственик | Brighter.BG",
      }),
      description: t({
        en: "List your property and reach thousands of guests.",
        bg: "Публикувайте имота си и достигнете до хиляди гости.",
      }),
    },
    hero: {
      title: t({
        en: "TODO: Hero title",
        bg: "TODO: Заглавие",
      }),
      subtitle: t({
        en: "TODO: Hero subtitle",
        bg: "TODO: Подзаглавие",
      }),
      ctaRegister: t({
        en: "Get started",
        bg: "Започнете",
      }),
      ctaUpgrade: t({
        en: "Sign in & upgrade",
        bg: "Влезте и надградете",
      }),
    },
    benefits: {
      title: t({
        en: "Why list with us",
        bg: "Защо да публикувате при нас",
      }),
      items: [
        {
          title: t({
            en: "TODO: Benefit 1",
            bg: "TODO: Предимство 1",
          }),
          body: t({
            en: "TODO",
            bg: "TODO",
          }),
        },
        {
          title: t({
            en: "TODO: Benefit 2",
            bg: "TODO: Предимство 2",
          }),
          body: t({
            en: "TODO",
            bg: "TODO",
          }),
        },
        {
          title: t({
            en: "TODO: Benefit 3",
            bg: "TODO: Предимство 3",
          }),
          body: t({
            en: "TODO",
            bg: "TODO",
          }),
        },
      ],
    },
    howItWorks: {
      title: t({
        en: "How it works",
        bg: "Как работи",
      }),
      steps: [
        {
          title: t({
            en: "TODO: Step 1",
            bg: "TODO: Стъпка 1",
          }),
          body: t({
            en: "TODO",
            bg: "TODO",
          }),
        },
        {
          title: t({
            en: "TODO: Step 2",
            bg: "TODO: Стъпка 2",
          }),
          body: t({
            en: "TODO",
            bg: "TODO",
          }),
        },
        {
          title: t({
            en: "TODO: Step 3",
            bg: "TODO: Стъпка 3",
          }),
          body: t({
            en: "TODO",
            bg: "TODO",
          }),
        },
      ],
    },
    testimonials: {
      title: t({
        en: "What owners say",
        bg: "Какво казват собствениците",
      }),
      items: [
        {
          quote: t({
            en: "TODO: Testimonial 1",
            bg: "TODO: Отзив 1",
          }),
          author: "TODO",
        },
        {
          quote: t({
            en: "TODO: Testimonial 2",
            bg: "TODO: Отзив 2",
          }),
          author: "TODO",
        },
      ],
    },
  },
} satisfies Dictionary;

export default becomeOwnerContent;
