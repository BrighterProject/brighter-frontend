import { usePriceResolution } from "@/features/Properties/api/hooks";

interface PriceBreakdownProps {
  propertyId: string;
  startDate: string;
  endDate: string;
  /** Fallback flat rate (shown while loading or on error) */
  basePricePerNight: string;
  currency: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function PriceBreakdown({
  propertyId,
  startDate,
  endDate,
  basePricePerNight,
  currency,
}: PriceBreakdownProps) {
  const { data, isLoading, isError } = usePriceResolution(propertyId, startDate, endDate);

  const nights = Math.round(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000,
  );
  const fallbackTotal = (Number(basePricePerNight) * nights).toFixed(2);

  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        {Array.from({ length: Math.min(nights, 4) }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-muted" />
        ))}
        <div className="mt-2 h-5 w-1/2 rounded bg-muted" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-2 text-sm">
        <div className="text-muted-foreground">
          {nights} {nights === 1 ? "night" : "nights"} ×{" "}
          {Number(basePricePerNight).toFixed(0)} {currency}
        </div>
        <div className="flex justify-between border-t pt-2 text-base font-semibold text-foreground">
          <span>Total</span>
          <span>
            {fallbackTotal} {currency}
          </span>
        </div>
      </div>
    );
  }

  // Every night is priced from its own calendar row — list them out.
  return (
    <div className="space-y-1 text-sm">
      {data.nights.map((night) => (
        <div key={night.date} className="flex justify-between text-muted-foreground">
          <span>{formatDate(night.date)}</span>
          <span className="font-medium text-foreground">
            {Number(night.price).toFixed(0)} {data.currency}
          </span>
        </div>
      ))}

      <div className="flex justify-between border-t pt-2 text-base font-semibold text-foreground">
        <span>Total</span>
        <span>
          {Number(data.total).toFixed(2)} {data.currency}
        </span>
      </div>
    </div>
  );
}
