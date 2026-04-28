import { useNavigate, useSearch } from "@tanstack/react-router";
import { getPrefix } from "intlayer";
import { useLocale } from "react-intlayer";
import { LOCALE_ROUTE } from "@/components/ui/localized-link";

export interface SearchParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
}

/**
 * Reads the current search params from the URL (works on any route that
 * declares validateSearch with these keys). Returns typed values and a
 * navigate helper that merges updates into the current params.
 */
export function useSearchParams(): SearchParams & {
  navigate: (updates: SearchParams) => void;
} {
  // useSearch is route-aware — it returns an empty object on routes that
  // haven't declared validateSearch, which is safe (all keys will be undefined).
  let params: SearchParams = {};
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    params = useSearch({ strict: false }) as SearchParams;
  } catch {
    // Outside a router context (e.g. tests) — ignore
  }

  const nav = useNavigate();
  const { locale } = useLocale();

  const navigate = (updates: SearchParams) => {
    const { localePrefix } = getPrefix(locale);
    nav({
      to: `/${LOCALE_ROUTE}/properties` as any,
      params: { locale: localePrefix } as any,
      search: updates as any,
    });
  };

  return { ...params, navigate };
}
