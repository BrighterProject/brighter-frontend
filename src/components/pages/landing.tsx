import { useIntlayer } from "react-intlayer";
import { SearchCard } from "@/components/ui/search-card";
import { OfferCard } from "@Properties/components/offer-card";

export function Landing() {
  const content = useIntlayer("landing-page");

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
          <h2 className="text-xl font-semibold leading-tight tracking-tight text-foreground">
            {content.offers.title}
          </h2>
          <p className="text-xs leading-normal text-muted-foreground md:text-sm md:tracking-tight">
            {content.offers.subtitle}
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3 md:gap-4">
          <OfferCard content={content.offerCard} />
          <div className="h-px w-full bg-border md:hidden" />
          <OfferCard content={content.offerCard} />
          <div className="h-px w-full bg-border md:hidden" />
          <OfferCard content={content.offerCard} />
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}
