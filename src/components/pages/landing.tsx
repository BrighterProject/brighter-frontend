import { useIntlayer } from "react-intlayer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Search,
  CalendarDays,
  Users,
  ChevronDown,
  MapPin,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";

const HOTEL_IMAGE =
  "https://www.figma.com/api/mcp/asset/49762a67-8913-4fe4-b6e7-a8ca4864032c";

function OfferCard({
  content,
}: {
  content: ReturnType<typeof useIntlayer<"landing-page">>["offerCard"];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex flex-col sm:h-[268px] sm:flex-row">
        {/* Image */}
        <div className="relative h-48 w-full sm:h-full sm:w-[268px] sm:shrink-0">
          <img
            src={HOTEL_IMAGE}
            alt=""
            className="absolute inset-0 size-full object-cover sm:p-2.5"
          />
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-1.5 overflow-hidden p-4 sm:flex-row sm:gap-1.5 sm:px-2.5 sm:py-2.5">
          {/* Main content */}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {/* Header */}
            <div className="flex flex-col gap-0.5">
              <p className="text-lg font-medium leading-normal text-primary sm:text-base">
                {content.title}
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-sm text-primary underline sm:text-xs">
                  <MapPin className="size-3 sm:size-2.5" />
                  {content.location}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-primary underline sm:text-xs">
                  <UtensilsCrossed className="size-3 sm:size-2.5" />
                  {content.amenity}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <div className="h-10 w-px rotate-90 border-t border-border" />
                <div className="flex flex-col pb-0.5">
                  <p className="text-sm font-medium leading-normal tracking-wide text-foreground sm:text-xs">
                    {content.roomType}
                  </p>
                  <p className="text-sm leading-normal tracking-wide text-foreground sm:text-xs">
                    {content.roomDetails}
                  </p>
                  <p className="text-sm leading-normal tracking-wide text-foreground sm:text-xs">
                    {content.bedInfo}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-normal tracking-wide text-destructive sm:text-xs">
                {content.scarcity}
              </p>
              <p className="text-sm leading-normal tracking-wide text-chart-4 sm:text-xs">
                {content.perk}
              </p>
            </div>

            {/* Description with fade */}
            <div className="relative pr-8">
              <p className="text-sm leading-normal tracking-wide text-foreground sm:text-xs">
                {content.description}
              </p>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[79%] to-card to-[93%]" />
            </div>
          </div>

          {/* Side: rating + price — stacked below on mobile, side column on desktop */}
          <div className="flex items-center justify-between pt-3 sm:mt-0 sm:flex-col sm:items-end sm:justify-between sm:border-0 sm:pt-0">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <span className="text-sm leading-normal tracking-tight text-foreground">
                {content.rating}
              </span>
              <span className="flex size-8 items-center justify-center rounded-sm bg-primary text-sm text-primary-foreground">
                {content.ratingScore}
              </span>
            </div>

            {/* Price + CTA */}
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex flex-col items-end text-right leading-none">
                <span className="text-sm leading-normal tracking-wide text-muted-foreground sm:text-xs">
                  {content.priceLabel}
                </span>
                <span className="text-2xl font-semibold leading-[1.2] tracking-tight text-foreground sm:text-xl">
                  {content.price}
                </span>
                <span className="text-sm leading-normal tracking-wide text-muted-foreground sm:text-xs">
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
  );
}

export function Landing() {
  const content = useIntlayer("landing-page");

  return (
    <div className="flex flex-col items-center">
      {/* Hero + Search */}
      <div className="mt-6 flex w-full max-w-1/2 flex-col gap-2 px-3 md:gap-6 md:mt-20 md:px-4 lg:mt-24">
        {/* Title */}
        <div className="flex flex-col text-left">
          <h1 className="text-lg font-normal leading-normal text-foreground md:text-3xl md:font-semibold md:leading-none md:tracking-tight">
            {content.hero.titlePrefix}
            <span className="underline decoration-primary decoration-wavy decoration-[8%]">
              {content.hero.titleHighlight}
            </span>
            {content.hero.titleSuffix}
          </h1>
          <p className="mt-1 hidden text-base leading-normal text-muted-foreground md:block">
            {content.hero.subtitle}
          </p>
        </div>

        {/* Search Card */}
        <div className="relative flex flex-col gap-2 md:rounded-lg md:border md:border-border md:px-6 md:pb-12 md:pt-6 md:shadow-sm">
          {/* Destination input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={content.search.destination.value as string}
              className="h-[50px] pl-10 text-sm shadow-xs"
            />
          </div>

          {/* Date & Guest row */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            <div className="relative">
              <CalendarDays className="absolute left-2 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={content.search.checkIn.value as string}
                className="h-[50px] pl-9 text-sm shadow-xs"
                type="text"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
              />
            </div>
            <div className="relative">
              <CalendarDays className="absolute left-2 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={content.search.checkOut.value as string}
                className="h-[50px] pl-9 text-sm shadow-xs"
                type="text"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
              />
            </div>
            {/* Guests — 3rd col on desktop */}
            <div className="hidden h-[50px] items-center rounded-lg border border-border bg-background px-3 shadow-xs md:flex">
              <Users className="mr-2 size-5 text-muted-foreground" />
              <span className="flex-1 text-sm text-foreground">
                {content.search.guests}
              </span>
              <ChevronDown className="size-4 text-foreground" />
            </div>
          </div>

          {/* Guests — mobile only */}
          <div className="flex h-[50px] items-center rounded-lg border border-border bg-background px-3 shadow-xs md:hidden">
            <Users className="mr-2 size-5 text-muted-foreground" />
            <span className="flex-1 text-sm text-foreground">
              {content.search.guests}
            </span>
            <ChevronDown className="size-4 text-foreground" />
          </div>

          {/* Search button */}
          <Button
            size="lg"
            className="mt-2 h-12 w-full text-base md:absolute md:-bottom-6 md:left-1/2 md:mt-0 md:w-[300px] md:-translate-x-1/2"
          >
            {content.search.button}
          </Button>
        </div>
      </div>

      {/* Offers */}
      <div className="mt-12 flex w-full max-w-1/2 flex-col items-center gap-4 px-3 md:mt-20 md:px-4">
        <div className="flex flex-col items-center pb-0.5">
          <h2 className="text-xl font-semibold leading-[1.2] tracking-tight text-foreground">
            {content.offers.title}
          </h2>
          <p className="text-xs leading-normal text-muted-foreground md:text-sm md:tracking-tight">
            {content.offers.subtitle}
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <OfferCard content={content.offerCard} />
          <OfferCard content={content.offerCard} />
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-20" />
    </div>
  );
}
