import { usePriceResolution } from "@/features/Properties/api/hooks";

interface PriceBreakdownProps {
  propertyId: string;
  startDate: string;
  endDate: string;
  /** Fallback flat rate (shown while loading or on error) */
  basePricePerNight: string;
  currency: string;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  const hasDynamicPrices = data.nights.some((n) => n.source !== "base");

  return (
    <div className="space-y-1 text-sm">
      {hasDynamicPrices ? (
        <>
          {data.nights.map((night) => (
            <div key={night.date} className="flex justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                {formatDate(night.date)}
                {night.source === "date_override" && night.label && (
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                    {night.label}
                  </span>
                )}
                {night.source === "weekday" && (
                  <span className="text-xs text-muted-foreground/70">
                    ({DAY_LABELS[new Date(night.date + "T00:00:00").getDay() === 0 ? 6 : new Date(night.date + "T00:00:00").getDay() - 1]})
                  </span>
                )}
              </span>
              <span className="font-medium text-foreground">
                {Number(night.price).toFixed(0)} {data.currency}
              </span>
            </div>
          ))}
        </>
      ) : (
        <div className="text-muted-foreground">
          {nights} {nights === 1 ? "night" : "nights"} ×{" "}
          {Number(data.nights[0]?.price ?? basePricePerNight).toFixed(0)} {data.currency}
        </div>
      )}

      <div className="flex justify-between border-t pt-2 text-base font-semibold text-foreground">
        <span>Total</span>
        <span>
          {Number(data.total).toFixed(2)} {data.currency}
        </span>
      </div>
    </div>
  );
}
