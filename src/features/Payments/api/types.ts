export interface PaymentCapabilities {
  can_accept_card: boolean;
  can_accept_bank_transfer: boolean;
}

export interface ConnectStatus {
  connected: boolean;
  verified: boolean;
  transfers_active: boolean;
  stripe_account_id: string | null;
  requirements_outstanding: boolean;
  requirements_eventually_due: boolean;
}

export interface BankAccountResponse {
  id: string;
  owner_id: string;
  iban: string;
  bic: string | null;
  bank_name: string | null;
  account_holder: string;
  updated_at: string;
}

export interface BankAccountUpsert {
  iban: string;
  bic?: string | null;
  bank_name?: string | null;
  account_holder: string;
}
