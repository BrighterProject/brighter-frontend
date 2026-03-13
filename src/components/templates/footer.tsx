import type { FC } from "react";
import { MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { LocalizedLink } from "@/components/ui/localized-link";

const Footer: FC = () => {
  const content = useIntlayer("footer");

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <LocalizedLink
              to="/"
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <MapPin className="size-4.5" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                {content.brand}
              </span>
            </LocalizedLink>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {content.tagline}
            </p>

            {/* Social icons */}
            <div className="mt-5 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              {content.sections.quickLinks.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <LocalizedLink
                  to="/properties"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {content.sections.quickLinks.properties}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  to="/bookings"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {content.sections.quickLinks.bookings}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  to="/about-us"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {content.sections.quickLinks.about}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* For Property Owners */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              {content.sections.forOwners.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <LocalizedLink
                  to="/about-us"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {content.sections.forOwners.listProperty}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  to="/contacts"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {content.sections.forOwners.contact}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              {content.sections.connect.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <LocalizedLink
                  to="/contacts"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {content.sections.connect.contact}
                </LocalizedLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{content.copyright}</span>
          <span className="text-muted-foreground/40">{content.builtWith}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
