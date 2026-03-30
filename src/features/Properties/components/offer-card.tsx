export type { OfferCardData } from "./offer-card-types";
import { OfferCardMobile } from "./offer-card-mobile";
import { OfferCardDesktop } from "./offer-card-desktop";
import type { OfferCardData } from "./offer-card-types";

interface OfferCardProps {
  data: OfferCardData;
}

export function OfferCard({ data }: OfferCardProps) {
  return (
    <>
      <OfferCardMobile data={data} />
      <OfferCardDesktop data={data} />
    </>
  );
}
