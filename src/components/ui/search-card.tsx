import { useState, useRef, useEffect } from "react";
import { Search, CalendarDays, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuestsSelect } from "@/components/ui/guests-select";
import {
  DateRangePicker,
  parseDateParam,
  isoDate,
} from "@/components/ui/date-range-picker";
import { useSearchParams, type SearchParams } from "@/hooks/useSearchParams";

interface SearchCardContent {
  destination: { value: string };
  dates: { value: string };
  button: React.ReactNode;
}

interface SearchCardProps {
  content: SearchCardContent;
  defaultValues?: SearchParams;
  variant?: "default" | "compact";
}

function formatDateShort(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function SearchCard({
  content,
  defaultValues,
  variant = "default",
}: SearchCardProps) {
  const isCompact = variant === "compact";
  const { navigate } = useSearchParams();

  const [city, setCity] = useState(defaultValues?.city ?? "");
  const [checkIn, setCheckIn] = useState<string | undefined>(
    defaultValues?.checkIn,
  );
  const [checkOut, setCheckOut] = useState<string | undefined>(
    defaultValues?.checkOut,
  );
  const [adults, setAdults] = useState(defaultValues?.adults ?? 1);
  const [children, setChildren] = useState(defaultValues?.children ?? 0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarError, setCalendarError] = useState("");
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar on outside click
  useEffect(() => {
    if (!calendarOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calendarOpen]);

  const dateLabel =
    checkIn && checkOut
      ? `${formatDateShort(checkIn)} – ${formatDateShort(checkOut)}`
      : checkIn
        ? `${formatDateShort(checkIn)} – ?`
        : (content.dates.value as string);

  const hasDates = !!(checkIn && checkOut);

  const handleSearch = () => {
    navigate({
      city: city.trim() || undefined,
      checkIn,
      checkOut,
      adults: adults > 1 ? adults : undefined,
      children: children > 0 ? children : undefined,
    });
    setCalendarOpen(false);
    setMobileExpanded(false);
  };

  const mobileSummary = [
    city || (content.destination.value as string),
    checkIn && checkOut
      ? `${formatDateShort(checkIn)} – ${formatDateShort(checkOut)}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  if (isCompact) {
    const dateSection = (fullWidth: boolean) => (
      <div
        className={`relative ${fullWidth ? "w-full" : "w-48 shrink-0"}`}
        ref={calendarRef}
      >
        <button
          type="button"
          onClick={() => setCalendarOpen((o) => !o)}
          className={`flex h-10 w-full items-center gap-2 rounded-md border px-3 text-sm transition-colors ${
            hasDates
              ? "border-primary text-foreground"
              : "border-input text-muted-foreground"
          } bg-background focus:outline-none focus:ring-2 focus:ring-ring`}
        >
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-left">{dateLabel}</span>
          {hasDates && (
            <X
              className="size-3.5 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setCheckIn(undefined);
                setCheckOut(undefined);
                setCalendarError("");
              }}
            />
          )}
        </button>

        {calendarOpen && (
          <div className="absolute left-0 top-10 z-50 w-[calc(100vw-2rem)] sm:w-80">
            <DateRangePicker
              value={{
                checkIn: parseDateParam(checkIn),
                checkOut: parseDateParam(checkOut),
              }}
              onChange={({ checkIn: ci, checkOut: co }) => {
                setCheckIn(ci ? isoDate(ci) : undefined);
                setCheckOut(co ? isoDate(co) : undefined);
              }}
              onError={setCalendarError}
            />
            {calendarError && (
              <p className="mt-1 rounded bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
                {calendarError}
              </p>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div>
        {/* Mobile only */}
        <div className="sm:hidden">
          {!mobileExpanded ? (
            /* Collapsed summary bar */
            <button
              type="button"
              onClick={() => setMobileExpanded(true)}
              className="flex w-full items-center gap-2"
            >
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-left text-sm text-muted-foreground">
                {mobileSummary}
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </button>
          ) : (
            /* Expanded: full-width stacked form */
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setMobileExpanded(false)}
                className="ml-auto flex items-center gap-1 text-xs text-muted-foreground"
              >
                <ChevronDown className="size-4 rotate-180" />
              </button>

              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={content.destination.value as string}
                  className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              {dateSection(true)}

              <GuestsSelect
                compact
                adults={adults}
                children={children}
                onAdultsChange={setAdults}
                onChildrenChange={setChildren}
              />

              <Button size="sm" onClick={handleSearch} className="h-10 w-full">
                {content.button}
              </Button>
            </div>
          )}
        </div>

        {/* Desktop: always visible inline form */}
        <div className="hidden sm:flex flex-wrap items-center gap-2">
          <div className="relative min-w-40 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={content.destination.value as string}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {dateSection(false)}

          <div className="w-44 shrink-0">
            <GuestsSelect compact />
          </div>

          <Button
            size="sm"
            onClick={handleSearch}
            className="h-10 shrink-0 px-5"
          >
            {content.button}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-4 md:rounded-lg md:border md:border-border md:px-6 md:pb-12 md:pt-6 md:shadow-sm">
      {/* Destination */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={content.destination.value as string}
          className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {/* Date range trigger */}
        <div className="relative col-span-2 md:col-span-1" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setCalendarOpen((o) => !o)}
            className={`flex h-11 w-full items-center gap-2 rounded-md border px-3 text-sm transition-colors ${
              hasDates
                ? "border-primary text-foreground"
                : "border-input text-muted-foreground"
            } bg-background focus:outline-none focus:ring-2 focus:ring-ring`}
          >
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-left">{dateLabel}</span>
            {hasDates && (
              <X
                className="size-3.5 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setCheckIn(undefined);
                  setCheckOut(undefined);
                  setCalendarError("");
                }}
              />
            )}
          </button>

          {/* Calendar dropdown */}
          {calendarOpen && (
            <div className="absolute left-0 top-12 z-50 w-[calc(100vw-2rem)] sm:w-80">
              <DateRangePicker
                value={{
                  checkIn: parseDateParam(checkIn),
                  checkOut: parseDateParam(checkOut),
                }}
                onChange={({ checkIn: ci, checkOut: co }) => {
                  setCheckIn(ci ? isoDate(ci) : undefined);
                  setCheckOut(co ? isoDate(co) : undefined);
                }}
                onError={setCalendarError}
              />
              {calendarError && (
                <p className="mt-1 rounded bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
                  {calendarError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Guests — hidden on mobile */}
        <div className="hidden md:col-span-2 md:block">
          <GuestsSelect
            adults={adults}
            children={children}
            onAdultsChange={setAdults}
            onChildrenChange={setChildren}
          />
        </div>
      </div>

      {/* Guests — mobile only */}
      <div className="md:hidden">
        <GuestsSelect
          adults={adults}
          children={children}
          onAdultsChange={setAdults}
          onChildrenChange={setChildren}
        />
      </div>

      <Button
        size="lg"
        onClick={handleSearch}
        className="h-12 w-full text-base md:absolute md:-bottom-6 md:left-1/2 md:mt-0 md:w-2/5 md:-translate-x-1/2"
      >
        {content.button}
      </Button>
    </div>
  );
}
