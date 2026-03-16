import { t, type Dictionary } from "intlayer";

const aboutUsContent = {
  key: "about-us",
  content: {
    meta: {
      title: t({
        en: "About Us | Brighter.BG",
        bg: "За нас | Brighter.BG",
      }),
      description: t({
        en: "Learn about the team behind Brighter.BG — two students from Bulgaria building an open-source property booking platform.",
        bg: "Научете повече за екипа зад Brighter.BG — двама ученици от България, създаващи платформа за резервации на имоти с отворен код.",
      }),
    },
    hero: {
      badge: t({ en: "Our Story", bg: "Нашата история" }),
      title: t({
        en: "Built by Students, for Everyone",
        bg: "Създадено от ученици, за всеки",
      }),
      subtitle: t({
        en: "An open-source property booking platform born from a passion for technology and innovation.",
        bg: "Платформа за резервации на имоти с отворен код, родена от страст към технологиите и иновациите.",
      }),
    },
    story: {
      title: t({ en: "Who We Are", bg: "Кои сме ние" }),
      paragraphs: [
        t({
          en: "We are Kirill from Burgas and Tsveti from Pernik — two students who share a love for technology. Brighter.BG started as our project for the National IT Olympiad — an opportunity to tackle a real problem we saw in our everyday lives.",
          bg: "Ние сме Кирил от Бургас и Цвети от Перник — двама ученици, които споделят любовта си към технологиите. Brighter.BG започна като наш проект за Националната IT олимпиада — възможност да решим реален проблем от ежедневието ни.",
        }),
        t({
          en: "Inspired by the technological advancements in other countries — where booking a property is as easy as ordering food online — we set out to bring that same convenience to Bulgaria. We noticed that most property bookings here still happen through phone calls, Facebook messages, or word of mouth. We wanted to change that.",
          bg: "Вдъхновени от технологичния напредък в други държави — където резервацията на имот е толкова лесна, колкото поръчката на храна онлайн — решихме да донесем същото удобство в България. Забелязахме, че повечето резервации тук все още стават по телефона, чрез Facebook съобщения или от уста на уста. Искахме да променим това.",
        }),
        t({
          en: "Brighter.BG is fully open-source. We believe in transparency and community-driven development. Every line of code is public, and we welcome contributions from developers who share our vision.",
          bg: "Brighter.BG е изцяло с отворен код. Вярваме в прозрачността и разработката, задвижвана от общността. Всеки ред код е публичен и приветстваме приноси от разработчици, споделящи нашата визия.",
        }),
      ],
    },
    values: {
      title: t({ en: "What Drives Us", bg: "Какво ни движи" }),
      items: [
        {
          title: t({ en: "Open Source", bg: "Отворен код" }),
          description: t({
            en: "Our entire codebase is public on GitHub. We build in the open because great software should be shared.",
            bg: "Целият ни код е публичен в GitHub. Разработваме открито, защото добрият софтуер трябва да се споделя.",
          }),
        },
        {
          title: t({ en: "Real Problem", bg: "Реален проблем" }),
          description: t({
            en: "We're not building for the sake of it. Property booking in Bulgaria needs modernization — and we're making it happen.",
            bg: "Не създаваме просто за да създаваме. Резервациите на имоти в България се нуждаят от модернизация — и ние я правим.",
          }),
        },
        {
          title: t({ en: "Community First", bg: "Общността е на първо място" }),
          description: t({
            en: "Built for guests and property owners alike. We listen to feedback and iterate fast.",
            bg: "Създадено за гости и собственици на имоти. Слушаме обратната връзка и се подобряваме бързо.",
          }),
        },
      ],
    },
    listProperty: {
      title: t({
        en: "Want to List Your Property?",
        bg: "Искате да добавите вашия имот?",
      }),
      subtitle: t({
        en: "Getting your property on Brighter.BG is simple. Here's how:",
        bg: "Добавянето на вашия имот в Brighter.BG е лесно. Ето как:",
      }),
      steps: [
        {
          step: "1",
          title: t({ en: "Contact us", bg: "Свържете се с нас" }),
          description: t({
            en: "Reach out through our contact page or email us directly. Tell us about your property.",
            bg: "Свържете се чрез нашата страница за контакт или ни пишете директно. Разкажете ни за вашия имот.",
          }),
        },
        {
          step: "2",
          title: t({ en: "We verify your property", bg: "Проверяваме имота ви" }),
          description: t({
            en: "Our team reviews the information and sets up your owner account with the right permissions.",
            bg: "Нашият екип преглежда информацията и създава вашия акаунт на собственик с подходящите права.",
          }),
        },
        {
          step: "3",
          title: t({
            en: "Start receiving bookings",
            bg: "Започнете да получавате резервации",
          }),
          description: t({
            en: "Add your property details, photos, and availability. You'll start receiving bookings from guests in your area.",
            bg: "Добавете информация, снимки и наличност на имота. Ще започнете да получавате резервации от гости в района ви.",
          }),
        },
      ],
      cta: t({ en: "Get in Touch", bg: "Свържете се с нас" }),
    },
  },
} satisfies Dictionary;

export default aboutUsContent;
