import { X } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CollapsibleSection } from "./collapsible-section";
import {
  type Filters,
  PRICE_MIN,
  PRICE_MAX,
  POPULAR_FILTER_KEYS,
  PROPERTY_TYPE_KEYS,
  RATING_OPTIONS,
  BEDROOM_OPTIONS,
} from "./properties-filters";

interface PropertiesSidebarProps {
  filters: Filters;
  hasActiveFilters: boolean;
  onSet: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onToggleArray: (
    key: "propertyTypes" | "popularFilters",
    value: string,
  ) => void;
  onClear: () => void;
}

export function PropertiesSidebar({
  filters,
  hasActiveFilters,
  onSet,
  onToggleArray,
  onClear,
}: PropertiesSidebarProps) {
  const c = useIntlayer("properties-list");
  const propertyTypeLabels = c.filters.propertyType as Record<string, string>;
  const popularFilterLabels = c.filters.popularFilters as Record<string, string>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">
          {c.filters.heading}
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <X className="size-3" />
            {c.filters.clear}
          </button>
        )}
      </div>

      <CollapsibleSection title={c.filters.price.label as string}>
        <div className="px-1">
          <Slider
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={10}
            value={[filters.min_price, filters.max_price]}
            onValueChange={([min, max]) => {
              onSet("min_price", min);
              onSet("max_price", max);
            }}
            className="mb-3"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {filters.min_price} {c.filters.price.currency}
            </span>
            <span>
              {filters.max_price === PRICE_MAX
                ? `${PRICE_MAX}+`
                : filters.max_price}{" "}
              {c.filters.price.currency}
            </span>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={c.filters.popularFilters.label as string}>
        <div className="flex flex-col gap-2.5">
          {POPULAR_FILTER_KEYS.map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={filters.popularFilters.includes(key)}
                onCheckedChange={() => onToggleArray("popularFilters", key)}
              />
              <span className="text-sm text-foreground">
                {popularFilterLabels[key]}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={c.filters.propertyType.label as string}>
        <div className="flex flex-col gap-2.5">
          {PROPERTY_TYPE_KEYS.map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={filters.propertyTypes.includes(key)}
                onCheckedChange={() => onToggleArray("propertyTypes", key)}
              />
              <span className="text-sm text-foreground">
                {propertyTypeLabels[key]}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={c.filters.rating.label as string}>
        <div className="flex flex-col gap-2">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() =>
                onSet("minRating", filters.minRating === r ? null : r)
              }
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                filters.minRating === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {r}
              {c.filters.rating.above}
            </button>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={c.filters.bedrooms.label as string}>
        <div className="flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() =>
                onSet("bedrooms", filters.bedrooms === n ? null : n)
              }
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                filters.bedrooms === n
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {n === 5 ? "5+" : n}
            </button>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
