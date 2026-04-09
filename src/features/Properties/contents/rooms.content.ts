import { t, enu, type Dictionary } from "intlayer";

const roomsContent = {
  key: "rooms",
  content: {
    propertyTypes: {
      apartment: t({ en: "Apartment", bg: "Апартамент", ru: "Апартаменты" }),
      house: t({ en: "House", bg: "Къща", ru: "Дом" }),
      villa: t({ en: "Villa", bg: "Вила", ru: "Вилла" }),
      hotel: t({ en: "Hotel", bg: "Хотел", ru: "Отель" }),
      hostel: t({ en: "Hostel", bg: "Хостел", ru: "Хостел" }),
      guesthouse: t({ en: "Guest house", bg: "Къща за гости", ru: "Гостевой дом" }),
      room: t({ en: "Room", bg: "Стая", ru: "Комната" }),
      other: t({ en: "Other", bg: "Друго", ru: "Другое" }),
    },
    roomTypes: {
      bedroom: enu({
        "1": t({ en: "bedroom", bg: "спалня", ru: "спальня" }),
        ">1": t({ en: "bedrooms", bg: "спални", ru: "спальни" }),
      }),
      living_room: enu({
        "1": t({ en: "living room", bg: "хол", ru: "гостиная" }),
        ">1": t({ en: "living rooms", bg: "хола", ru: "гостиные" }),
      }),
      kitchen: enu({
        "1": t({ en: "kitchen", bg: "кухня", ru: "кухня" }),
        ">1": t({ en: "kitchens", bg: "кухни", ru: "кухни" }),
      }),
      bathroom: enu({
        "1": t({ en: "bathroom", bg: "баня", ru: "ванная" }),
        ">1": t({ en: "bathrooms", bg: "бани", ru: "ванные" }),
      }),
      studio: enu({
        "1": t({ en: "studio", bg: "студио", ru: "студия" }),
        ">1": t({ en: "studios", bg: "студиа", ru: "студии" }),
      }),
    },
    bedTypes: {
      single: enu({
        "1": t({ en: "single bed", bg: "единично легло", ru: "односпальная кровать" }),
        ">1": t({ en: "single beds", bg: "единични легла", ru: "односпальные кровати" }),
      }),
      double: enu({
        "1": t({ en: "double bed", bg: "двойно легло", ru: "двуспальная кровать" }),
        ">1": t({ en: "double beds", bg: "двойни легла", ru: "двуспальные кровати" }),
      }),
      queen: enu({
        "1": t({ en: "queen bed", bg: "легло queen", ru: "кровать queen" }),
        ">1": t({ en: "queen beds", bg: "легла queen", ru: "кровати queen" }),
      }),
      king: enu({
        "1": t({ en: "king bed", bg: "легло king", ru: "кровать king" }),
        ">1": t({ en: "king beds", bg: "легла king", ru: "кровати king" }),
      }),
      sofa_bed: enu({
        "1": t({ en: "sofa bed", bg: "диван-легло", ru: "диван-кровать" }),
        ">1": t({ en: "sofa beds", bg: "дивани-легла", ru: "диваны-кровати" }),
      }),
      bunk: enu({
        "1": t({ en: "bunk bed", bg: "двуетажно легло", ru: "двухъярусная кровать" }),
        ">1": t({ en: "bunk beds", bg: "двуетажни легла", ru: "двухъярусные кровати" }),
      }),
      crib: enu({
        "1": t({ en: "crib", bg: "бебешко легло", ru: "детская кроватка" }),
        ">1": t({ en: "cribs", bg: "бебешки легла", ru: "детские кроватки" }),
      }),
    },
    beds: enu({
      "1": t({ en: "bed", bg: "легло", ru: "кровать" }),
      ">1": t({ en: "beds", bg: "легла", ru: "кровати" }),
    }),
  },
} satisfies Dictionary;

export default roomsContent;
