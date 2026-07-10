/**
 * Bulgarian personal-number checksum validation: EGN (national ID) and LNCh
 * (personal number of a foreigner).
 *
 * Mirrors the authoritative backend validators in bookings-ms (`app/egn.py`);
 * this is fast client-side feedback only — the backend remains the source of
 * truth (it additionally cross-checks the EGN-encoded DOB/gender, which cannot
 * be validated here). LNCh encodes no birth date/gender.
 */
const EGN_WEIGHTS = [2, 4, 8, 5, 10, 9, 7, 3, 6] as const;
const LNCH_WEIGHTS = [21, 19, 17, 13, 11, 9, 7, 3, 1] as const;

export const isValidEGN = (egn: string): boolean => {
  if (!/^\d{10}$/.test(egn)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(egn.charAt(i), 10) * EGN_WEIGHTS[i];
  }
  let remainder = sum % 11;
  if (remainder === 10) remainder = 0;
  return remainder === Number.parseInt(egn.charAt(9), 10);
};

/**
 * LNCh (Личен номер на чужденец) mod-10 checksum. Issued by the MVR to
 * long-term-resident foreigners; independent of the EGN registry, so a value
 * may satisfy both checksums.
 */
export const isValidLNCh = (lnch: string): boolean => {
  if (!/^\d{10}$/.test(lnch)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(lnch.charAt(i), 10) * LNCH_WEIGHTS[i];
  }
  return sum % 10 === Number.parseInt(lnch.charAt(9), 10);
};

/**
 * Accepts a value that is a valid EGN or a valid LNCh — the two personal
 * numbers a Bulgarian-issued identity document may carry.
 */
export const isValidBgPersonalNumber = (value: string): boolean =>
  isValidEGN(value) || isValidLNCh(value);
