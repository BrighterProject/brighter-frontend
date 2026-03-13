import { t, type Dictionary } from "intlayer";

const landingContent = {
  key: "landing-page",
  content: {
    meta: {
      title: t({
        en: "Brighter.BG | Rent Sports Facilities Instantly",
        bg: "Brighter.BG | Наемете спортни съоръжения моментално",
      }),
      description: t({
        en: "The easiest way to book football pitches, tennis courts, and gyms near you.",
        bg: "Най-лесният начин да резервирате футболни игрища, тенис кортове и зали близо до вас.",
      }),
    },
    hero: {
      badge: t({
        en: "Sports Booking Platform",
        bg: "Платформа за спортни резервации",
      }),
      title: t({
        en: "Play Your Favorite Sport, Any Time, Anywhere",
        bg: "Играйте любимия си спорт, по всяко време, навсякъде",
      }),
      subtitle: t({
        en: "Discover and book premium sports facilities in your city. From football pitches to padel courts — book in seconds, not phone calls.",
        bg: "Открийте и резервирайте първокласни спортни бази във вашия град. От футболни игрища до падел кортове — резервирайте за секунди.",
      }),
      ctaPrimary: t({ en: "Find a Court", bg: "Намери игрище" }),
      ctaSecondary: t({
        en: "List Your Facility",
        bg: "Добави своята база",
      }),
      stats: {
        properties: t({ en: "50+ Properties", bg: "50+ обекта" }),
        cities: t({ en: "10+ Cities", bg: "10+ града" }),
        bookings: t({ en: "1K+ Bookings", bg: "1000+ резервации" }),
      },
    },
    features: {
      tagline: t({ en: "Why Choose Us", bg: "Защо да изберете нас" }),
      subtitle: t({
        en: "Everything you need for a seamless booking experience",
        bg: "Всичко необходимо за безпроблемно резервиране",
      }),
      items: [
        {
          title: t({ en: "Instant Booking", bg: "Мигновена резервация" }),
          description: t({
            en: "No more phone calls. Browse availability and book your slot in seconds with real-time scheduling.",
            bg: "Без повече телефонни разговори. Разгледайте наличността и резервирайте за секунди.",
          }),
        },
        {
          title: t({ en: "Verified Properties", bg: "Проверени бази" }),
          description: t({
            en: "Every facility is personally verified for quality. See photos, reviews, and amenities before you book.",
            bg: "Всяко съоръжение е лично проверено за качество. Вижте снимки, отзиви и удобства.",
          }),
        },
        {
          title: t({ en: "Secure Payments", bg: "Сигурни плащания" }),
          description: t({
            en: "Pay securely online via Stripe. Full refund on owner cancellations, transparent pricing always.",
            bg: "Плащайте сигурно онлайн чрез Stripe. Пълно възстановяване при отмяна от собственика.",
          }),
        },
      ],
    },
    howItWorks: {
      title: t({ en: "How It Works", bg: "Как работи" }),
      subtitle: t({
        en: "Get on the court in three simple steps",
        bg: "Излезте на терена в три лесни стъпки",
      }),
      steps: [
        {
          step: "01",
          title: t({ en: "Search", bg: "Търсете" }),
          description: t({
            en: "Browse properties by sport, location, or availability. Filter by price, amenities, and ratings.",
            bg: "Разгледайте обекти по спорт, локация или наличност. Филтрирайте по цена и удобства.",
          }),
        },
        {
          step: "02",
          title: t({ en: "Book", bg: "Резервирайте" }),
          description: t({
            en: "Pick your time slot from the real-time calendar. See exactly what's available — no surprises.",
            bg: "Изберете час от календара в реално време. Вижте точно какво е налично.",
          }),
        },
        {
          step: "03",
          title: t({ en: "Play", bg: "Играйте" }),
          description: t({
            en: "Show up and enjoy. Your booking is confirmed instantly — the property is expecting you.",
            bg: "Елате и се забавлявайте. Резервацията ви е потвърдена — обектът ви очаква.",
          }),
        },
      ],
    },
    categories: {
      title: t({ en: "Popular Sports", bg: "Популярни спортове" }),
      subtitle: t({
        en: "Find the perfect property for your game",
        bg: "Намерете перфектния обект за вашата игра",
      }),
      list: [
        { name: t({ en: "Football", bg: "Футбол" }) },
        { name: t({ en: "Tennis", bg: "Тенис" }) },
        { name: t({ en: "Basketball", bg: "Баскетбол" }) },
        { name: t({ en: "Swimming", bg: "Плуване" }) },
        { name: t({ en: "Volleyball", bg: "Волейбол" }) },
        { name: t({ en: "Padel", bg: "Падел" }) },
      ],
    },
    cta: {
      title: t({
        en: "Ready to Play?",
        bg: "Готови ли сте да играете?",
      }),
      subtitle: t({
        en: "Join thousands of athletes who book their properties through Brighter.BG",
        bg: "Присъединете се към хиляди спортисти, които резервират чрез Brighter.BG",
      }),
      button: t({
        en: "Get Started — It's Free",
        bg: "Започнете — безплатно е",
      }),
    },
  },
} satisfies Dictionary;

export default landingContent;
