import { useIntlayer, useLocale } from "react-intlayer";
import { Fragment } from "react";
import { SearchCard } from "@/components/ui/search-card";
import { OfferCard } from "@Properties/components/offer-card";
import { useProperties } from "@Properties/api/hooks";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { useFormatRooms } from "@Properties/utils/format-rooms";
import type { PropertyType } from "@Properties/api/types";

function getRatingLabel(score: string, locale: string): string {
  const n = parseFloat(score);
  const isBg = locale === "bg";
  if (n >= 9) return isBg ? "Изключително" : "Exceptional";
  if (n >= 8) return isBg ? "Отлично" : "Excellent";
  if (n >= 7) return isBg ? "Добро" : "Good";
  return isBg ? "Задоволително" : "Satisfactory";
}

export function Landing() {
  const content = useIntlayer("landing-page");
  const roomsC = useIntlayer("rooms");
  const { locale } = useLocale();
  const formatRooms = useFormatRooms();
  const navigate = useLocalizedNavigate();
  const { data: allProperties, isLoading } = useProperties({ status: "active" });
  const properties = allProperties?.slice(0, 3) ?? [];

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full max-w-3xl flex-col gap-8 px-3 py-6 md:gap-14 md:px-6 md:py-16">
        {/* Hero + Search */}
        <div className="flex flex-col gap-2 md:gap-6">
          <div className="flex flex-col text-left">
            <h1 className="text-base font-normal leading-normal text-foreground md:text-3xl md:font-semibold md:leading-none md:tracking-tight">
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

          <SearchCard content={content.search} />
        </div>

        {/* Offers */}
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col items-center pb-0.5 pt-3">
            <h2 className="text-xl font-display font-semibold leading-tight tracking-tight text-foreground">
              {content.offers.title}
            </h2>
            <p className="text-xs leading-normal text-muted-foreground md:text-sm md:tracking-tight">
              {content.offers.subtitle}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 md:gap-4">
          {isLoading ? (
            <>
              <div className="h-28 w-full animate-pulse rounded-lg bg-muted md:h-36" />
              <div className="h-28 w-full animate-pulse rounded-lg bg-muted md:h-36" />
              <div className="h-28 w-full animate-pulse rounded-lg bg-muted md:h-36" />
            </>
          ) : (
            properties.map((property, i) => {
              const { roomLine, bedLine } = formatRooms(property.rooms);
              return (
              <Fragment key={property.id}>
                <OfferCard
                  data={{
                    image: property.thumbnail ?? null,
                    title: property.name,
                    description: property.description,
                    location: property.city,
                    roomType: roomsC.propertyTypes[property.property_type as PropertyType].value as string,
                    roomDetails: roomLine,
                    bedInfo: bedLine,
                    bedrooms: property.bedrooms,
                    maxGuests: property.max_guests,
                    totalReviews: property.total_reviews,
                    rating: getRatingLabel(property.rating, locale),
                    ratingScore: parseFloat(property.rating).toFixed(1),
                    price: `${property.currency} ${parseFloat(property.price_per_night).toFixed(0)}`,
                    priceNote: content.offerCard.priceNote as string,
                    cta: content.offerCard.cta as string,
                    onClick: () =>
                      navigate({
                        to: "/properties/$propertyId",
                        propertyId: property.id,
                      }),
                  }}
                />
                {i < properties.length - 1 && (
                  <div className="h-px w-full bg-border md:hidden" />
                )}
              </Fragment>
            );
            })
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
