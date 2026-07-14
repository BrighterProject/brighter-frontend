export type Gender = "male" | "female" | "other";

export type DocumentType = "id_card" | "passport";

export interface GuestRosterSlot {
  filled: boolean;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  guest_id: string | null;
}

export interface GuestRosterResponse {
  property_name: string;
  property_city: string | null;
  start_date: string;
  end_date: string;
  total_slots: number;
  filled_slots: number;
  roster: GuestRosterSlot[];
}

export interface GuestIdentityCreate {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  date_of_birth: string; // YYYY-MM-DD
  gender: Gender;
  citizenship: string; // ISO 3166-1 alpha-2
  document_type: DocumentType;
  document_number: string;
  document_issuing_country: string; // ISO 3166-1 alpha-2
  pin_egn?: string | null;
}

export interface CheckinLinkResponse {
  token: string;
  expires_at: string; // YYYY-MM-DD
}
