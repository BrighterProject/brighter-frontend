import { useEffect, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/ui/localized-link";
import { getCookieConsent, setCookieConsent } from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const content = useIntlayer("consent-banner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
  }, []);

  if (!visible) return null;

  const decide = (analytics: boolean) => {
    setCookieConsent(analytics);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm sm:rounded-xl sm:border"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        {content.text}{" "}
        <LocalizedLink
          to="/privacy-policy"
          className="underline hover:text-foreground"
        >
          {content.link}
        </LocalizedLink>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => decide(false)}>
          {content.necessaryOnly}
        </Button>
        <Button size="sm" onClick={() => decide(true)}>
          {content.acceptAll}
        </Button>
      </div>
    </div>
  );
}
