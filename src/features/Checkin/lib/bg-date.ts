/**
 * Helpers for a day-first (Bulgarian) date-of-birth input.
 *
 * The form and API keep dates in ISO `YYYY-MM-DD`; these functions convert to
 * and from the digit buffer behind a `DD.MM.YYYY` masked text input so the
 * canonical stored value never changes.
 */
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** ISO `YYYY-MM-DD` -> `DDMMYYYY` digit buffer (empty string if not ISO). */
export const isoToBgDigits = (iso: string): string => {
  const m = ISO_RE.exec(iso);
  return m ? `${m[3]}${m[2]}${m[1]}` : "";
};

/** Render a digit buffer as `DD.MM.YYYY`, inserting dots as the user types. */
export const formatBgDigits = (digits: string): string => {
  const d = digits.replace(/\D/g, "").slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join(".");
};

/**
 * `DDMMYYYY` digit buffer -> ISO `YYYY-MM-DD`, or `""` when incomplete or not a
 * real calendar date (e.g. 31.02). Callers store the ISO result, so a partial
 * or invalid entry yields `""` and fails the schema's date validation.
 */
export const bgDigitsToIso = (digits: string): string => {
  const d = digits.replace(/\D/g, "");
  if (d.length !== 8) return "";
  const day = d.slice(0, 2);
  const month = d.slice(2, 4);
  const year = d.slice(4, 8);
  const iso = `${year}-${month}-${day}`;
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() + 1 !== Number(month) ||
    parsed.getUTCDate() !== Number(day)
  ) {
    return "";
  }
  return iso;
};
