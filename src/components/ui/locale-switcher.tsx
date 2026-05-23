import { useLocation } from "@tanstack/react-router";
import {
  getHTMLTextDir,
  getLocaleName,
  getPathWithoutLocale,
  getPrefix,
} from "intlayer";
import type { FC } from "react";
import { useLocale } from "react-intlayer";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LocalizedLink, type To } from "./localized-link";

/**
 * Map locales → flag emoji
 * (edit to match your supported locales)
 */
const LOCALE_FLAGS: Record<string, string> = {
  en: "🇬🇧",
  bg: "🇧🇬",
};

export const LocaleSwitcher: FC = () => {
  const { pathname } = useLocation();
  const { availableLocales, locale, setLocale } = useLocale();

  const pathWithoutLocale = getPathWithoutLocale(pathname);

  const currentFlag = LOCALE_FLAGS[locale] ?? "🌐";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-base leading-none"
          aria-label="Change language"
        >
          {currentFlag}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        {availableLocales.map((localeEl) => (
          <DropdownMenuItem key={localeEl} asChild>
            <LocalizedLink
              aria-current={localeEl === locale ? "page" : undefined}
              onClick={() => setLocale(localeEl)}
              params={{ locale: getPrefix(localeEl).localePrefix }}
              to={pathWithoutLocale as To}
              search={(prev) => prev}
              className="flex w-full cursor-pointer items-center gap-2"
            >
              <span className="text-base">
                {LOCALE_FLAGS[localeEl] ?? "🌐"}
              </span>

              <span
                dir={getHTMLTextDir(localeEl)}
                lang={localeEl}
                className="capitalize"
              >
                {getLocaleName(localeEl)}
              </span>
            </LocalizedLink>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
