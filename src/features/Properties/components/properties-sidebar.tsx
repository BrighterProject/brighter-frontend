import { useState } from "react";
import { X } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CollapsibleSection } from "./collapsible-section";
import {
  AMENITY_CATEGORIES,
  AMENITY_PREVIEW_COUNT,
} from "./amenity-taxonomy";
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
  onPriceChange: (range: [number, number]) => void;
  onToggleArray: (
    key: "propertyTypes" | "popularFilters" | "amenities",
    value: string,
  ) => void;
  onClear: () => void;
}

export function PropertiesSidebar({
  filters,
  hasActiveFilters,
  onSet,
  onPriceChange,
  onToggleArray,
  onClear,
}: PropertiesSidebarProps) {
  const c = useIntlayer("properties-list");
  const propertyTypeLabels = c.filters.propertyType as Record<string, string>;
  const popularFilterLabels = c.filters.popularFilters as Record<string, string>;
  const amenityContent = c.filters.amenities as {
    label: string;
    showMore: string;
    showLess: string;
    categories: Record<string, string>;
    items: Record<string, string>;
  };
  const [expandedGroups, setExpandedGroups] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const toggleGroup = (key: string) =>
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

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
            onValueChange={([min, max]) => onPriceChange([min, max])}
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

      <CollapsibleSection title={amenityContent.label} defaultOpen={false}>
        <div className="flex flex-col gap-4">
          {AMENITY_CATEGORIES.map((category) => {
            const isExpanded = expandedGroups.has(category.key);
            const visible = isExpanded
              ? category.amenities
              : category.amenities.slice(0, AMENITY_PREVIEW_COUNT);
            const hasMore = category.amenities.length > AMENITY_PREVIEW_COUNT;
            return (
              <div key={category.key} className="flex flex-col gap-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {amenityContent.categories[category.key]}
                </h3>
                {visible.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex cursor-pointer items-center gap-2.5"
                  >
                    <Checkbox
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={() =>
                        onToggleArray("amenities", amenity)
                      }
                    />
                    <span className="text-sm text-foreground">
                      {amenityContent.items[amenity]}
                    </span>
                  </label>
                ))}
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(category.key)}
                    className="self-start text-xs font-medium text-primary hover:underline"
                  >
                    {isExpanded
                      ? amenityContent.showLess
                      : amenityContent.showMore}
                  </button>
                )}
              </div>
            );
          })}
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
