import type { BedType, RoomEntry, RoomType } from "../api/types";

const FALLBACK_LOCALE = "bg";

const ROOM_TYPE_LABELS: Record<string, Record<RoomType, string>> = {
  en: {
    bedroom: "bedroom",
    living_room: "living room",
    kitchen: "kitchen",
    bathroom: "bathroom",
    studio: "studio",
  },
  bg: {
    bedroom: "спалня",
    living_room: "хол",
    kitchen: "кухня",
    bathroom: "баня",
    studio: "студио",
  },
  ru: {
    bedroom: "спальня",
    living_room: "гостиная",
    kitchen: "кухня",
    bathroom: "ванная комната",
    studio: "студия",
  },
};

const BED_TYPE_LABELS: Record<string, Record<BedType, string>> = {
  en: {
    single: "single bed",
    double: "double bed",
    queen: "queen bed",
    king: "king bed",
    sofa_bed: "sofa bed",
    bunk: "bunk bed",
    crib: "crib",
  },
  bg: {
    single: "единично легло",
    double: "двойно легло",
    queen: "легло queen",
    king: "легло king",
    sofa_bed: "диван-легло",
    bunk: "двуетажно легло",
    crib: "бебешко легло",
  },
  ru: {
    single: "односпальная кровать",
    double: "двуспальная кровать",
    queen: "кровать queen",
    king: "кровать king",
    sofa_bed: "диван-кровать",
    bunk: "двухъярусная кровать",
    crib: "детская кроватка",
  },
};

const BEDS_LABEL: Record<string, string> = {
  en: "beds",
  bg: "легла",
  ru: "кроватей",
};

function forLocale<T>(map: Record<string, T>, locale: string): T {
  return map[locale] ?? map[FALLBACK_LOCALE];
}

export function formatRoomSummary(
  rooms: RoomEntry[],
  locale: string,
): { roomLine: string; bedLine: string } {
  const roomLabels = forLocale(ROOM_TYPE_LABELS, locale);
  const bedLabels = forLocale(BED_TYPE_LABELS, locale);
  const bedsLabel = forLocale(BEDS_LABEL, locale);

  const roomLine = rooms
    .filter((r) => r.count > 0)
    .map((r) => `${r.count} ${roomLabels[r.room_type]}`)
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
    .map(([type, count]) => `${count} ${bedLabels[type]}`)
    .join(", ");

  const bedLine =
    totalBeds === 1
      ? bedDetails
      : totalBeds > 1
        ? `${totalBeds} ${bedsLabel} (${bedDetails})`
        : "";

  return { roomLine, bedLine };
}
