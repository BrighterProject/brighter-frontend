import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Clock,
  CreditCard,
  ExternalLink,
  Landmark,
  Pencil,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProperty } from "@Properties/api/hooks";
import type { PaymentMethodOption } from "@Properties/api/types";
import {
  useConnectStatus,
  useMyBankAccount,
  usePaymentCapabilities,
  useUpdatePropertyPaymentConfig,
  useUpsertBankAccount,
} from "@/features/Payments/api/hooks";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StatusBadge({ ok, pending }: { ok: boolean; pending?: boolean }) {
  if (pending)
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
        <Clock className="size-3" />
        Pending
      </span>
    );
  return ok ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
      <CheckCircle2 className="size-3" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-muted bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
      <X className="size-3" />
      Not set up
    </span>
  );
}

// ---------------------------------------------------------------------------
// Stripe Connect status card
// ---------------------------------------------------------------------------

function StripeConnectCard() {
  const { data: status, isLoading } = useConnectStatus();

  if (isLoading)
    return (
      <div className="h-20 animate-pulse rounded-xl border bg-muted/30" />
    );

  const isActive =
    status?.connected &&
    status.transfers_active &&
    !status.requirements_outstanding;

  const isPending =
    status?.connected &&
    !status.transfers_active &&
    !status.requirements_outstanding;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CreditCard className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium text-foreground">Card payments (Stripe)</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {isActive
                ? "Stripe is connected. You can accept card payments."
                : isPending
                  ? "Stripe is connected but your account is still being verified."
                  : status?.requirements_outstanding
                    ? "Stripe requires you to complete missing information before payouts resume."
                    : "Connect Stripe to accept credit and debit card payments."}
            </p>
            {status?.requirements_outstanding && (
              <p className="mt-1.5 text-sm font-medium text-destructive">
                Action required — payouts are paused until you resolve outstanding
                Stripe requirements.
              </p>
            )}
          </div>
        </div>
        <StatusBadge ok={!!isActive} pending={!!isPending} />
      </div>

      {!isActive && (
        <div className="mt-4">
          <a
            href="/admin/settings/payments"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {status?.requirements_outstanding
              ? "Complete Stripe requirements"
              : status?.connected
                ? "Resume Stripe verification"
                : "Set up Stripe Connect"}
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bank account card (with inline edit)
// ---------------------------------------------------------------------------

function BankAccountCard() {
  const { data: account, isLoading } = useMyBankAccount();
  const upsert = useUpsertBankAccount();
  const [editing, setEditing] = useState(false);
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function openEdit() {
    setIban(account?.iban ?? "");
    setBic(account?.bic ?? "");
    setBankName(account?.bank_name ?? "");
    setAccountHolder(account?.account_holder ?? "");
    setFormError(null);
    setSaved(false);
    setEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const ibanClean = iban.trim().replace(/\s/g, "");
    if (!ibanClean || !accountHolder.trim()) {
      setFormError("IBAN and account holder name are required.");
      return;
    }
    try {
      await upsert.mutateAsync({
        iban: ibanClean,
        bic: bic.trim() || null,
        bank_name: bankName.trim() || null,
        account_holder: accountHolder.trim(),
      });
      setSaved(true);
      setEditing(false);
    } catch {
      setFormError("Failed to save bank account. Please check the details and try again.");
    }
  }

  if (isLoading)
    return (
      <div className="h-20 animate-pulse rounded-xl border bg-muted/30" />
    );

  const inputCls =
    "h-9 w-full rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Landmark className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium text-foreground">Bank transfer</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {account
                ? `Guests transfer directly to ${account.account_holder} — ${account.iban.slice(0, 4)}••••${account.iban.slice(-4)}.`
                : "Add your bank account so guests can pay you via bank transfer."}
            </p>
            {saved && (
              <p className="mt-1 text-xs font-medium text-emerald-600">
                Bank account saved.
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge ok={!!account} />
          {!editing && (
            <button
              type="button"
              onClick={openEdit}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={account ? "Edit bank account" : "Add bank account"}
            >
              <Pencil className="size-4" />
            </button>
          )}
        </div>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                IBAN *
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="BG80BNBG96611020345678"
                className={inputCls}
                maxLength={34}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                BIC / SWIFT
              </label>
              <input
                type="text"
                value={bic}
                onChange={(e) => setBic(e.target.value)}
                placeholder="BNBGBGSD"
                className={inputCls}
                maxLength={11}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                Account holder name *
              </label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Ivan Petrov"
                className={inputCls}
                maxLength={200}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                Bank name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="DSK Bank"
                className={inputCls}
                maxLength={100}
              />
            </div>
          </div>

          {formError && (
            <p className="text-sm text-destructive">{formError}</p>
          )}

          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={upsert.isPending}>
              {upsert.isPending ? "Saving…" : "Save bank account"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment method toggle row
// ---------------------------------------------------------------------------

const METHOD_META: Record<
  PaymentMethodOption,
  { label: string; icon: React.ReactNode; hint: string }
> = {
  card: {
    label: "Credit / Debit card",
    icon: <CreditCard className="size-4" />,
    hint: "Guests pay securely via Stripe at booking time.",
  },
  bank_transfer: {
    label: "Bank transfer",
    icon: <Landmark className="size-4" />,
    hint: "Guests transfer directly to your bank account.",
  },
  cash: {
    label: "Cash (on arrival)",
    icon: <Wallet className="size-4" />,
    hint: "Guests pay in cash when they arrive.",
  },
};

interface MethodRowProps {
  method: PaymentMethodOption;
  enabled: boolean;
  disabled: boolean;
  disabledReason: string | null;
  onToggle: (method: PaymentMethodOption, enabled: boolean) => void;
}

function MethodRow({
  method,
  enabled,
  disabled,
  disabledReason,
  onToggle,
}: MethodRowProps) {
  const meta = METHOD_META[method];
  return (
    <div
      className={`flex items-start gap-4 rounded-xl border px-4 py-3.5 transition-colors ${
        disabled ? "bg-muted/30 opacity-75" : "bg-background"
      }`}
    >
      <div className="mt-0.5 text-muted-foreground">{meta.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{meta.label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{meta.hint}</p>
        {disabled && disabledReason && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <AlertTriangle className="size-3.5 shrink-0" />
            {disabledReason}
          </p>
        )}
      </div>
      <label className="relative mt-0.5 inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={enabled}
          disabled={disabled}
          onChange={(e) => onToggle(method, e.target.checked)}
          className="sr-only"
          aria-label={`Enable ${meta.label}`}
        />
        <div
          className={`h-5 w-9 rounded-full transition-colors ${
            enabled
              ? "bg-primary"
              : "bg-muted"
          } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div
            className={`mt-0.5 h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-4" : ""
            }`}
          />
        </div>
      </label>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function PaymentSettingsPage() {
  const { propertyId } = Route.useParams();
  const navigate = useNavigate();

  const { data: property, isLoading: propLoading } = useProperty(propertyId);
  const { data: caps, isLoading: capsLoading } = usePaymentCapabilities();
  const updateConfig = useUpdatePropertyPaymentConfig(propertyId);

  const currentMethods: PaymentMethodOption[] =
    property?.payment_config?.accepted_methods ?? ["card"];

  const [methods, setMethods] = useState<PaymentMethodOption[] | null>(null);
  const activeMethods = methods ?? currentMethods;

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleToggle(method: PaymentMethodOption, checked: boolean) {
    setMethods((prev) => {
      const base = prev ?? currentMethods;
      return checked
        ? [...base, method]
        : base.filter((m) => m !== method);
    });
    setSaved(false);
    setSaveError(null);
  }

  async function handleSave() {
    setSaveError(null);
    if (activeMethods.length === 0) {
      setSaveError("Enable at least one payment method.");
      return;
    }
    try {
      await updateConfig.mutateAsync({
        accepted_methods: activeMethods,
        deposit_pct: property?.payment_config?.deposit_pct ?? 100,
        remaining_method: property?.payment_config?.remaining_method ?? null,
      });
      setSaved(true);
      setMethods(null);
    } catch (e: unknown) {
      const detail =
        (e as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Failed to save. Please try again.";
      setSaveError(detail);
    }
  }

  const isLoading = propLoading || capsLoading;

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );

  if (!property)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Property not found.</p>
      </div>
    );

  const METHODS: PaymentMethodOption[] = ["card", "bank_transfer", "cash"];

  function disabledReason(method: PaymentMethodOption): string | null {
    if (method === "card" && !caps?.can_accept_card)
      return "Connect and verify your Stripe account first to enable card payments.";
    if (method === "bank_transfer" && !caps?.can_accept_bank_transfer)
      return "Add your bank account details below to enable bank transfers.";
    return null;
  }

  const isDirty = methods !== null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <button
        type="button"
        onClick={() =>
          navigate({
            to: "/{-$locale}/properties/$propertyId" as any,
            params: { propertyId } as any,
          })
        }
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to property
      </button>

      <h1 className="mb-1 font-display text-2xl font-bold tracking-tight text-foreground">
        Payment settings
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Control which payment methods guests can use when booking this property.
      </p>

      {/* ── Your payment setup ─────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Your payment setup
        </h2>
        <div className="space-y-3">
          <StripeConnectCard />
          <BankAccountCard />
        </div>
      </section>

      {/* ── Methods enabled for this property ─────────────────── */}
      <section>
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Accepted on this property
        </h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Toggle which methods guests see at checkout for this listing.
        </p>

        <div className="space-y-2">
          {METHODS.map((method) => {
            const reason = disabledReason(method);
            return (
              <MethodRow
                key={method}
                method={method}
                enabled={activeMethods.includes(method)}
                disabled={reason !== null}
                disabledReason={reason}
                onToggle={handleToggle}
              />
            );
          })}
        </div>

        {saveError && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            {saveError}
          </p>
        )}
        {saved && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle2 className="size-4 shrink-0" />
            Payment methods saved.
          </p>
        )}

        <Button
          className="mt-4"
          onClick={handleSave}
          disabled={updateConfig.isPending || !isDirty}
        >
          {updateConfig.isPending ? "Saving…" : "Save changes"}
        </Button>
      </section>
    </div>
  );
}

export const Route = createFileRoute(
  "/{-$locale}/owner/properties/$propertyId/payment-settings",
)({
  component: PaymentSettingsPage,
});
