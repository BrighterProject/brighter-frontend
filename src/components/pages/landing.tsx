import { useIntlayer } from "react-intlayer";
import { SearchCard } from "@/components/ui/search-card";
import {
  OfferCard,
  type OfferCardData,
} from "@Properties/components/offer-card";

export function Landing() {
  const content = useIntlayer("landing-page");

  const offerData: OfferCardData = {
    image:
      "https://www.figma.com/api/mcp/asset/49762a67-8913-4fe4-b6e7-a8ca4864032c",
    title: content.offerCard.title as string,
    location: content.offerCard.location as string,
    roomType: content.offerCard.roomType as string,
    roomDetails: content.offerCard.roomDetails as string,
    bedInfo: content.offerCard.bedInfo as string,
    scarcity: content.offerCard.scarcity as string,
    perk: content.offerCard.perk as string,
    description: content.offerCard.description as string,
    rating: content.offerCard.rating as string,
    ratingScore: content.offerCard.ratingScore as string,
    priceLabel: content.offerCard.priceLabel as string,
    price: content.offerCard.price as string,
    priceNote: content.offerCard.priceNote as string,
    cta: content.offerCard.cta as string,
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero + Search */}
      <div className="mt-3 flex w-full flex-col gap-2 px-3 md:mt-20 md:max-w-1/2 md:gap-6 md:px-4 lg:mt-24">
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
      <div className="mt-6 flex w-full flex-col items-center gap-3 px-3 md:mt-20 md:max-w-1/2 md:gap-4 md:px-4">
        <div className="flex flex-col items-center pb-0.5 pt-3">
          <h2 className="text-xl font-display font-semibold leading-tight tracking-tight text-foreground">
            {content.offers.title}
          </h2>
          <p className="text-xs leading-normal text-muted-foreground md:text-sm md:tracking-tight">
            {content.offers.subtitle}
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3 md:gap-4">
          <OfferCard data={offerData} />
          <div className="h-px w-full bg-border md:hidden" />
          <OfferCard data={offerData} />
          <div className="h-px w-full bg-border md:hidden" />
          <OfferCard data={offerData} />
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}
