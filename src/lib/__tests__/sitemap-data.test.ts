import { describe, it, expect, afterEach, vi } from "vitest";
import { fetchActiveListingRoutes } from "../sitemap-data";

function mockFetchSequence(responses: Array<{ items: unknown; total?: number; ok?: boolean }>): void {
  let call = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      const r = responses[Math.min(call++, responses.length - 1)];
      return {
        ok: r.ok ?? true,
        json: async () => r.items,
        headers: { get: (k: string) => (k.toLowerCase() === "x-total-count" ? String(r.total ?? "") : null) },
      } as unknown as Response;
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("fetchActiveListingRoutes", () => {
  it("maps active listings to /properties/{id} routes", async () => {
    mockFetchSequence([{ items: [{ id: "a" }, { id: "b" }], total: 2 }]);
    const routes = await fetchActiveListingRoutes();
    expect(routes.map((r) => r.path)).toEqual(["/properties/a", "/properties/b"]);
    expect(routes[0]).toMatchObject({ changefreq: "weekly", priority: 0.8 });
  });

  it("stops paging once the running count reaches X-Total-Count", async () => {
    const full = Array.from({ length: 500 }, (_, i) => ({ id: `p${i}` }));
    mockFetchSequence([
      { items: full, total: 501 },
      { items: [{ id: "last" }], total: 501 },
      { items: [], total: 501 },
    ]);
    const routes = await fetchActiveListingRoutes();
    expect(routes).toHaveLength(501);
    expect(routes.at(-1)?.path).toBe("/properties/last");
  });

  it("returns [] when the API responds non-ok", async () => {
    mockFetchSequence([{ items: [], ok: false }]);
    expect(await fetchActiveListingRoutes()).toEqual([]);
  });

  it("returns [] when fetch throws", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network"); }));
    expect(await fetchActiveListingRoutes()).toEqual([]);
  });
});
