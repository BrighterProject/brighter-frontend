import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Star, Users } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import type { PropertyListItem } from "../api/types";

const SPORT_COLORS: Record<string, string> = {
  football: "bg-green-500",
  basketball: "bg-orange-500",
  tennis: "bg-yellow-500",
  volleyball: "bg-blue-500",
  swimming: "bg-cyan-500",
  gym: "bg-purple-500",
  padel: "bg-pink-500",
  other: "bg-muted",
};

interface PropertyCardProps {
  property: PropertyListItem;
  onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const c = useIntlayer("properties-list");
  const primarySport = property.sport_types[0];
  const extraSports = property.sport_types.length - 2;

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {property.thumbnail ? (
          <img
            src={property.thumbnail}
            alt={property.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "flex size-full items-center justify-center",
              primarySport ? SPORT_COLORS[primarySport] : "bg-muted",
            )}
          >
            <span className="select-none text-6xl font-black text-white/20">
              {property.name[0]}
            </span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {property.is_indoor && (
            <Badge
              variant="secondary"
              className="bg-background/90 text-xs backdrop-blur-sm"
            >
              {c.card.indoor}
            </Badge>
          )}
        </div>

        {/* Rating */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
          <Star className="size-3 fill-yellow-500 text-yellow-500" />
          {Number(property.rating).toFixed(1)}
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 right-3">
          <span className="font-display text-xl font-bold text-white drop-shadow-md">
            {Number(property.price_per_hour).toFixed(0)}{" "}
            <span className="text-sm font-normal text-white/80">
              {property.currency}
              {c.card.perHour}
            </span>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="truncate font-display text-lg font-semibold text-foreground">
          {property.name}
        </h3>

        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          {property.city}
        </div>

        {/* Sport badges + capacity */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {property.sport_types.slice(0, 2).map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="text-xs font-medium"
              >
                {c.sports[s] ?? s}
              </Badge>
            ))}
            {extraSports > 0 && (
              <Badge variant="outline" className="text-xs">
                +{extraSports}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3" />
            {property.capacity}
          </div>
        </div>
      </div>
    </article>
  );
}
