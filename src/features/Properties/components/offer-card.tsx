import type { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";
import { MapPin, UtensilsCrossed, ArrowRight } from "lucide-react";

const HOTEL_IMAGE =
  "https://www.figma.com/api/mcp/asset/49762a67-8913-4fe4-b6e7-a8ca4864032c";

type OfferCardContent = ReturnType<
  typeof useIntlayer<"landing-page">
>["offerCard"];

interface OfferCardProps {
  content: OfferCardContent;
}

export function OfferCard({ content }: OfferCardProps) {
  return (
    <>
      {/* Mobile */}
      <div className="flex w-full gap-2.5 md:hidden">
        <div className="relative w-2/6 shrink-0 self-stretch">
          <img
            src={HOTEL_IMAGE}
            alt=""
            className="absolute inset-0 size-full rounded-md object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-sm font-semibold leading-snug tracking-wide text-foreground">
            {content.title}
          </p>

          <div className="flex items-center gap-1">
            <span className="flex size-5 items-center justify-center rounded-sm bg-primary text-[10px] text-primary-foreground">
              {content.ratingScore}
            </span>
            <span className="text-xs leading-normal tracking-wide text-foreground">
              {content.rating}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs tracking-wide text-foreground">
              <MapPin className="size-2.5" />
              {content.location}
            </span>
            <span className="inline-flex items-center gap-1 text-xs tracking-wide text-foreground">
              <UtensilsCrossed className="size-2.5" />
              {content.amenity}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-snug tracking-wide text-foreground">
              {content.price}
            </span>
            <span className="text-[10px] leading-normal tracking-wide text-secondary">
              {content.scarcity}
            </span>
            <span className="text-[10px] leading-normal tracking-wide text-chart-4">
              {content.perk}
            </span>
          </div>

          <div className="relative max-h-16 overflow-hidden">
            <p className="text-xs leading-normal tracking-wide text-foreground">
              {content.description}
            </p>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[79%] to-background to-[93%]" />
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card shadow-sm md:block">
        <div className="flex flex-row">
          <div className="relative w-1/3 shrink-0 self-stretch">
            <img
              src={HOTEL_IMAGE}
              alt=""
              className="absolute inset-0 size-full object-cover p-2.5"
            />
          </div>

          <div className="flex flex-1 flex-row gap-1.5 overflow-hidden px-2.5 py-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-col gap-0.5">
                <p className="text-base font-medium leading-normal text-primary">
                  {content.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-primary underline">
                    <MapPin className="size-2.5" />
                    {content.location}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-primary underline">
                    <UtensilsCrossed className="size-2.5" />
                    {content.amenity}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <div className="h-10 w-px rotate-90 border-t border-border" />
                  <div className="flex flex-col pb-0.5">
                    <p className="text-xs font-medium leading-normal tracking-wide text-foreground">
                      {content.roomType}
                    </p>
                    <p className="text-xs leading-normal tracking-wide text-foreground">
                      {content.roomDetails}
                    </p>
                    <p className="text-xs leading-normal tracking-wide text-foreground">
                      {content.bedInfo}
                    </p>
                  </div>
                </div>
                <p className="text-xs leading-normal tracking-wide text-destructive">
                  {content.scarcity}
                </p>
                <p className="text-xs leading-normal tracking-wide text-chart-4">
                  {content.perk}
                </p>
              </div>

              <div className="relative max-h-12 overflow-hidden pr-8">
                <p className="text-xs leading-normal tracking-wide text-foreground">
                  {content.description}
                </p>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[79%] to-card to-[93%]" />
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm leading-normal tracking-tight text-foreground">
                  {content.rating}
                </span>
                <span className="flex size-8 items-center justify-center rounded-sm bg-primary text-sm text-primary-foreground">
                  {content.ratingScore}
                </span>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <div className="flex flex-col items-end text-right leading-none">
                  <span className="text-xs leading-normal tracking-wide text-muted-foreground">
                    {content.priceLabel}
                  </span>
                  <span className="text-xl font-semibold leading-tight tracking-tight text-foreground">
                    {content.price}
                  </span>
                  <span className="text-xs leading-normal tracking-wide text-muted-foreground">
                    {content.priceNote}
                  </span>
                </div>
                <Button size="default" className="gap-2 rounded-sm">
                  {content.cta}
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
