import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { CheckCircle2, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useIntlayer } from "react-intlayer";
import apiClient from "@/lib/api-client";
import type { BankTransferResponse } from "@/features/Bookings/api/types";

const searchSchema = z.object({
  intentId: z.string(),
});

export const Route = createFileRoute("/{-$locale}/bank-transfer-instructions")({
  validateSearch: searchSchema,
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    try {
      await apiClient.get("/users/@me/get");
    } catch {
      throw redirect({
        to: "/{-$locale}/auth/login",
        params: { locale: location.pathname.split("/")[1] || "bg" },
        search: { redirect: location.href },
      });
    }
  },
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
  const content = useIntlayer("bank-transfer-instructions");
  const { data: intent, isLoading, isError } = useBankTransferIntent(intentId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground text-sm">
        {content.loading}
      </div>
    );
  }

  if (isError || !intent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive text-sm">{content.error}</p>
      </div>
    );
  }

  const rows: { label: string | ReactNode; value: string; mono?: boolean }[] = [
    { label: content.labels.bank, value: intent.bank_name },
    { label: content.labels.accountHolder, value: intent.account_holder },
    { label: content.labels.iban, value: intent.bank_iban, mono: true },
    { label: content.labels.bic, value: intent.bank_bic, mono: true },
    { label: content.labels.reference, value: intent.reference, mono: true },
    {
      label: content.labels.amount,
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
          {content.heading}
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          {content.body}
        </p>

        <div className="rounded-2xl border bg-card shadow-sm">
          <dl className="divide-y">
            {rows.map(({ label, value, mono }, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className={`flex items-center text-sm font-medium ${mono ? "font-mono" : ""}`}>
                  {value}
                  {mono && <CopyButton value={value} />}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">{content.footer}</p>

        <button
          type="button"
          onClick={() => navigate({ to: "/{-$locale}/bookings" as any } as any)}
          className="mt-8 text-sm text-primary hover:underline"
        >
          {content.viewBookings}
        </button>
      </div>
    </div>
  );
}
