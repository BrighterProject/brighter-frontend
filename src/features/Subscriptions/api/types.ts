export type SubscriptionPlanSlug =
  | "starter"
  | "basic"
  | "pro"
  | "business"
  | "enterprise";

export interface SubscriptionPlan {
  id: string;
  slug: SubscriptionPlanSlug;
  name: string;
  max_listings: number;
  price_eur_cents: number;
  stripe_price_id: string | null;
}

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "cancelled"
  | "incomplete";

export interface OwnerSubscription {
  id: string;
  owner_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_end: string | null;
  cancelled_at: string | null;
}

export interface CheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export interface PortalResponse {
  portal_url: string;
}
