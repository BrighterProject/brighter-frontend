import { t, type Dictionary } from "intlayer";

const termsContent = {
  key: "terms",
  content: {
    meta: {
      title: t({
        en: "Terms and Conditions | SeasideHoliday",
        bg: "Общи условия | Почивка на морето",
      }),
      description: t({
        en: "Terms and Conditions for using the SeasideHoliday property booking platform.",
        bg: "Общи условия за ползване на платформата за резервации на имоти Почивка на морето.",
      }),
    },
    title: t({ en: "Terms and Conditions", bg: "Общи условия" }),
    updated: t({
      en: "Last updated: 6 July 2026",
      bg: "Последна актуализация: 6 юли 2026 г.",
    }),
    intro: t({
      en: "These Terms and Conditions (“Terms”) govern your use of SeasideHoliday (“the Platform”, “we”, “us”), an online platform for listing and booking short-term rental properties in Bulgaria. By creating an account or using the Platform, you agree to these Terms. This is a generic template pending review by qualified legal counsel and does not constitute legal advice.",
      bg: "Настоящите Общи условия („Условията“) уреждат ползването на Почивка на морето („Платформата“, „ние“), онлайн платформа за обявяване и резервиране на имоти за краткосрочно настаняване в България. Със създаването на профил или ползването на Платформата, вие се съгласявате с тези Условия. Настоящият текст е примерен и подлежи на преглед от квалифициран юрист; той не представлява правен съвет.",
    }),
    sections: [
      {
        title: t({ en: "1. Definitions", bg: "1. Дефиниции" }),
        paragraphs: [
          t({
            en: "“Guest” means a user who searches for or books a property through the Platform. “Owner” means a user who lists one or more properties for booking. “Listing” means a property published on the Platform. “Booking” means a confirmed reservation of a Listing for specified dates.",
            bg: "„Гост“ означава потребител, който търси или резервира имот чрез Платформата. „Собственик“ означава потребител, който обявява един или повече имоти за резервация. „Обява“ означава имот, публикуван в Платформата. „Резервация“ означава потвърдено запазване на Обява за определени дати.",
          }),
        ],
      },
      {
        title: t({
          en: "2. Account Registration",
          bg: "2. Регистрация на профил",
        }),
        paragraphs: [
          t({
            en: "You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. You must provide accurate and current information when registering.",
            bg: "За създаване на профил е необходимо да сте навършили 18 години. Вие носите отговорност за опазването на поверителността на данните си за вход и за всички действия, извършени чрез профила ви. Длъжни сте да предоставите точна и актуална информация при регистрация.",
          }),
        ],
      },
      {
        title: t({
          en: "3. Property Listings and Owner Obligations",
          bg: "3. Обяви на имоти и задължения на собствениците",
        }),
        paragraphs: [
          t({
            en: "Owners are solely responsible for the accuracy of their Listings, including descriptions, photos, pricing, and availability. Owners must hold any registration, permit, or tourism-registry number required under the Bulgarian Tourism Act (Закон за туризма) for the type of accommodation offered, and must keep this information current on the Platform.",
            bg: "Собствениците носят пълна отговорност за точността на своите Обяви, включително описания, снимки, цени и наличност. Собствениците трябва да притежават съответната регистрация, разрешение или номер от Единния туристически регистър, изискван съгласно Закона за туризма за вида предлагано настаняване, и да поддържат тази информация актуална в Платформата.",
          }),
          t({
            en: "The Platform acts solely as an intermediary connecting Guests and Owners. We are not a party to the accommodation contract formed between Guest and Owner and do not guarantee the quality, safety, or legality of any Listing.",
            bg: "Платформата действа единствено като посредник, свързващ Гости и Собственици. Ние не сме страна по договора за настаняване, сключен между Гост и Собственик, и не гарантираме качеството, безопасността или законосъобразността на дадена Обява.",
          }),
        ],
      },
      {
        title: t({
          en: "4. Bookings and Payments",
          bg: "4. Резервации и плащания",
        }),
        paragraphs: [
          t({
            en: "Bookings are confirmed once payment (or the required deposit) is processed through our payment provider, Stripe. We do not store your full card details. The accepted payment methods and deposit percentage for a given Listing are shown before you confirm a Booking.",
            bg: "Резервациите се потвърждават след обработка на плащането (или изискуемия депозит) чрез нашия доставчик на платежни услуги, Stripe. Ние не съхраняваме пълните данни на картата ви. Приетите начини на плащане и процентът на депозита за конкретна Обява се показват преди потвърждаване на Резервацията.",
          }),
          t({
            en: "Cancellation terms (free, moderate, or strict) are set individually per Listing and are displayed to the Guest before booking. Refunds, where applicable, are processed according to the cancellation policy in effect at the time of booking.",
            bg: "Условията за анулиране (безплатна, умерена или строга) се задават индивидуално за всяка Обява и се показват на Госта преди резервацията. Възстановяванията на суми, когато е приложимо, се извършват съгласно политиката за анулиране, валидна към момента на резервацията.",
          }),
        ],
      },
      {
        title: t({ en: "5. User Conduct", bg: "5. Поведение на потребителите" }),
        paragraphs: [
          t({
            en: "You agree not to: (a) post false, misleading, or fraudulent Listings or reviews; (b) attempt to circumvent the Platform's booking or payment process; (c) use the Platform for any unlawful purpose; or (d) interfere with the security or proper functioning of the Platform.",
            bg: "Вие се задължавате да не: (а) публикувате неверни, подвеждащи или измамни Обяви или отзиви; (б) заобикаляте процеса на резервация или плащане на Платформата; (в) използвате Платформата за незаконни цели; или (г) нарушавате сигурността или правилното функциониране на Платформата.",
          }),
        ],
      },
      {
        title: t({
          en: "6. Intellectual Property",
          bg: "6. Права на интелектуална собственост",
        }),
        paragraphs: [
          t({
            en: "The Platform's software, design, and branding are owned by us or our licensors. Owners retain ownership of content they upload (photos, descriptions) but grant us a license to display it on the Platform for the purpose of operating the service.",
            bg: "Софтуерът, дизайнът и марката на Платформата са собственост на нас или на нашите лицензодатели. Собствениците запазват правата си върху качваното от тях съдържание (снимки, описания), но ни предоставят лиценз да го показваме в Платформата с цел предоставяне на услугата.",
          }),
        ],
      },
      {
        title: t({
          en: "7. Limitation of Liability",
          bg: "7. Ограничение на отговорността",
        }),
        paragraphs: [
          t({
            en: "To the maximum extent permitted by Bulgarian law, we are not liable for indirect, incidental, or consequential damages arising from your use of the Platform, or from the conduct of any Guest or Owner. Nothing in these Terms limits liability that cannot be limited under mandatory Bulgarian consumer-protection law (Закон за защита на потребителите).",
            bg: "До максималната степен, позволена от българското законодателство, ние не носим отговорност за непреки, случайни или последващи вреди, произтичащи от използването на Платформата или от поведението на който и да е Гост или Собственик. Нищо в настоящите Условия не ограничава отговорност, която не може да бъде ограничена съгласно императивните норми на Закона за защита на потребителите.",
          }),
        ],
      },
      {
        title: t({
          en: "8. Dispute Resolution and Governing Law",
          bg: "8. Разрешаване на спорове и приложимо право",
        }),
        paragraphs: [
          t({
            en: "These Terms are governed by the laws of the Republic of Bulgaria. Any dispute that cannot be resolved amicably shall be referred to the competent Bulgarian courts. Consumers may also file a complaint with the Commission for Consumer Protection (Комисия за защита на потребителите, kzp.bg) or use the EU Online Dispute Resolution platform at ec.europa.eu/consumers/odr.",
            bg: "Настоящите Условия се уреждат от законодателството на Република България. Всеки спор, който не може да бъде разрешен доброволно, се отнася до компетентния български съд. Потребителите могат също да подадат жалба до Комисията за защита на потребителите (kzp.bg) или да използват платформата на ЕС за онлайн решаване на спорове на ec.europa.eu/consumers/odr.",
          }),
        ],
      },
      {
        title: t({
          en: "9. Changes to These Terms",
          bg: "9. Промени в настоящите Условия",
        }),
        paragraphs: [
          t({
            en: "We may update these Terms from time to time. Material changes will be announced on the Platform. Continued use after changes take effect constitutes acceptance of the updated Terms.",
            bg: "Възможно е периодично да актуализираме настоящите Условия. Съществените промени ще бъдат обявени в Платформата. Продължаването на ползването след влизането в сила на промените се счита за приемане на актуализираните Условия.",
          }),
        ],
      },
      {
        title: t({ en: "10. Contact Us", bg: "10. Свържете се с нас" }),
        paragraphs: [
          t({
            en: "For questions about these Terms, please reach out via our Contact page.",
            bg: "При въпроси относно настоящите Условия, моля свържете се с нас чрез страницата ни за контакт.",
          }),
        ],
      },
    ],
  },
} satisfies Dictionary;

export default termsContent;
