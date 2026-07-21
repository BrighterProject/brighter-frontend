import { describe, it, expect } from "vitest";
import { trailingSlashRedirect } from "../trailing-slash";

describe("trailingSlashRedirect", () => {
  it("returns null for already-canonical paths", () => {
    expect(trailingSlashRedirect("/bg/properties/123")).toBeNull();
    expect(trailingSlashRedirect("/")).toBeNull();
    expect(trailingSlashRedirect("")).toBeNull();
  });

  it("strips a single trailing slash and preserves search + hash", () => {
    expect(trailingSlashRedirect("/bg/properties/123/")).toBe("/bg/properties/123");
    expect(trailingSlashRedirect("/bg/properties/", "?city=burgas", "#map")).toBe(
      "/bg/properties?city=burgas#map",
    );
  });

  it("collapses multiple trailing slashes and never yields an empty target", () => {
    expect(trailingSlashRedirect("/bg///")).toBe("/bg");
    expect(trailingSlashRedirect("//")).toBe("/");
  });
});
