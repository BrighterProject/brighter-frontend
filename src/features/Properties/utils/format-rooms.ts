import { useIntlayer } from "react-intlayer";
import type { BedType, RoomEntry, RoomType } from "../api/types";

export function useFormatRooms() {
  const c = useIntlayer("rooms");

  return function formatRoomSummary(rooms: RoomEntry[]): {
    roomLine: string;
    bedLine: string;
  } {
    const roomLine = rooms
      .filter((r) => r.count > 0)
      .map((r) => `${r.count} ${c.roomTypes[r.room_type as RoomType](r.count).value as string}`)
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
      .map(([type, count]) => `${count} ${c.bedTypes[type](count).value as string}`)
      .join(", ");

    const bedsLabel = c.beds(totalBeds).value as string;
    const bedLine =
      totalBeds === 0
        ? ""
        : totalBeds === 1
          ? bedDetails
          : `${totalBeds} ${bedsLabel} (${bedDetails})`;

    return { roomLine, bedLine };
  };
}
