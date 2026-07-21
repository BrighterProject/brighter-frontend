import { useEffect, useState } from "react";
import { hasAnalyticsConsent, onConsentChange } from "@/lib/cookie-consent";

interface UmamiConfig {
  src: string;
  websiteId: string;
}

const SCRIPT_ID = "umami-analytics";

/** Umami config from env, or `null` when not fully configured (dev/preview). */
export function umamiConfig(): UmamiConfig | null {
  const src = import.meta.env.VITE_UMAMI_SRC?.trim();
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID?.trim();
  if (!src || !websiteId) return null;
  return { src, websiteId };
}

/**
 * Loads the self-hosted Umami analytics script once analytics consent is
 * granted. Umami is cookieless, but we still gate it behind the cookie-consent
 * banner. No-op when the Umami env vars are unset (local dev / preview) or
 * while consent is withheld. Reacts to consent granted after mount without a
 * page reload.
 */
export function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasAnalyticsConsent());
    return onConsentChange((consent) => setConsented(consent.analytics));
  }, []);

  useEffect(() => {
    if (!consented) return;
    const config = umamiConfig();
    if (!config) return;
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.defer = true;
    script.src = config.src;
    script.dataset.websiteId = config.websiteId;
    document.head.appendChild(script);
  }, [consented]);

  return null;
}
