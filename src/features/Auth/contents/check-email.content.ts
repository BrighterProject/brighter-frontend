import { t, type Dictionary } from "intlayer";

const checkEmailContent = {
  key: "check-email",
  content: {
    meta: {
      title: t({
        en: "Check Your Email",
        bg: "Проверете имейла си",
      }),
      description: t({
        en: "We've sent you a verification email. Please check your inbox.",
        bg: "Изпратихме ви имейл за потвърждение. Моля, проверете входящата си поща.",
      }),
    },
    title: t({
      en: "Check your email",
      bg: "Проверете имейла си",
    }),
    description: t({
      en: "We've sent a verification link to your email address. Click the link to activate your account.",
      bg: "Изпратихме линк за потвърждение на вашия имейл адрес. Натиснете линка, за да активирате акаунта си.",
    }),
    spamHint: t({
      en: "Can't find it? Check your spam folder.",
      bg: "Не го намирате? Проверете папката за спам.",
    }),
    pricingRedirectHint: t({
      en: "After verifying, you'll be taken to choose a plan.",
      bg: "След потвърждението ще бъдете насочени към избор на план.",
    }),
    loginPrompt: {
      text: t({
        en: "Already verified? ",
        bg: "Вече потвърдихте? ",
      }),
      link: t({ en: "Sign in", bg: "Вход" }),
    },
    panel: {
      tagline: t({
        en: "Almost there!",
        bg: "Почти сте готови!",
      }),
      subtitle: t({
        en: "One last step — verify your email to start booking.",
        bg: "Последна стъпка — потвърдете имейла си, за да започнете да резервирате.",
      }),
    },
  },
} satisfies Dictionary;

export default checkEmailContent;
