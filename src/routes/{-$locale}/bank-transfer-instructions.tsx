import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";
import apiClient from "@/lib/api-client";
import type { BankTransferResponse } from "@/features/Bookings/api/types";

const searchSchema = z.object({
  intentId: z.string(),
});

export const Route = createFileRoute("/{-$locale}/bank-transfer-instructions")({
  validateSearch: searchSchema,
  component: BankTransferInstructionsPage,
});

function useBankTransferIntent(intentId: string) {
  return useQuery<BankTransferResponse>({
    queryKey: ["bank-transfer", intentId],
    queryFn: () =>
      apiClient
        .get<BankTransferResponse>(`/payments/bank-transfer/${intentId}`)
        .then((r) => r.data),
    enabled: !!intentId,
    retry: false,
  });
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-2 text-muted-foreground transition-colors hover:text-foreground"
      title="Copy"
    >
      {copied ? (
        <CheckCircle2 className="size-4 text-chart-4" />
      ) : (
        <Copy className="size-4" />
      )}
    </button>
  );
}

function BankTransferInstructionsPage() {
  const { intentId } = Route.useSearch();
  const navigate = useNavigate();
  const { data: intent, isLoading, isError } = useBankTransferIntent(intentId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  if (isError || !intent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive text-sm">
          Could not load payment details.
        </p>
      </div>
    );
  }

  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: "Bank", value: intent.bank_name },
    { label: "Account holder", value: intent.account_holder },
    { label: "IBAN", value: intent.bank_iban, mono: true },
    { label: "BIC / SWIFT", value: intent.bank_bic, mono: true },
    { label: "Reference", value: intent.reference, mono: true },
    {
      label: "Amount",
      value: `${Number(intent.amount).toFixed(2)} ${intent.currency}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-6 text-primary" />
        </div>

        <h1 className="mb-2 font-display text-2xl font-bold tracking-tight">
          Bank Transfer Instructions
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Your booking is reserved. Please transfer the amount below within{" "}
          <strong>48 hours</strong> to confirm it. Always include the reference
          number.
        </p>

        <div className="rounded-2xl border bg-card shadow-sm">
          <dl className="divide-y">
            {rows.map(({ label, value, mono }) => (
              <div key={label} className="flex items-center justify-between px-5 py-4">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className={`flex items-center text-sm font-medium ${mono ? "font-mono" : ""}`}>
                  {value}
                  {mono && <CopyButton value={value} />}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Your booking will be confirmed once the property owner verifies
          receipt. You will be notified by email.
        </p>

        <button
          type="button"
          onClick={() => navigate({ to: "/{-$locale}/bookings" as any } as any)}
          className="mt-8 text-sm text-primary hover:underline"
        >
          View my bookings →
        </button>
      </div>
    </div>
  );
}
