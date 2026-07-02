export interface CountryOption {
  code: string;
  name: string;
}

/**
 * ISO 3166-1 alpha-2 codes offered in the booking guest-country selector.
 * "XK" (Kosovo) is a user-assigned code with no official localized name; it
 * resolves back to the code, which is acceptable for the dropdown.
 */
export const COUNTRY_CODES: readonly string[] = [
  "AF", "AL", "DZ", "AD", "AO", "AR", "AM", "AU", "AT", "AZ", "BH", "BD",
  "BY", "BE", "BA", "BR", "BG", "KH", "CA", "CL", "CN", "CO", "HR", "CY",
  "CZ", "DK", "EG", "EE", "ET", "FI", "FR", "GE", "DE", "GH", "GR", "HU",
  "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "JP", "JO", "KZ", "KE",
  "XK", "KW", "LV", "LB", "LY", "LI", "LT", "LU", "MY", "MT", "MX", "MD",
  "MC", "ME", "MA", "NL", "NZ", "NG", "MK", "NO", "PK", "PS", "PH", "PL",
  "PT", "QA", "RO", "RU", "SA", "RS", "SG", "SK", "SI", "ZA", "KR", "ES",
  "SE", "CH", "SY", "TW", "TH", "TN", "TR", "UA", "AE", "GB", "US", "UZ",
  "VN",
];

/**
 * Return `locale` if it is a structurally valid BCP 47 string, else `undefined`.
 *
 * A non-string (e.g. `undefined` when locale storage has not hydrated) passed as
 * an element of an `Intl` locales array throws `TypeError: invalid element in
 * locales argument`; an invalid string throws `RangeError`. Both cases fall back
 * to `undefined` (host default locale), which the `Intl` APIs accept safely.
 */
function safeLocale(locale: unknown): string | undefined {
  if (typeof locale !== "string") {
    return undefined;
  }
  try {
    Intl.getCanonicalLocales(locale);
    return locale;
  } catch {
    return undefined;
  }
}

/**
 * Build a region-name resolver for `locale`, or `null` when the runtime lacks
 * `Intl.DisplayNames` (e.g. iOS Safari < 14.5, some in-app webviews). Returning
 * `null` lets callers fall back to raw ISO codes instead of throwing during
 * render.
 */
function createRegionResolver(locale: string | undefined): ((code: string) => string) | null {
  if (typeof Intl === "undefined" || typeof Intl.DisplayNames !== "function") {
    return null;
  }
  try {
    const displayNames = new Intl.DisplayNames(locale ? [locale] : undefined, {
      type: "region",
    });
    return (code: string): string => {
      try {
        return displayNames.of(code) ?? code;
      } catch {
        return code;
      }
    };
  } catch {
    return null;
  }
}

/**
 * Localize and alphabetically sort the guest-country options.
 *
 * Never throws: unsupported `Intl.DisplayNames` falls back to ISO codes, and a
 * malformed `locale` falls back to the host default collation.
 *
 * Args:
 *     locale: BCP 47 locale tag used for country names and sort order. May be
 *         `null`/`undefined` (e.g. before locale storage hydrates), in which
 *         case the host default locale is used.
 *
 * Returns:
 *     Country options sorted ascending by display name.
 */
export function buildCountryOptions(
  locale: string | null | undefined,
): CountryOption[] {
  const validLocale = safeLocale(locale);
  const resolve = createRegionResolver(validLocale);
  return COUNTRY_CODES.map((code) => ({
    code,
    name: resolve ? resolve(code) : code,
  })).sort((a, b) => a.name.localeCompare(b.name, validLocale));
}
