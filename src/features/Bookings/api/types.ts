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
  start_datetime: string;
  end_datetime: string;
}

export interface BookingCreate {
  property_id: string;
  start_datetime: string; // ISO 8601
  end_datetime: string; // ISO 8601
  notes?: string | null;
}

export interface BookingResponse {
  id: string;
  property_id: string;
  property_owner_id: string;
  user_id: string;
  start_datetime: string;
  end_datetime: string;
  status: BookingStatus;
  price_per_night: string;
  total_price: string;
  currency: string;
  notes: string | null;
  updated_at: string;
}
