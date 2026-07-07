import { t, type Dictionary } from "intlayer";

const guestFormContent = {
  key: "guest-form",
  content: {
    fields: {
      firstName: t({ en: "First name", bg: "Собствено име" }),
      middleName: t({ en: "Middle name", bg: "Презиме" }),
      lastName: t({ en: "Last name", bg: "Фамилия" }),
      dateOfBirth: t({ en: "Date of birth", bg: "Дата на раждане" }),
      gender: t({ en: "Gender", bg: "Пол" }),
      citizenship: t({ en: "Citizenship", bg: "Гражданство" }),
      documentIssuingCountry: t({
        en: "Document issuing country",
        bg: "Държава, издала документа",
      }),
      documentType: t({ en: "Document type", bg: "Вид документ" }),
      documentNumber: t({ en: "Document number", bg: "Номер на документ" }),
      egn: t({ en: "EGN (national ID number)", bg: "ЕГН" }),
    },
    select: t({ en: "Select…", bg: "Изберете…" }),
    genderOptions: {
      male: t({ en: "Male", bg: "Мъж" }),
      female: t({ en: "Female", bg: "Жена" }),
      other: t({ en: "Other", bg: "Друго" }),
    },
    documentTypeOptions: {
      idCard: t({ en: "ID card", bg: "Лична карта" }),
      passport: t({ en: "Passport", bg: "Паспорт" }),
    },
    consent: {
      prefix: t({ en: "I agree to the", bg: "Съгласен съм с" }),
      terms: t({ en: "Terms of Service", bg: "Общите условия" }),
      and: t({ en: "and", bg: "и" }),
      privacy: t({ en: "Privacy Policy", bg: "Политиката за поверителност" }),
    },
    errors: {
      duplicateSlot: t({
        en: "All guest slots for this booking are already filled.",
        bg: "Всички места за гости за тази резервация вече са запълнени.",
      }),
      generic: t({
        en: "We could not save these details. Please double-check the ID number, EGN, date of birth, and gender, then try again.",
        bg: "Не успяхме да запазим тези данни. Моля, проверете отново номера на документа, ЕГН, датата на раждане и пола, след което опитайте отново.",
      }),
    },
    submit: t({ en: "Save details", bg: "Запази данните" }),
    cancel: t({ en: "Cancel", bg: "Отказ" }),
  },
} satisfies Dictionary;

export default guestFormContent;
