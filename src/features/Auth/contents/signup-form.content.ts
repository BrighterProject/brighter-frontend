import { t, type Dictionary } from "intlayer";

const signupContent = {
  key: "signup",
  content: {
    meta: {
      title: t({
        en: "Sign Up | Create Your Account",
        bg: "Регистрация | Създайте своя профил",
      }),
      description: t({
        en: "Join us today! Fill out the form to create your account and get started.",
        bg: "Присъединете се към нас днес! Попълнете формата, за да създадете профил и да започнете.",
      }),
    },
    title: t({
      en: "Create your account",
      bg: "Създайте своя профил",
    }),
    description: t({
      en: "Fill in the form below to create your account",
      bg: "Попълнете формата по-долу, за да създадете профил",
    }),
    fields: {
      name: {
        label: t({ en: "Full Name", bg: "Пълно име" }),
        placeholder: t({ en: "John Doe", bg: "Иван Иванов" }),
      },
      email: {
        label: t({ en: "Email", bg: "Имейл" }),
        placeholder: t({ en: "m@example.com", bg: "mail@example.bg" }),
      },
      password: {
        label: t({ en: "Password", bg: "Парола" }),
        hint: t({
          en: "8+ characters, including at least one number and one symbol.",
          bg: "8+ символа, включително поне едно число и един символ.",
        }),
      },
      confirmPassword: {
        label: t({ en: "Confirm Password", bg: "Потвърдете паролата" }),
      },
    },
    button: {
      idle: t({ en: "Create Account", bg: "Създаване на профил" }),
      submitting: t({
        en: "Creating Account...",
        bg: "Създаване на профил...",
      }),
    },
    legal: {
      text: t({
        en: "By proceeding you are agreeing to our ",
        bg: "Продължавайки, вие се съгласявате с нашите ",
      }),
      link: t({ en: "Terms and Conditions", bg: "Общи условия" }),
    },
    separator: t({ en: "Or", bg: "Или" }),
    googleButton: t({
      en: "Continue with Google",
      bg: "Продължи с Google",
    }),
    loginPrompt: {
      text: t({ en: "Already have an account? ", bg: "Вече имате профил? " }),
      link: t({ en: "Sign in", bg: "Вход" }),
    },
    panel: {
      tagline: t({
        en: "Join the community.",
        bg: "Присъединете се към общността.",
      }),
      subtitle: t({
        en: "Create an account to start booking sports properties across Bulgaria.",
        bg: "Създайте профил, за да започнете да резервирате спортни обекти в цяла България.",
      }),
    },
  },
} satisfies Dictionary;

export default signupContent;
