import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Map, X } from "lucide-react";
import { useLocale } from "react-intlayer";
import apiClient from "@/lib/api-client";
import { useDebounce } from "@/hooks/useDebounce";

interface Destination {
  kind: "oblast" | "settlement";
  code: string;
  name: string;
  tvm: string | null;
}

export interface DestinationSelection {
  name: string;
  settlement_ekatte?: string;
  region_code?: string;
}

interface SettlementComboboxProps {
  value: string;
  /** Set when a settlement is currently selected. */
  ekatte?: string;
  /** Set when an oblast (region) is currently selected. */
  regionCode?: string;
  onChange: (selection: DestinationSelection) => void;
  placeholder?: string;
  className?: string;
}

async function fetchDestinations(q: string, lang: string): Promise<Destination[]> {
  const res = await apiClient.get<Destination[]>("/regions/search", {
    params: { q, lang, limit: 10 },
  });
  return res.data;
}

function displayName(d: Destination): string {
  return d.tvm ? `${d.tvm} ${d.name}` : d.name;
}

export function SettlementCombobox({
  value,
  ekatte,
  regionCode,
  onChange,
  placeholder = "Enter destination",
  className = "",
}: SettlementComboboxProps) {
  const { locale } = useLocale();
  const lang = locale === "en" ? "en" : "bg";
  const oblastLabel = lang === "en" ? "Region" : "Област";

  const hasSelection = !!(ekatte || regionCode);

  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value changes (e.g. on mount from URL)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const debouncedQuery = useDebounce(inputValue, 350);
  const shouldSearch = debouncedQuery.length >= 1 && !hasSelection;

  const { data: suggestions = [] } = useQuery({
    queryKey: ["destinations", "search", debouncedQuery, lang],
    queryFn: () => fetchDestinations(debouncedQuery, lang),
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
    if (hasSelection) {
      // User is typing again — clear the selected destination
      onChange({ name: v });
    }
    setOpen(true);
  };

  const handleSelect = (d: Destination) => {
    const name = displayName(d);
    setInputValue(name);
    onChange(
      d.kind === "oblast"
        ? { name, region_code: d.code }
        : { name, settlement_ekatte: d.code },
    );
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    onChange({ name: "" });
    setOpen(false);
  };

  const showDropdown = open && !hasSelection && suggestions.length > 0;

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
      {(inputValue || hasSelection) && (
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
          {suggestions.map((d) => {
            const isOblast = d.kind === "oblast";
            const Icon = isOblast ? Map : MapPin;
            return (
              <li key={`${d.kind}-${d.code}`}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(d)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1">
                    {d.tvm && (
                      <span className="text-muted-foreground">{d.tvm} </span>
                    )}
                    {d.name}
                  </span>
                  {isOblast && (
                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {oblastLabel}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
