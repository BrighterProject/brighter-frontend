/**
 * Bulgarian EGN (national ID) mod-11 checksum validation.
 *
 * Mirrors the authoritative backend validator in bookings-ms (`app/egn.py`);
 * this is fast client-side feedback only — the backend remains the source of
 * truth (it additionally cross-checks the EGN-encoded DOB/gender, which cannot
 * be validated here).
 */
const WEIGHTS = [2, 4, 8, 5, 10, 9, 7, 3, 6] as const;

export const isValidEGN = (egn: string): boolean => {
  if (!/^\d{10}$/.test(egn)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(egn.charAt(i), 10) * WEIGHTS[i];
  }
  let remainder = sum % 11;
  if (remainder === 10) remainder = 0;
  return remainder === Number.parseInt(egn.charAt(9), 10);
};
