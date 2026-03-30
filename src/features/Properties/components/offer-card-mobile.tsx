import { MapPin, BedDouble, Users } from "lucide-react";
import type { OfferCardData } from "./offer-card-types";

interface Props {
  data: OfferCardData;
}

export function OfferCardMobile({ data }: Props) {
  return (
    <div
      className="flex w-full gap-2.5 md:hidden"
      onClick={data.onClick}
      role={data.onClick ? "button" : undefined}
    >
      <div className="relative w-2/6 shrink-0 self-stretch">
        {data.image ? (
          <img
            src={data.image}
            alt={data.title}
            className="absolute inset-0 size-full rounded-md object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-primary/10">
            <span className="select-none text-3xl font-black text-primary/25">
              {data.title[0]}
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm font-semibold leading-snug tracking-wide text-foreground">
          {data.title}
        </p>

        <div className="flex items-center gap-1">
          <span className="flex size-5 items-center justify-center rounded-sm bg-primary text-[10px] text-primary-foreground">
            {data.ratingScore}
          </span>
          <span className="text-xs leading-normal tracking-wide text-foreground">
            {data.rating}
          </span>
          {data.totalReviews !== undefined && (
            <span className="text-[10px] leading-normal text-muted-foreground">
              ({data.totalReviews})
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs tracking-wide text-foreground">
            <MapPin className="size-2.5" />
            {data.location}
          </span>
          {data.roomType && (
            <span className="text-xs text-muted-foreground">{data.roomType}</span>
          )}
        </div>

        {(data.bedrooms !== undefined || data.maxGuests !== undefined) && (
          <div className="flex items-center gap-2">
            {data.bedrooms !== undefined && (
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <BedDouble className="size-2.5" />
                {data.bedrooms}
              </span>
            )}
            {data.maxGuests !== undefined && (
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <Users className="size-2.5" />
                {data.maxGuests}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-snug tracking-wide text-foreground">
            {data.price}
          </span>
          {data.priceNote && (
            <span className="text-[10px] leading-normal tracking-wide text-muted-foreground">
              {data.priceNote}
            </span>
          )}
          {data.scarcity && (
            <span className="text-[10px] leading-normal tracking-wide text-destructive">
              {data.scarcity}
            </span>
          )}
          {data.perk && (
            <span className="text-[10px] leading-normal tracking-wide text-chart-4">
              {data.perk}
            </span>
          )}
        </div>

        {data.description && (
          <div className="relative max-h-16 overflow-hidden">
            <p className="text-xs leading-normal tracking-wide text-foreground">
              {data.description}
            </p>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[79%] to-background to-[93%]" />
          </div>
        )}
      </div>
    </div>
  );
}
