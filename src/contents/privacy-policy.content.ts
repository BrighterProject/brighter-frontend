import { t, type Dictionary } from "intlayer";

const privacyPolicyContent = {
  key: "privacy-policy",
  content: {
    meta: {
      title: t({
        en: "Privacy Policy | SeasideHoliday",
        bg: "Политика за поверителност | Почивка на морето",
      }),
      description: t({
        en: "How SeasideHoliday collects, uses, and protects your personal data.",
        bg: "Как Почивка на морето събира, използва и защитава личните ви данни.",
      }),
    },
    title: t({ en: "Privacy Policy", bg: "Политика за поверителност" }),
    updated: t({
      en: "Last updated: 6 July 2026",
      bg: "Последна актуализация: 6 юли 2026 г.",
    }),
    intro: t({
      en: "This Privacy Policy explains how SeasideHoliday (“the Platform”, “we”, “us”) collects, uses, shares, and protects your personal data when you use our property booking platform, in accordance with Regulation (EU) 2016/679 (GDPR) and the Bulgarian Personal Data Protection Act (Закон за защита на личните данни). This is a generic template pending review by qualified legal counsel and does not constitute legal advice.",
      bg: "Настоящата Политика за поверителност разяснява как Почивка на морето („Платформата“, „ние“) събира, използва, споделя и защитава личните ви данни при използване на нашата платформа за резервации на имоти, в съответствие с Регламент (ЕС) 2016/679 (GDPR) и Закона за защита на личните данни. Настоящият текст е примерен и подлежи на преглед от квалифициран юрист; той не представлява правен съвет.",
    }),
    sections: [
      {
        title: t({ en: "1. Data Controller", bg: "1. Администратор на данни" }),
        paragraphs: [
          t({
            en: "SeasideHoliday is the data controller responsible for your personal data processed through the Platform. You can reach our team via the Contact page for any privacy-related request.",
            bg: "Почивка на морето е администраторът на лични данни, отговорен за обработката на вашите лични данни чрез Платформата. Можете да се свържете с нашия екип чрез страницата за контакт за всякакви въпроси, свързани с поверителността.",
          }),
        ],
      },
      {
        title: t({
          en: "2. What Data We Collect",
          bg: "2. Какви данни събираме",
        }),
        paragraphs: [
          t({
            en: "Account data: name, email address, and password (stored hashed). Booking data: guest name, email, phone number, special requests, and stay dates. Property data (for Owners): property details, tourism-registry number, location, and images. Payment data: processed directly by Stripe; we do not store full card numbers. Usage data: pages visited and general interaction with the Platform, collected via standard web server logs and cookies.",
            bg: "Данни за профил: име, имейл адрес и парола (съхранявана в хеширан вид). Данни за резервация: име на госта, имейл, телефонен номер, специални изисквания и дати на престоя. Данни за имот (за Собственици): подробности за имота, номер от туристическия регистър, местоположение и снимки. Платежни данни: обработват се директно от Stripe; ние не съхраняваме пълни номера на карти. Данни за използване: посетени страници и обща информация за взаимодействие с Платформата, събирани чрез стандартни лог файлове на сървъра и бисквитки.",
          }),
        ],
      },
      {
        title: t({
          en: "3. Legal Basis for Processing",
          bg: "3. Правно основание за обработка",
        }),
        paragraphs: [
          t({
            en: "We process your data based on: performance of a contract (Art. 6(1)(b) GDPR) to create your account and manage bookings; legal obligation (Art. 6(1)(c) GDPR) for tax, accounting, and tourism-registry requirements under Bulgarian law; and legitimate interest (Art. 6(1)(f) GDPR) to keep the Platform secure and improve our services.",
            bg: "Обработваме вашите данни на следните основания: изпълнение на договор (чл. 6, §1, б. „б“ от GDPR) за създаване на профила ви и управление на резервации; законово задължение (чл. 6, §1, б. „в“ от GDPR) за целите на данъчното, счетоводното и туристическото законодателство на България; и легитимен интерес (чл. 6, §1, б. „е“ от GDPR) за поддържане сигурността на Платформата и подобряване на услугите ни.",
          }),
        ],
      },
      {
        title: t({
          en: "4. How We Share Your Data",
          bg: "4. Как споделяме вашите данни",
        }),
        paragraphs: [
          t({
            en: "Guest booking details (name, contact information, stay dates) are shared with the relevant property Owner so they can prepare for your stay. Payment information is shared with Stripe, our PCI-compliant payment processor. We may also share data with hosting and infrastructure providers strictly to operate the Platform. We do not sell your personal data to third parties.",
            bg: "Данните за резервация на Госта (име, данни за контакт, дати на престой) се споделят със съответния Собственик на имота, за да може той да се подготви за престоя ви. Платежната информация се споделя със Stripe, нашия PCI-съвместим доставчик на платежни услуги. Възможно е също да споделяме данни с доставчици на хостинг и инфраструктура, единствено с цел функционирането на Платформата. Ние не продаваме личните ви данни на трети страни.",
          }),
        ],
      },
      {
        title: t({ en: "5. Data Retention", bg: "5. Съхранение на данните" }),
        paragraphs: [
          t({
            en: "We retain account and booking data for as long as your account is active and for the period required by Bulgarian accounting and tax legislation thereafter (generally up to 10 years for financial records). You may request deletion of your account at any time, subject to these legal retention obligations.",
            bg: "Съхраняваме данните за профила и резервациите, докато профилът ви е активен, а след това за периода, изискван от българското счетоводно и данъчно законодателство (обичайно до 10 години за финансови документи). Можете да поискате изтриване на профила си по всяко време, при спазване на тези законови задължения за съхранение.",
          }),
        ],
      },
      {
        title: t({ en: "6. Your Rights", bg: "6. Вашите права" }),
        paragraphs: [
          t({
            en: "Under the GDPR and Bulgarian law, you have the right to: access your personal data; request rectification of inaccurate data; request erasure (“right to be forgotten”); restrict or object to processing; request data portability; and withdraw consent at any time where processing is based on consent. To exercise any of these rights, contact us via the Contact page.",
            bg: "Съгласно GDPR и българското законодателство, имате право на: достъп до личните си данни; коригиране на неточни данни; изтриване („право да бъдете забравени“); ограничаване или възражение срещу обработката; преносимост на данните; и оттегляне на съгласието по всяко време, когато обработката се основава на съгласие. За да упражните тези права, свържете се с нас чрез страницата за контакт.",
          }),
          t({
            en: "You also have the right to lodge a complaint with the Bulgarian Commission for Personal Data Protection (Комисия за защита на личните данни, cpdp.bg), the supervisory authority for data protection in Bulgaria.",
            bg: "Имате право и да подадете жалба до Комисията за защита на личните данни (cpdp.bg), надзорният орган по защита на данните в България.",
          }),
        ],
      },
      {
        title: t({ en: "7. Cookies", bg: "7. Бисквитки" }),
        paragraphs: [
          t({
            en: "We use essential cookies required for the Platform to function (e.g. keeping you logged in). With your consent, given via the cookie banner shown on your first visit, we may also use analytics cookies to understand how the Platform is used. You can change your choice at any time by clearing your browser's site data for this domain. We do not use third-party advertising cookies.",
            bg: "Използваме необходими бисквитки, нужни за функционирането на Платформата (напр. поддържане на вход в профила ви). С вашето съгласие, дадено чрез банера за бисквитки при първото ви посещение, е възможно да използваме и аналитични бисквитки, за да разберем как се използва Платформата. Можете да промените избора си по всяко време, като изчистите данните за сайта в браузъра си за този домейн. Не използваме рекламни бисквитки на трети страни.",
          }),
        ],
      },
      {
        title: t({ en: "8. Data Security", bg: "8. Сигурност на данните" }),
        paragraphs: [
          t({
            en: "We use industry-standard measures — including encrypted connections, hashed passwords, and access controls — to protect your personal data against unauthorized access, loss, or misuse.",
            bg: "Прилагаме стандартни за индустрията мерки — включително криптирани връзки, хеширани пароли и контрол на достъпа — за защита на личните ви данни от неоторизиран достъп, загуба или злоупотреба.",
          }),
        ],
      },
      {
        title: t({
          en: "9. Changes to This Policy",
          bg: "9. Промени в тази политика",
        }),
        paragraphs: [
          t({
            en: "We may update this Privacy Policy from time to time. Material changes will be announced on the Platform. Continued use after changes take effect constitutes acceptance of the updated Policy.",
            bg: "Възможно е периодично да актуализираме тази Политика за поверителност. Съществените промени ще бъдат обявени в Платформата. Продължаването на ползването след влизането в сила на промените се счита за приемане на актуализираната Политика.",
          }),
        ],
      },
      {
        title: t({ en: "10. Contact Us", bg: "10. Свържете се с нас" }),
        paragraphs: [
          t({
            en: "For questions about this Privacy Policy or to exercise your data protection rights, please reach out via our Contact page.",
            bg: "При въпроси относно настоящата Политика за поверителност или за да упражните правата си за защита на данните, моля свържете се с нас чрез страницата ни за контакт.",
          }),
        ],
      },
    ],
  },
} satisfies Dictionary;

export default privacyPolicyContent;
