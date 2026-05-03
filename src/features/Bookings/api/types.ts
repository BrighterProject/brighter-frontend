export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface PaymentResponse {
  id: string;
  booking_id: string;
  user_id: string;
  property_owner_id: string;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  amount: string;
  currency: string;
  status: PaymentStatus;
  updated_at: string;
}

export interface CheckoutResponse {
  checkout_url: string;
  session_id: string;
  payment_id: string;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface OccupiedSlot {
  start_date: string;
  end_date: string;
}

export interface BookingCreate {
  property_id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  num_guests?: number;
  guest_name?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
  guest_country?: string | null;
  special_requests?: string | null;
}

export interface BookingResponse {
  id: string;
  property_id: string;
  property_owner_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  price_per_night: string;
  total_price: string;
  currency: string;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  guest_country: string | null;
  special_requests: string | null;
  updated_at: string;
  gap_adjustment_pct?: number;
}
