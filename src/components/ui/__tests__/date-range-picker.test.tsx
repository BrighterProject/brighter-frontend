import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { DateRangePicker, isoDate } from "../date-range-picker";
import type { PropertyUnavailabilityResponse } from "@/features/Properties/api/types";

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

describe("DateRangePicker", () => {
  afterEach(() => cleanup());

  it("does not render a price under an unavailable (price-gap) day", () => {
    const t = today();
    const priceGap: PropertyUnavailabilityResponse = {
      id: "gap-1",
      property_id: "p1",
      start_date: isoDate(t),
      end_date: isoDate(addDays(t, 365)),
      reason: "Няма зададена цена за тази дата",
    };
    const pricingMap: Record<string, string> = {};
    for (let i = 0; i < 30; i++) pricingMap[isoDate(addDays(t, i))] = "50.00";

    render(
      <DateRangePicker
        value={{ checkIn: null, checkOut: null }}
        onChange={() => {}}
        unavailabilities={[priceGap]}
        pricingMap={pricingMap}
      />,
    );

    // The whole visible month is inside the gap — no price text should appear anywhere.
    expect(screen.queryByText("50")).toBeNull();
  });

  it("shows a price under a normal bookable day", () => {
    const t = today();
    const pricingMap: Record<string, string> = {};
    for (let i = 0; i < 30; i++) pricingMap[isoDate(addDays(t, i))] = "50.00";

    render(
      <DateRangePicker
        value={{ checkIn: null, checkOut: null }}
        onChange={() => {}}
        pricingMap={pricingMap}
      />,
    );

    expect(screen.getAllByText("50").length).toBeGreaterThan(0);
  });

  it("does not treat today as a turnover-only checkout day when a block already covers it", () => {
    const t = today();
    const gap: PropertyUnavailabilityResponse = {
      id: "gap-1",
      property_id: "p1",
      start_date: isoDate(t),
      end_date: isoDate(addDays(t, 10)),
      reason: "Няма зададена цена за тази дата",
    };

    render(
      <DateRangePicker
        value={{ checkIn: null, checkOut: null }}
        onChange={() => {}}
        unavailabilities={[gap]}
      />,
    );

    const todayCell = screen.getByLabelText(isoDate(t));
    fireEvent.click(todayCell);
    // Clicking a blocked day should not surface the checkout-only hint.
    expect(screen.queryByText("You can only check out here.")).toBeNull();
  });

  it("shows the checkout-only hint for a block that starts after today", () => {
    const t = today();
    const futureBlock: PropertyUnavailabilityResponse = {
      id: "block-1",
      property_id: "p1",
      start_date: isoDate(addDays(t, 5)),
      end_date: isoDate(addDays(t, 8)),
      reason: "Maintenance",
    };

    render(
      <DateRangePicker
        value={{ checkIn: null, checkOut: null }}
        onChange={() => {}}
        unavailabilities={[futureBlock]}
      />,
    );

    const startCell = screen.getByLabelText(isoDate(addDays(t, 5)));
    fireEvent.click(startCell);
    expect(screen.getByText("You can only check out here.")).toBeTruthy();
  });

  it("greys out and disables the last day of the booking window (maxDate is exclusive)", () => {
    const t = today();
    const maxDate = addDays(t, 10);

    render(
      <DateRangePicker
        value={{ checkIn: null, checkOut: null }}
        onChange={() => {}}
        maxDate={maxDate}
      />,
    );

    const boundaryCell = screen.getByLabelText(isoDate(maxDate));
    expect(boundaryCell.getAttribute("tabindex")).toBe("-1");

    const lastPickableCell = screen.getByLabelText(isoDate(addDays(maxDate, -1)));
    expect(lastPickableCell.getAttribute("tabindex")).toBe("0");
  });
});
