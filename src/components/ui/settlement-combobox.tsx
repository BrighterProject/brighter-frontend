import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, X } from "lucide-react";
import { useLocale } from "react-intlayer";
import apiClient from "@/lib/api-client";
import { useDebounce } from "@/hooks/useDebounce";

interface Settlement {
  ekatte: string;
  tvm: string | null;
  name: string;
}

interface SettlementComboboxProps {
  value: string;
  ekatte: string | undefined;
  onChange: (name: string, ekatte: string | undefined) => void;
  placeholder?: string;
  className?: string;
}

async function fetchSettlements(q: string, lang: string): Promise<Settlement[]> {
  const res = await apiClient.get<Settlement[]>("/regions/settlements/search", {
    params: { q, lang, limit: 10 },
  });
  return res.data;
}

export function SettlementCombobox({
  value,
  ekatte,
  onChange,
  placeholder = "Enter destination",
  className = "",
}: SettlementComboboxProps) {
  const { locale } = useLocale();
  const lang = locale === "en" ? "en" : "bg";

  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value changes (e.g. on mount from URL)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const debouncedQuery = useDebounce(inputValue, 350);
  const shouldSearch = debouncedQuery.length >= 1 && !ekatte;

  const { data: suggestions = [] } = useQuery({
    queryKey: ["settlements", "search", debouncedQuery, lang],
    queryFn: () => fetchSettlements(debouncedQuery, lang),
    enabled: shouldSearch,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputValue(v);
    if (ekatte) {
      // User is typing again — clear the selected ekatte
      onChange(v, undefined);
    }
    setOpen(true);
  };

  const handleSelect = (s: Settlement) => {
    const name = s.tvm ? `${s.tvm} ${s.name}` : s.name;
    setInputValue(name);
    onChange(name, s.ekatte);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    onChange("", undefined);
    setOpen(false);
  };

  const showDropdown = open && !ekatte && suggestions.length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={inputValue}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="h-full w-full rounded-md border border-input bg-background pl-9 pr-8 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        autoComplete="off"
      />
      {(inputValue || ekatte) && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          <X className="size-3.5" />
        </button>
      )}

      {showDropdown && (
        <ul className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
          {suggestions.map((s) => (
            <li key={s.ekatte}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(s)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                <span>
                  {s.tvm && (
                    <span className="text-muted-foreground">{s.tvm} </span>
                  )}
                  {s.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
