export interface OfferCardData {
  title: string;
  location: string;
  roomType: string;
  roomDetails: string;
  bedInfo: string;
  description: string;
  bedrooms?: number;
  maxGuests?: number;
  totalReviews?: number;
  scarcity?: string;
  perk?: string;
  rating: string;
  ratingScore: string;
  priceLabel?: string;
  price: string;
  priceNote?: string;
  cta: string;
  image?: string | null;
  onClick?: () => void;
}
