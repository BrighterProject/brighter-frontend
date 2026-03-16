import { MapPin, Users, Star } from "lucide-react";
import type { PropertyListItem, PropertyStatus } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: PropertyListItem;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const statusColors: Record<PropertyStatus, string> = {
    active: "#22c55e",
    inactive: "#ef4444",
    maintenance: "#f59e0b",
    pending_approval: "#6b7280",
  };

  return (
    <a
      href={`/properties/${property.id}`}
      className="block h-full w-full max-w-md transition-all hover:translate-y-[-4px]"
    >
      <Card className="h-full overflow-hidden p-0">
        <CardHeader className="relative block p-0">
          <AspectRatio ratio={1.268115942} className="overflow-hidden">
            <img
              src={property.thumbnail || "/placeholder-property.jpg"}
              alt={property.name}
              className="block size-full object-cover object-center"
            />
          </AspectRatio>

          {/* Status Badge */}
          <Badge
            style={{ backgroundColor: statusColors[property.status] }}
            className="absolute start-4 top-4 capitalize"
          >
            {property.status.replace("_", " ")}
          </Badge>
        </CardHeader>

        <CardContent className="flex h-full flex-col gap-3 p-5">
          {/* Title and Rating Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="line-clamp-1 text-xl font-bold">
                {property.name}
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3" />
                <span>{property.city}</span>
              </div>
            </div>
            {property.total_reviews > 0 && (
              <div className="flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-700">
                <Star className="size-3 fill-yellow-700" />
                {property.rating}
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between border-t pt-2">
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-xs leading-none text-muted-foreground">
                Hourly Rate
              </span>
              <div className="text-lg font-bold text-primary">
                {property.price_per_hour} {property.currency}
              </div>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Users className="size-4" />
              <span>Up to {property.capacity}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};
