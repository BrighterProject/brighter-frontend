import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

export interface OfferCardData {
  title: string;
  location: string;
  roomType?: string;
  roomDetails?: string;
  bedInfo?: string;
  scarcity?: string;
  perk?: string;
  description?: string;
  rating: string;
  ratingScore: string;
  priceLabel?: string;
  price: string;
  priceNote?: string;
  cta: string;
  image?: string | null;
  onClick?: () => void;
}

interface OfferCardProps {
  data: OfferCardData;
}

export function OfferCard({ data }: OfferCardProps) {
  return (
    <>
      {/* Mobile */}
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
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs tracking-wide text-foreground">
              <MapPin className="size-2.5" />
              {data.location}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-snug tracking-wide text-foreground">
              {data.price}
            </span>
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

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md md:block">
        <div className="flex flex-row">
          <div
            className="relative w-1/3 shrink-0 cursor-pointer self-stretch"
            onClick={data.onClick}
          >
            {data.image ? (
              <img
                src={data.image}
                alt={data.title}
                className="absolute inset-0 size-full object-cover p-2.5"
              />
            ) : (
              <div className="absolute inset-2.5 flex items-center justify-center rounded-md bg-primary/8">
                <span className="select-none text-6xl font-black text-primary/15">
                  {data.title[0]}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-row gap-1.5 overflow-hidden px-2.5 py-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-col gap-0.5">
                <p
                  className="cursor-pointer text-base font-medium leading-normal text-primary hover:underline"
                  onClick={data.onClick}
                >
                  {data.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-primary underline">
                    <MapPin className="size-2.5" />
                    {data.location}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                {(data.roomType || data.roomDetails || data.bedInfo) && (
                  <div className="flex items-center gap-1">
                    <div className="h-10 w-px rotate-90 border-t border-border" />
                    <div className="flex flex-col pb-0.5">
                      {data.roomType && (
                        <p className="text-xs font-medium leading-normal tracking-wide text-foreground">
                          {data.roomType}
                        </p>
                      )}
                      {data.roomDetails && (
                        <p className="text-xs leading-normal tracking-wide text-foreground">
                          {data.roomDetails}
                        </p>
                      )}
                      {data.bedInfo && (
                        <p className="text-xs leading-normal tracking-wide text-foreground">
                          {data.bedInfo}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {data.scarcity && (
                  <p className="text-xs leading-normal tracking-wide text-destructive">
                    {data.scarcity}
                  </p>
                )}
                {data.perk && (
                  <p className="text-xs leading-normal tracking-wide text-chart-4">
                    {data.perk}
                  </p>
                )}
              </div>

              {data.description && (
                <div className="relative max-h-20 overflow-hidden pr-8">
                  <p className="text-xs leading-normal tracking-wide text-foreground">
                    {data.description}
                  </p>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[79%] to-card to-[93%]" />
                </div>
              )}
            </div>

            <div className="flex flex-col items-end justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm leading-normal tracking-tight text-foreground">
                  {data.rating}
                </span>
                <span className="flex size-8 items-center justify-center rounded-sm bg-primary text-sm text-primary-foreground">
                  {data.ratingScore}
                </span>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <div className="flex flex-col items-end text-right leading-none">
                  {data.priceLabel && (
                    <span className="text-xs leading-normal tracking-wide text-muted-foreground">
                      {data.priceLabel}
                    </span>
                  )}
                  <span className="text-xl font-semibold leading-tight tracking-tight text-foreground">
                    {data.price}
                  </span>
                  {data.priceNote && (
                    <span className="text-xs leading-normal tracking-wide text-muted-foreground">
                      {data.priceNote}
                    </span>
                  )}
                </div>
                <Button
                  size="default"
                  className="gap-2 rounded-sm"
                  onClick={data.onClick}
                >
                  {data.cta}
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
