import { useEffect, useState } from "react";
import { Map as MapIcon, X } from "lucide-react";
import type { PropertyListItem } from "../api/types";
import { PropertyMap, pinPrice } from "./property-map";

type Locale = "bg" | "en" | "ru";

const LABELS: Record<Locale, { open: string; close: string; title: string }> = {
  bg: { open: "Виж на картата", close: "Затвори", title: "Имоти на картата" },
  en: { open: "Show map", close: "Close", title: "Properties on the map" },
  ru: { open: "На карте", close: "Закрыть", title: "Объекты на карте" },
};

function resolveLocale(locale: string | undefined): Locale {
  return locale === "en" || locale === "ru" ? locale : "bg";
}

interface PropertyMapModalProps {
  properties: PropertyListItem[];
  locale: string | undefined;
  onSelect: (id: string) => void;
}

export function PropertyMapModal({
  properties,
  locale,
  onSelect,
}: PropertyMapModalProps) {
  const [open, setOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const t = LABELS[resolveLocale(locale)];

  const hasCoords = properties.some(
    (p) => p.latitude != null && p.longitude != null,
  );

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!hasCoords) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
      >
        <MapIcon className="size-4 text-primary" />
        {t.open}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-display text-lg font-bold">{t.title}</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.close}
              className="flex size-9 items-center justify-center rounded-full hover:bg-muted"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1">
            {/* Card list — hover highlights the matching marker. */}
            <ul className="hidden w-80 shrink-0 overflow-y-auto border-r border-border md:block">
              {properties.map((p) => (
                <li
                  key={p.id}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onSelect(p.id)}
                  className={`flex cursor-pointer gap-3 border-b border-border p-3 transition-colors ${
                    hoveredId === p.id ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  {p.thumbnail && (
                    <img
                      src={p.thumbnail}
                      alt=""
                      className="size-16 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.city}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ★ {Number(p.rating).toFixed(1)} · {p.total_reviews}
                    </p>
                    <p className="text-sm font-bold">
                      {pinPrice(p)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <PropertyMap
              properties={properties}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onSelect={onSelect}
              className="min-h-0 flex-1"
            />
          </div>
        </div>
      )}
    </>
  );
}
