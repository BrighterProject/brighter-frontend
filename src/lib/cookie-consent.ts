const STORAGE_KEY = "cookie-consent";
const CONSENT_EVENT = "cookie-consent-change";

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
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<CookieConsent>(CONSENT_EVENT, { detail: consent }),
    );
  }
  return consent;
}

/** Gate for any analytics/tracking script — must be checked before loading them. */
export function hasAnalyticsConsent(): boolean {
  return getCookieConsent()?.analytics === true;
}

/**
 * Subscribe to consent decisions made after mount (e.g. via the banner), so
 * consent-gated scripts can start without a full page reload. Returns an
 * unsubscribe function. No-op during SSR.
 */
export function onConsentChange(
  listener: (consent: CookieConsent) => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => {
    listener((event as CustomEvent<CookieConsent>).detail);
  };
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}
