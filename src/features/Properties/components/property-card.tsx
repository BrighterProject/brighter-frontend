import { useIntlayer } from "react-intlayer";
import { MapPin, Star, Users } from "lucide-react";
import type { PropertyListItem } from "../api/types";

interface PropertyCardProps {
  property: PropertyListItem;
  onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const c = useIntlayer("properties-list");

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
          <div className="flex size-full items-center justify-center bg-primary/10">
            <span className="select-none text-6xl font-black text-primary/20">
              {property.name[0]}
            </span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

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

        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {property.city}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {property.capacity}
          </span>
        </div>
      </div>
    </article>
  );
}
