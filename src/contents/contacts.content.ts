import { t, type Dictionary } from "intlayer";

const contactsContent = {
  key: "contacts",
  content: {
    meta: {
      title: t({
        en: "Contact Us | Brighter.BG",
        bg: "Контакти | Brighter.BG",
      }),
      description: t({
        en: "Get in touch with the Brighter.BG team. We'd love to hear from you.",
        bg: "Свържете се с екипа на Brighter.BG. Ще се радваме да чуем от вас.",
      }),
    },
    title: t({ en: "Contact Us", bg: "Свържете се с нас" }),
    subtitle: t({
      en: "Have a question, want to list your property, or just want to say hi? We'd love to hear from you.",
      bg: "Имате въпрос, искате да добавите обект или просто искате да кажете здравей? Ще се радваме да чуем от вас.",
    }),
    channels: {
      email: {
        label: t({ en: "Email", bg: "Имейл" }),
        description: t({
          en: "For general inquiries and property listings",
          bg: "За общи запитвания и добавяне на обекти",
        }),
        value: "contact@brighter.bg",
      },
      github: {
        label: t({ en: "GitHub", bg: "GitHub" }),
        description: t({
          en: "Report bugs, request features, or contribute",
          bg: "Докладвайте бъгове, предложете функции или допринесете",
        }),
        value: "github.com/BrighterProject",
      },
      location: {
        label: t({ en: "Location", bg: "Местоположение" }),
        description: t({
          en: "Based in Burgas, Bulgaria",
          bg: "Базирани в Бургас, България",
        }),
      },
    },
    form: {
      title: t({ en: "Send Us a Message", bg: "Изпратете ни съобщение" }),
      name: {
        label: t({ en: "Name", bg: "Име" }),
        placeholder: t({ en: "Your name", bg: "Вашето име" }),
      },
      email: {
        label: t({ en: "Email", bg: "Имейл" }),
        placeholder: t({ en: "you@example.com", bg: "вие@example.bg" }),
      },
      subject: {
        label: t({ en: "Subject", bg: "Тема" }),
        placeholder: t({ en: "What's this about?", bg: "Относно какво е?" }),
      },
      message: {
        label: t({ en: "Message", bg: "Съобщение" }),
        placeholder: t({
          en: "Tell us more...",
          bg: "Разкажете ни повече...",
        }),
      },
      submit: t({ en: "Send Message", bg: "Изпрати съобщение" }),
      sending: t({ en: "Sending...", bg: "Изпращане..." }),
      success: t({
        en: "Message sent! We'll get back to you soon.",
        bg: "Съобщението е изпратено! Ще се свържем с вас скоро.",
      }),
      error: t({
        en: "Failed to send message. Please try again later.",
        bg: "Неуспешно изпращане. Моля, опитайте по-късно.",
      }),
    },
  },
} satisfies Dictionary;

export default contactsContent;
