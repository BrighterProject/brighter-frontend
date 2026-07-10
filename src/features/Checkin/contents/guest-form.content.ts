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
      egn: t({
        en: "EGN / LNCh (personal ID number)",
        bg: "ЕГН / ЛНЧ",
      }),
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
      validation: {
        nameTooShort: t({
          en: "Must be at least 2 characters.",
          bg: "Трябва да съдържа поне 2 символа.",
        }),
        nameTooLong: t({
          en: "Must be at most 100 characters.",
          bg: "Трябва да съдържа най-много 100 символа.",
        }),
        nameInvalidFormat: t({
          en: "Only letters, spaces, hyphens, and apostrophes are allowed.",
          bg: "Разрешени са само букви, интервали, тирета и апострофи.",
        }),
        dobRequired: t({
          en: "Please enter a valid date.",
          bg: "Моля, въведете валидна дата.",
        }),
        dobFuture: t({
          en: "Date of birth cannot be in the future.",
          bg: "Датата на раждане не може да бъде в бъдещето.",
        }),
        dobTooEarly: t({
          en: "Please enter a valid date of birth.",
          bg: "Моля, въведете валидна дата на раждане.",
        }),
        countryInvalid: t({
          en: "Please select a country.",
          bg: "Моля, изберете държава.",
        }),
        selectionRequired: t({
          en: "Please select an option.",
          bg: "Моля, изберете опция.",
        }),
        documentNumberTooShort: t({
          en: "Must be at least 5 characters.",
          bg: "Трябва да съдържа поне 5 символа.",
        }),
        documentNumberTooLong: t({
          en: "Must be at most 20 characters.",
          bg: "Трябва да съдържа най-много 20 символа.",
        }),
        documentNumberInvalidFormat: t({
          en: "Only letters and numbers are allowed.",
          bg: "Разрешени са само букви и цифри.",
        }),
        middleNameRequiredBg: t({
          en: "Middle name is required for Bulgarian citizens.",
          bg: "Презимето е задължително за български граждани.",
        }),
        egnRequiredBg: t({
          en: "EGN/LNCh is required for documents issued in Bulgaria.",
          bg: "ЕГН/ЛНЧ е задължително за документи, издадени в България.",
        }),
        egnInvalidBg: t({
          en: "Invalid EGN/LNCh checksum or format.",
          bg: "Невалиден ЕГН/ЛНЧ (контролна сума или формат).",
        }),
      },
    },
    submit: t({ en: "Save details", bg: "Запази данните" }),
    cancel: t({ en: "Cancel", bg: "Отказ" }),
  },
} satisfies Dictionary;

export default guestFormContent;
