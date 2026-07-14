import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import { PropertiesSidebar } from "../components/properties-sidebar";
import { INITIAL_FILTERS, type Filters } from "../components/properties-filters";
import { AMENITY_PREVIEW_COUNT } from "../components/amenity-taxonomy";

// Radix Slider (rendered in the price section) needs ResizeObserver, absent in jsdom.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Minimal intlayer stub: labels echo their key so we can assert on slugs.
const echoProxy = new Proxy(
  {},
  { get: (_target, key) => String(key) },
) as Record<string, string>;

vi.mock("react-intlayer", () => ({
  useIntlayer: () => ({
    filters: {
      heading: "Filter by:",
      clear: "Clear all",
      price: { label: "Budget", currency: "EUR" },
      popularFilters: new Proxy(
        { label: "Popular filters" },
        { get: (t: Record<string, string>, k: string) => t[k] ?? String(k) },
      ),
      propertyType: new Proxy(
        { label: "Property type" },
        { get: (t: Record<string, string>, k: string) => t[k] ?? String(k) },
      ),
      rating: { label: "Rating", above: "+" },
      bedrooms: { label: "Bedrooms" },
      amenities: {
        label: "Amenities",
        showMore: "Show more",
        showLess: "Show less",
        categories: echoProxy,
        items: echoProxy,
      },
    },
  }),
}));

function renderSidebar(overrides: Partial<Filters> = {}, onToggle = vi.fn()) {
  const filters: Filters = { ...INITIAL_FILTERS, ...overrides };
  render(
    <PropertiesSidebar
      filters={filters}
      hasActiveFilters={false}
      onSet={vi.fn()}
      onPriceChange={vi.fn()}
      onToggleArray={onToggle}
      onClear={vi.fn()}
    />,
  );
  return onToggle;
}

describe("PropertiesSidebar grouped amenities", () => {
  afterEach(cleanup);

  it("renders category headings once the Amenities section is opened", () => {
    renderSidebar();
    // The section is collapsed by default; open it.
    fireEvent.click(screen.getByRole("button", { name: "Amenities" }));
    expect(screen.getByText("views")).toBeTruthy();
    expect(screen.getByText("comfort")).toBeTruthy();
    // A preview amenity from the first group is visible.
    expect(screen.getByText("sea_view")).toBeTruthy();
  });

  it("hides overflow amenities behind a per-group show-more toggle", () => {
    renderSidebar();
    fireEvent.click(screen.getByRole("button", { name: "Amenities" }));
    // `comfort` has 9 slugs; the 6th (`dryer`) is hidden until expanded.
    expect(screen.queryByText("dryer")).toBeNull();
    const showMoreButtons = screen.getAllByRole("button", {
      name: "Show more",
    });
    // Categories exceeding the preview count each get a toggle.
    expect(showMoreButtons.length).toBeGreaterThan(0);
    // Expand the comfort group (its slug order puts `dryer` past the preview).
    const comfortGroup = screen.getByText("comfort").parentElement!;
    fireEvent.click(
      within(comfortGroup).getByRole("button", { name: "Show more" }),
    );
    expect(screen.getByText("dryer")).toBeTruthy();
  });

  it("invokes onToggleArray with the amenities key and slug", () => {
    const onToggle = renderSidebar();
    fireEvent.click(screen.getByRole("button", { name: "Amenities" }));
    fireEvent.click(screen.getByText("sea_view"));
    expect(onToggle).toHaveBeenCalledWith("amenities", "sea_view");
  });

  it("previews exactly AMENITY_PREVIEW_COUNT items for a large group", () => {
    renderSidebar();
    fireEvent.click(screen.getByRole("button", { name: "Amenities" }));
    // `comfort` group: wifi, air_conditioning, heating, fireplace,
    // washing_machine visible (5), the rest hidden.
    expect(screen.getByText("washing_machine")).toBeTruthy();
    expect(screen.queryByText("iron")).toBeNull();
    expect(AMENITY_PREVIEW_COUNT).toBe(5);
  });
});
