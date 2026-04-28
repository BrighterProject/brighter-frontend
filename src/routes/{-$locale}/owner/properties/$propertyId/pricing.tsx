import { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ChevronLeft, Plus, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { useProperty } from "@/features/Properties/api/hooks";
import {
  useDateOverrides,
  useDeleteDateOverride,
  useCreateDateOverride,
  useUpdateDateOverride,
  useWeekdayPrices,
  useUpsertWeekdayPrices,
} from "@/features/Properties/api/hooks";
import type { DatePriceOverride } from "@/features/Properties/api/types";

const WEEKDAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// ---------------------------------------------------------------------------
// Weekday grid
// ---------------------------------------------------------------------------

interface WeekdayGridProps {
  propertyId: string;
  basePricePerNight: string;
  currency: string;
}

function WeekdayGrid({ propertyId, basePricePerNight, currency }: WeekdayGridProps) {
  const { data: existing } = useWeekdayPrices(propertyId);
  const upsert = useUpsertWeekdayPrices(propertyId);

  // local state: weekday -> price string | null (null = use base)
  const [prices, setPrices] = useState<(string | null)[]>(() => {
    const map = Object.fromEntries((existing ?? []).map((w) => [w.weekday, w.price]));
    return Array.from({ length: 7 }, (_, i) => map[i] ?? null);
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePriceChange(i: number, value: string) {
    setPrices((prev) => {
      const next = [...prev];
      next[i] = value === "" ? null : value;
      return next;
    });
    setSaved(false);
  }

  function handleToggle(i: number, useBase: boolean) {
    setPrices((prev) => {
      const next = [...prev];
      next[i] = useBase ? null : basePricePerNight;
      return next;
    });
    setSaved(false);
  }

  async function handleSave() {
    setError(null);
    const rules = prices
      .map((price, weekday) => (price !== null ? { weekday, price } : null))
      .filter(Boolean) as { weekday: number; price: string }[];
    try {
      await upsert.mutateAsync(rules);
      setSaved(true);
    } catch {
      setError("Failed to save weekday prices. Please try again.");
    }
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="mb-1 font-display text-lg font-semibold text-foreground">
        Weekday Prices
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Override the price for specific days of the week. Leave "Use base" on to
        use the property's default price ({Number(basePricePerNight).toFixed(0)}{" "}
        {currency}/night).
      </p>

      <div className="space-y-2">
        {WEEKDAY_LABELS.map((label, i) => {
          const useBase = prices[i] === null;
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3"
            >
              <span className="w-24 text-sm font-medium text-foreground">{label}</span>

              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={useBase}
                  onChange={(e) => handleToggle(i, e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-muted"
                />
                Use base
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                disabled={useBase}
                value={useBase ? "" : (prices[i] ?? "")}
                onChange={(e) => handlePriceChange(i, e.target.value)}
                placeholder={basePricePerNight}
                className="ml-auto h-9 w-28 rounded-lg border bg-background px-3 text-right text-sm disabled:cursor-not-allowed disabled:opacity-40"
              />
              <span className="w-8 text-xs text-muted-foreground">{currency}</span>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="mt-3 text-sm text-destructive">{error}</p>
      )}

      <Button
        className="mt-5"
        onClick={handleSave}
        disabled={upsert.isPending}
      >
        {upsert.isPending ? "Saving…" : saved ? "Saved!" : "Save weekday prices"}
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Date override form
// ---------------------------------------------------------------------------

interface OverrideFormProps {
  propertyId: string;
  currency: string;
  editTarget?: DatePriceOverride;
  onDone: () => void;
}

function OverrideForm({ propertyId, currency, editTarget, onDone }: OverrideFormProps) {
  const create = useCreateDateOverride(propertyId);
  const update = useUpdateDateOverride(propertyId);

  const [startDate, setStartDate] = useState(editTarget?.start_date ?? "");
  const [endDate, setEndDate] = useState(editTarget?.end_date ?? "");
  const [price, setPrice] = useState(editTarget?.price ?? "");
  const [label, setLabel] = useState(editTarget?.label ?? "");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!startDate || !endDate || !price) {
      setError("Start date, end date and price are required.");
      return;
    }
    if (endDate < startDate) {
      setError("End date must be on or after start date.");
      return;
    }
    try {
      if (editTarget) {
        await update.mutateAsync({
          overrideId: editTarget.id,
          start_date: startDate,
          end_date: endDate,
          price,
          label: label || null,
        });
      } else {
        await create.mutateAsync({
          start_date: startDate,
          end_date: endDate,
          price,
          label: label || null,
        });
      }
      onDone();
    } catch {
      setError("Failed to save override. Please try again.");
    }
  }

  const isPending = create.isPending || update.isPending;
  const inputClass =
    "h-9 w-full rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="font-display text-sm font-semibold text-foreground">
        {editTarget ? "Edit override" : "Add date override"}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">
            Start date *
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">
            End date *
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">
            Price per night * ({currency})
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">
            Label (optional)
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Easter weekend"
            className={inputClass}
            maxLength={100}
          />
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Saving…" : editTarget ? "Update" : "Add"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Date overrides list
// ---------------------------------------------------------------------------

interface DateOverridesProps {
  propertyId: string;
  currency: string;
}

function DateOverrides({ propertyId, currency }: DateOverridesProps) {
  const { data: overrides = [] } = useDateOverrides(propertyId);
  const deleteOverride = useDeleteDateOverride(propertyId);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DatePriceOverride | undefined>(undefined);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Date Overrides
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Holiday or special-date prices (highest priority).
          </p>
        </div>
        {!showForm && !editing && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setShowForm(true)}
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        )}
      </div>

      {(showForm || editing) && (
        <div className="mb-4">
          <OverrideForm
            propertyId={propertyId}
            currency={currency}
            editTarget={editing}
            onDone={() => {
              setShowForm(false);
              setEditing(undefined);
            }}
          />
        </div>
      )}

      {overrides.length === 0 ? (
        <p className="text-sm text-muted-foreground">No date overrides yet.</p>
      ) : (
        <div className="space-y-2">
          {overrides.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between rounded-xl border bg-background px-4 py-3 text-sm"
            >
              <div>
                <span className="font-medium text-foreground">
                  {o.start_date} → {o.end_date}
                </span>
                {o.label && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {o.label}
                  </span>
                )}
                <div className="mt-0.5 text-muted-foreground">
                  {Number(o.price).toFixed(0)} {currency}/night
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditing(o);
                    setShowForm(false);
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Edit"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => deleteOverride.mutate(o.id)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function OwnerPricingPage() {
  const { propertyId } = Route.useParams();
  const navigate = useNavigate();
  const { data: property, isLoading } = useProperty(propertyId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Property not found.</p>
      </div>
    );
  }

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

      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-foreground">
        Pricing settings
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Set weekday rates and special-date overrides. Priority: date override ›
        weekday › base price.
      </p>

      <div className="space-y-6">
        <WeekdayGrid
          propertyId={propertyId}
          basePricePerNight={property.price_per_night}
          currency={property.currency}
        />
        <DateOverrides propertyId={propertyId} currency={property.currency} />
      </div>
    </div>
  );
}

export const Route = createFileRoute(
  "/{-$locale}/owner/properties/$propertyId/pricing",
)({
  component: OwnerPricingPage,
  beforeLoad: async ({ params }) => {
    try {
      const { data: me } = await apiClient.get("/users/@me/get");
      const scopes: string[] = me?.scopes ?? [];
      const hasScope = scopes.some(
        (s) => s === "properties:schedule" || s.startsWith("admin:"),
      );
      if (!hasScope) {
        throw redirect({ to: `/{-$locale}/properties/$propertyId` as any, params } as any);
      }
    } catch (err: any) {
      if (err?.isRedirect) throw err;
      throw redirect({ to: "/{-$locale}/auth/login" as any } as any);
    }
  },
});
