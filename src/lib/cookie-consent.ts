const STORAGE_KEY = "cookie-consent";

export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  decidedAt: string;
}

export function getCookieConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CookieConsent) : null;
  } catch {
    return null;
  }
}

export function setCookieConsent(analytics: boolean): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    analytics,
    decidedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // localStorage unavailable (private browsing / quota) — consent won't persist across reloads
  }
  return consent;
}

/** Gate for any future analytics/tracking script — must be checked before loading them. */
export function hasAnalyticsConsent(): boolean {
  return getCookieConsent()?.analytics === true;
}
