import { t, type Dictionary } from "intlayer";

const checkinLobbyContent = {
  key: "checkin-lobby",
  content: {
    meta: {
      title: t({
        en: "Complete your check-in | SeasideHoliday",
        bg: "Завършете настаняването си | Почивка на морето",
      }),
      description: t({
        en: "Add guest details for your upcoming stay. Secure and encrypted.",
        bg: "Добавете данни за гостите за предстоящия ви престой. Сигурно и криптирано.",
      }),
    },
    loading: t({
      en: "Loading your check-in…",
      bg: "Зареждане на настаняването ви…",
    }),
    invalid: {
      title: t({
        en: "This check-in link is invalid or has expired",
        bg: "Тази връзка за настаняване е невалидна или е изтекла",
      }),
      description: t({
        en: "Please ask the person who made the booking for an up-to-date link, or contact our support team.",
        bg: "Моля, помолете лицето, направило резервацията, за актуална връзка, или се свържете с екипа ни за поддръжка.",
      }),
    },
    heading: t({
      en: "Complete your check-in",
      bg: "Завършете настаняването си",
    }),
    guestsCompleted: t({
      en: "{filled} of {total} guests completed",
      bg: "{filled} от {total} гости попълнени",
    }),
    encryptionNotice: t({
      en: "This page is served over an encrypted connection and your ID and EGN numbers are encrypted at rest. Share this link with your travel companions so each guest can add their own details.",
      bg: "Тази страница се предоставя през криптирана връзка, а вашите номера на документ за самоличност и ЕГН се съхраняват криптирани. Споделете тази връзка с вашите спътници, за да могат да добавят собствените си данни.",
    }),
    guestLabel: t({ en: "Guest {n}", bg: "Гост {n}" }),
    guestDetailsLabel: t({
      en: "Guest {n} details",
      bg: "Данни за гост {n}",
    }),
    addDetails: t({ en: "Add details", bg: "Добави данни" }),
    remove: t({ en: "Remove", bg: "Премахни" }),
  },
} satisfies Dictionary;

export default checkinLobbyContent;
