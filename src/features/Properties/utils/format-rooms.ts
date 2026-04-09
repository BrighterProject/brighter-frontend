import type { BedType, RoomEntry, RoomType } from "../api/types";

const FALLBACK_LOCALE = "bg";

type RoomPluralForms = { one: Record<RoomType, string>; other: Record<RoomType, string> };

const ROOM_TYPE_LABELS: Record<string, RoomPluralForms> = {
  en: {
    one: {
      bedroom: "bedroom",
      living_room: "living room",
      kitchen: "kitchen",
      bathroom: "bathroom",
      studio: "studio",
    },
    other: {
      bedroom: "bedrooms",
      living_room: "living rooms",
      kitchen: "kitchens",
      bathroom: "bathrooms",
      studio: "studios",
    },
  },
  bg: {
    one: {
      bedroom: "спалня",
      living_room: "хол",
      kitchen: "кухня",
      bathroom: "баня",
      studio: "студио",
    },
    other: {
      bedroom: "спални",
      living_room: "хола",
      kitchen: "кухни",
      bathroom: "бани",
      studio: "студиа",
    },
  },
  ru: {
    one: {
      bedroom: "спальня",
      living_room: "гостиная",
      kitchen: "кухня",
      bathroom: "ванная комната",
      studio: "студия",
    },
    other: {
      bedroom: "спальни",
      living_room: "гостиные",
      kitchen: "кухни",
      bathroom: "ванные комнаты",
      studio: "студии",
    },
  },
};

type PluralForms = { one: Record<BedType, string>; other: Record<BedType, string> };

const BED_TYPE_LABELS: Record<string, PluralForms> = {
  en: {
    one: {
      single: "single bed",
      double: "double bed",
      queen: "queen bed",
      king: "king bed",
      sofa_bed: "sofa bed",
      bunk: "bunk bed",
      crib: "crib",
    },
    other: {
      single: "single beds",
      double: "double beds",
      queen: "queen beds",
      king: "king beds",
      sofa_bed: "sofa beds",
      bunk: "bunk beds",
      crib: "cribs",
    },
  },
  bg: {
    one: {
      single: "единично легло",
      double: "двойно легло",
      queen: "легло queen",
      king: "легло king",
      sofa_bed: "диван-легло",
      bunk: "двуетажно легло",
      crib: "бебешко легло",
    },
    other: {
      single: "единични легла",
      double: "двойни легла",
      queen: "легла queen",
      king: "легла king",
      sofa_bed: "дивани-легла",
      bunk: "двуетажни легла",
      crib: "бебешки легла",
    },
  },
  ru: {
    one: {
      single: "односпальная кровать",
      double: "двуспальная кровать",
      queen: "кровать queen",
      king: "кровать king",
      sofa_bed: "диван-кровать",
      bunk: "двухъярусная кровать",
      crib: "детская кроватка",
    },
    other: {
      single: "односпальные кровати",
      double: "двуспальные кровати",
      queen: "кровати queen",
      king: "кровати king",
      sofa_bed: "диваны-кровати",
      bunk: "двухъярусные кровати",
      crib: "детские кроватки",
    },
  },
};

const BEDS_LABEL: Record<string, { one: string; other: string }> = {
  en: { one: "bed", other: "beds" },
  bg: { one: "легло", other: "легла" },
  ru: { one: "кровать", other: "кроватей" },
};

const pluralRulesCache = new Map<string, Intl.PluralRules>();
function pluralCategory(locale: string, n: number): "one" | "other" {
  if (!pluralRulesCache.has(locale)) {
    pluralRulesCache.set(locale, new Intl.PluralRules(locale));
  }
  const category = pluralRulesCache.get(locale)!.select(n);
  return category === "one" ? "one" : "other";
}

function forLocale<T>(map: Record<string, T>, locale: string): T {
  return map[locale] ?? map[FALLBACK_LOCALE];
}

export function formatRoomSummary(
  rooms: RoomEntry[],
  locale: string,
): { roomLine: string; bedLine: string } {
  const roomLabelForms = forLocale(ROOM_TYPE_LABELS, locale);
  const bedLabelForms = forLocale(BED_TYPE_LABELS, locale);
  const bedsLabelForms = forLocale(BEDS_LABEL, locale);

  const roomLine = rooms
    .filter((r) => r.count > 0)
    .map((r) => `${r.count} ${roomLabelForms[pluralCategory(locale, r.count)][r.room_type]}`)
    .join(" • ");

  const mergedBeds: Partial<Record<BedType, number>> = {};
  let totalBeds = 0;
  for (const room of rooms) {
    for (const bed of room.beds ?? []) {
      totalBeds += bed.count;
      mergedBeds[bed.bed_type] = (mergedBeds[bed.bed_type] ?? 0) + bed.count;
    }
  }

  const bedDetails = (Object.entries(mergedBeds) as [BedType, number][])
    .map(([type, count]) => {
      const form = pluralCategory(locale, count);
      return `${count} ${bedLabelForms[form][type]}`;
    })
    .join(", ");

  const totalForm = pluralCategory(locale, totalBeds);
  const bedLine =
    totalBeds === 1
      ? bedDetails
      : totalBeds > 1
        ? `${totalBeds} ${bedsLabelForms[totalForm]} (${bedDetails})`
        : "";

  return { roomLine, bedLine };
}
